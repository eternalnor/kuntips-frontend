// src/components/TipsWidget.jsx
import { useState, useMemo, useEffect, useRef } from 'react';
import { containsBlockedContent } from '../utils/wordFilter.js';
import { useTipLang } from '../hooks/useTipLang.js';
import LangFlagToggle from './LangFlagToggle.jsx';
import { hasMarketingConsent } from '../consent.js';
import { loadStripe } from '@stripe/stripe-js/pure';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Defaults used until the backend /settings/tips response arrives.
// These also act as the fallback if the fetch fails for any reason.
const DEFAULT_MIN_TIP = 50;
const DEFAULT_MAX_TIP = 2000;
const DEFAULT_PRESETS = [50, 100, 250, 500, 1000];

const KUNTIPS_FEE_RATE = 0.05; // 5% KunTips service fee
const PROCESSOR_FEE_RATE = 0.9675; // 3.25% Stripe processor fee
const STRIPE_FIXED_FEE = 2; // 1.80NOK Stripe fixed fee

// Fallback if backend doesn't send a value yet
const DEFAULT_CREATOR_KEPT_PERCENT = 95;

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

// Lazy: Stripe.js must only load when a tip page actually renders. A top-level
// loadStripe would fetch js.stripe.com (and let it set cookies) on every route
// of the SPA — which would make the Cookie Policy's "only loads on tip pages"
// disclosure false. Deliberately initialised on first TipWidget mount instead.
let stripePromise = null;
function getStripePromise() {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
}

export function TipWidget({
  creatorUsername,
  creatorDisplayName,
  creatorKeptPercent = DEFAULT_CREATOR_KEPT_PERCENT,
}) {
  const { t, tf } = useTipLang();

  // Dynamic tip limits from backend (with safe defaults so the page still works
  // if the fetch fails or hasn't returned yet).
  const [minTip, setMinTip] = useState(DEFAULT_MIN_TIP);
  const [maxTip, setMaxTip] = useState(DEFAULT_MAX_TIP);
  const [presetAmounts, setPresetAmounts] = useState(DEFAULT_PRESETS);

  const [tipAmount, setTipAmount] = useState(DEFAULT_MIN_TIP);
  const [inputValue, setInputValue] = useState(String(DEFAULT_MIN_TIP));
  const [tipperName, setTipperName] = useState("");
  const [tipperEmail, setTipperEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  // Track completed payments + fun message
  const [tipCompleted, setTipCompleted] = useState(false);
  const [funMessage, setFunMessage] = useState('');

  // Lock the tip selection whenever a Stripe session is active.
  // It stays locked until the user clicks "Send another tip",
  // which resets clientSecret back to null.
  const isLocked = !!clientSecret;

  // Thank-you overlay state
  const [showThankYouOverlay, setShowThankYouOverlay] = useState(false);
  const [overlayLocked, setOverlayLocked] = useState(false);
  const [overlayClosing, setOverlayClosing] = useState(false);
  const overlayTimerRef = useRef(null);
  const [lastTipSummary, setLastTipSummary] = useState(null);

  // Fetch tip settings once on mount. Falls back silently to defaults on failure.
  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE_URL}/settings/tips`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const newMin = Number(data.min_nok) || DEFAULT_MIN_TIP;
        const newMax = Number(data.max_nok) || DEFAULT_MAX_TIP;
        const newPresets = Array.isArray(data.presets) && data.presets.length > 0
          ? data.presets.map((n) => Number(n)).filter((n) => Number.isFinite(n))
          : DEFAULT_PRESETS;
        setMinTip(newMin);
        setMaxTip(newMax);
        setPresetAmounts(newPresets);
        // Snap the initial selection to the new minimum if user hasn't typed anything yet
        setTipAmount((prev) => (prev === DEFAULT_MIN_TIP ? newMin : prev));
        setInputValue((prev) => (prev === String(DEFAULT_MIN_TIP) ? String(newMin) : prev));
      })
      .catch(() => { /* defaults already set */ });
    return () => { cancelled = true; };
  }, []);

  const safeTip = useMemo(() => {
    if (Number.isNaN(tipAmount)) return minTip;
    return tipAmount;
  }, [tipAmount, minTip]);

  const breakdown = useMemo(() => {
    const T = safeTip;

    const totalCharged =
        (T * (1 + KUNTIPS_FEE_RATE) / (PROCESSOR_FEE_RATE)) + 2;
    const processorFee = totalCharged - T;

    // Clamp keptPercent to [0, 100] just to be safe
    const clampedKeptPercent = Math.min(
      100,
      Math.max(0, Number(creatorKeptPercent) || DEFAULT_CREATOR_KEPT_PERCENT),
    );
    const creatorShare = clampedKeptPercent / 100;

    const creatorReceives = T * creatorShare;
    const creatorPercentage = clampedKeptPercent;

    const format = (value) => value.toFixed(2);
    const format0 = (value) => value.toFixed(0);

    return {
      tip: format(T),
      totalCharged: format(totalCharged),
      processorFee: format(processorFee),
      creatorReceives: format(creatorReceives),
      creatorPercentage: format0(creatorPercentage),
    };
  }, [safeTip, creatorKeptPercent]);

  // Show the thank-you overlay when a payment succeeds
  const triggerThankYouOverlay = () => {
    // Clear any previous timer
    if (overlayTimerRef.current) {
      clearTimeout(overlayTimerRef.current);
      overlayTimerRef.current = null;
    }

    // Capture the current breakdown values at the moment of success
    setLastTipSummary({
      tip: breakdown.tip,
      creatorReceives: breakdown.creatorReceives,
    });

    setOverlayClosing(false);
    setShowThankYouOverlay(true);
    setOverlayLocked(true);

    // Keep the overlay visible for at least 3 seconds
    overlayTimerRef.current = setTimeout(() => {
      setOverlayLocked(false);
      overlayTimerRef.current = null;
    }, 3000);
  };

  const requestOverlayClose = () => {
    // Do nothing if it's not visible or still locked
    if (!showThankYouOverlay || overlayLocked) {
      return;
    }

    // Start fade-out animation
    setOverlayClosing(true);

    // Remove from DOM after animation completes (1s)
    setTimeout(() => {
      setShowThankYouOverlay(false);
      setOverlayClosing(false);
    }, 1000);
  };



  // Auto-hide overlay after 3s on scroll or click
  useEffect(() => {
    if (!showThankYouOverlay) {
      return;
    }

    const handleDismiss = () => {
      if (overlayLocked) return; // still inside 3s lock
      requestOverlayClose();
    };

    window.addEventListener('click', handleDismiss, { passive: true });
    window.addEventListener('scroll', handleDismiss, { passive: true });

    return () => {
      window.removeEventListener('click', handleDismiss);
      window.removeEventListener('scroll', handleDismiss);
    };
  }, [showThankYouOverlay, overlayLocked]);


  const handlePresetClick = (amount) => {
    setErrorMessage(null);
    setTipAmount(amount);
    setInputValue(String(amount));
  };

  const handleInputChange = (e) => {
    setErrorMessage(null);
    const value = e.target.value.replace(',', '.');
    setInputValue(value);

    const numeric = parseFloat(value);
    if (!Number.isNaN(numeric)) {
      setTipAmount(numeric);
    }
  };

  const validateAmount = (amount) => {
    if (Number.isNaN(amount)) {
      return t.invalidAmount;
    }
    if (amount < minTip) {
      return `Minimum tip is NOK${minTip}.`;
    }
    if (amount > maxTip) {
      return `Maximum tip is NOK${maxTip}.`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    const numeric = parseFloat(inputValue.replace(',', '.'));
    const validationError = validateAmount(numeric);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (tipperName.trim() && containsBlockedContent(tipperName)) {
      setErrorMessage(t.nameNotAllowed);
      return;
    }

    // Reset completion state for a fresh payment
    setTipCompleted(false);
    setFunMessage('');

    setIsSubmitting(true);

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL;

      if (!apiBase) {
        console.error('VITE_API_BASE_URL is not set');
        setErrorMessage(
          t.configError,
        );
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`${apiBase}/tips/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // backend accepts creatorUsername OR username
          creatorUsername,
          tipAmount: numeric,
          currency: 'NOK',
          tipperName: tipperName.trim() || null,
          receiptEmail: tipperEmail.trim() || null,
          // Marketing consent captured now so the webhook can decide whether to
          // fire the server-side Purchase conversion later.
          marketingConsent: hasMarketingConsent(),
        }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        // if backend ever responds with plain text, we still handle it
      }

      if (!response.ok) {
        console.error('Tip session failed', {
          status: response.status,
          body: data,
        });

        const code = data?.error;

        if (code === 'invalid_tip_amount') {
          setErrorMessage(
            `Tip must be between NOK ${minTip} and NOK ${maxTip}.`,
          );
        } else if (code === 'creator_not_found') {
          setErrorMessage(
            t.creatorNotFound,
          );
        } else if (code === 'creator_not_connected') {
          setErrorMessage(
            t.payoutsNotSetUp,
          );
        } else {
          setErrorMessage(
            t.startFailed,
          );
        }

        setIsSubmitting(false);
        return;
      }

      if (!data || !data.clientSecret) {
        console.error('Tip session response missing clientSecret', data);
        setErrorMessage(
          t.sessionFailed,
        );
        setIsSubmitting(false);
        return;
      }

      // Store clientSecret so we can render Stripe Payment Element
      setClientSecret(data.clientSecret);
      setErrorMessage(null);
      setIsSubmitting(false);
    } catch (err) {
      console.error('Unexpected error creating tip session', err);
      setErrorMessage(
        t.startFailed,
      );
      setIsSubmitting(false);
    }
  };

  const displayName = creatorDisplayName || creatorUsername;



  return (
    <section aria-label="Tip widget" className="tip-card">
      <div className="tip-card__header">
        <LangFlagToggle className="tip-card__lang-flags" />
        <h2 className="tip-card__title">{tf('heading', { name: displayName })}</h2>
        <p className="tip-card__subtitle">{t.intro}</p>
      </div>

      {/* Tip selection area (presets + amount + breakdown + CTA) */}
      <div
        className={
          'tip-card__selection' +
          (isLocked ? ' tip-card__selection--locked' : '')
        }
      >

        {/* Preset buttons */}
        <div className="tip-card__presets">
          {presetAmounts.map((amount) => {
            const isActive = safeTip === amount;

            return (
              <button
                key={amount}
                type="button"
                onClick={() => handlePresetClick(amount)}
                className={
                  'tip-card__preset' +
                  (isActive ? ' tip-card__preset--active' : '')
                }
              >
                <span>NOK {amount}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="tip-card__form">
          {/* Egendefinert beløp */}
          <div className="tip-card__field">
            <label htmlFor="custom-amount" className="tip-card__label-row">
              <span>{t.customAmount}</span>
              <span>
                {tf('minMax', { min: minTip, max: maxTip })}
              </span>
            </label>

            <div className="tip-card__amount-input-wrap">
              <span className="tip-card__amount-prefix">kr</span>
              <input
                id="custom-amount"
                type="number"
                min={minTip}
                max={maxTip}
                step="1"
                inputMode="decimal"
                value={inputValue}
                onChange={handleInputChange}
                className="tip-card__amount-input"
              />
            </div>

            {errorMessage && <p className="tip-card__error">{errorMessage}</p>}
          </div>

          {/* Breakdown */}
          <div className="tip-card__breakdown">
            <div className="tip-card__row">
              <span>{t.rowTip}</span>
              <span className="tip-card__value">kr {breakdown.tip}</span>
            </div>
            <div className="tip-card__row">
              <span>{t.rowFee}</span>
              <span>kr {breakdown.processorFee}</span>
            </div>
            <div className="tip-card__row">
              <span>{t.rowTotal}</span>
              <span className="tip-card__value tip-card__value--strong">
                kr {breakdown.totalCharged}
              </span>
            </div>

            <div className="tip-card__divider" />

            <div className="tip-card__row">
              <span className="tip-card__label-muted">
                {tf('creatorReceives', { pct: breakdown.creatorPercentage })}
              </span>
              <span className="tip-card__value tip-card__value--success">
                kr {breakdown.creatorReceives}
              </span>
            </div>

            <p className="tip-card__footnote">
              {t.feeNote}
            </p>
          </div>

          {/* Optional tipper name */}
          <div className="tip-card__field">
            <label htmlFor="tipper-name" className="tip-card__label-row">
              <span>{t.yourName} <span className="tip-card__optional">{t.optional}</span></span>
            </label>
            <input
              id="tipper-name"
              type="text"
              maxLength={60}
              placeholder={t.namePlaceholder}
              value={tipperName}
              onChange={(e) => setTipperName(e.target.value)}
              className="tip-card__amount-input tip-card__name-input"
              disabled={isLocked}
            />
          </div>

          {/* Optional receipt email */}
          <div className="tip-card__field">
            <label htmlFor="tipper-email" className="tip-card__label-row">
              <span>{t.emailForReceipt} <span className="tip-card__optional">{t.optional}</span></span>
            </label>
            <input
              id="tipper-email"
              type="email"
              maxLength={254}
              placeholder={t.emailPlaceholder}
              value={tipperEmail}
              onChange={(e) => setTipperEmail(e.target.value)}
              className="tip-card__amount-input tip-card__name-input"
              disabled={isLocked}
            />
          </div>

          {/* CTA BLOCK – button + note (hidden once Stripe form appears) */}
          <div
            className={`tip-card__cta-block ${
              isSubmitting || clientSecret ? 'tip-card__cta-block--hidden' : ''
            }`}
          >
            <button
              type="submit"
              disabled={isSubmitting || !!clientSecret}
              className="tip-card__cta"
            >
              {isSubmitting
                ? t.startingPayment
                : tipperName.trim()
                ? tf('tipAs', { name: tipperName.trim() })
                : t.tipAnonymously}
            </button>
            <p className="tip-card__secure-note">
              {t.secureNote}
            </p>
            <p className="tip-card__legal-note">
              {t.legalPre}
              <a href="/legal/terms" target="_blank" rel="noopener noreferrer">{t.legalTerms}</a>
              {t.legalAnd}
              <a href="/legal/privacy" target="_blank" rel="noopener noreferrer">{t.legalPrivacy}</a>.
            </p>
          </div>
        </form>
      </div>

      {/* Stripe payment step */}
      {clientSecret && (
        <div className="tip-card__payment">
          {tipCompleted ? (
            <div className="tip-card__success">
              {/* FUN MESSAGE FIRST */}
              {funMessage && (
                <p className="tip-card__success-text tip-card__success-text--fun">
                  {funMessage}
                </p>
              )}

              {/* RECEIPT INFO */}
              <p className="tip-card__success-text">
                If you entered an email address at checkout, Stripe has sent you
                a receipt for this tip. Questions?{" "}
                <a href="mailto:support@kuntips.no">support@kuntips.no</a>
              </p>

              {/* SEND ANOTHER TIP */}
              <button
                type="button"
                className="tip-card__cta tip-card__cta--secondary"
                onClick={() => {
                  setClientSecret(null);
                  setTipCompleted(false);
                  setFunMessage('');
                }}
              >
                {t.sendAnother}
              </button>
            </div>
          ) : (
            <Elements stripe={getStripePromise()} options={{ clientSecret }}>
              <StripePaymentForm
                onSuccess={(randomMessage) => {
                  setTipCompleted(true);
                  setFunMessage(randomMessage || '');
                  triggerThankYouOverlay();
                }}
                tipperEmail={tipperEmail}
                tipAmountNok={safeTip}
              />
            </Elements>
          )}
        </div>
      )}

      {/* Thank-you overlay */}
      {showThankYouOverlay && (
          <div
              className={`tip-overlay ${
                  overlayClosing ? 'tip-overlay--closing' : ''
              }`}
              role="dialog"
              aria-modal="true"
              aria-label="Tip completed"
          >

            <div className="tip-overlay__card">
              <h3 className="tip-overlay__title">{t.overlayTitle}</h3>

              <p className="tip-overlay__line">
                You just sent{' '}
                <span className="tip-overlay__amount">
                kr {lastTipSummary?.tip ?? breakdown.tip}
              </span>{' '}
                to <span className="tip-overlay__name">{displayName}</span>.
              </p>

              <p className="tip-overlay__line tip-overlay__line--muted">
                {displayName} will receive{' '}
                <span className="tip-overlay__amount-success">
                kr{' '}
                  {lastTipSummary?.creatorReceives ??
                      breakdown.creatorReceives}
              </span>{' '}
                after fees.
              </p>

              {funMessage && <p className="tip-overlay__fun">{funMessage}</p>}

              <button
                  type="button"
                  className="tip-overlay__button"
                  onClick={requestOverlayClose}
              >
                {t.overlayClose}
              </button>


              <p className="tip-overlay__hint">
                {t.overlayAutoClose}
              </p>
            </div>
          </div>
      )}
    </section>
  );
}


// Turn a Stripe payment error into a friendly, actionable message for the tipper.
// We deliberately DON'T show Stripe's raw text (e.g. "too high risk"), which is
// confusing and reads as accusatory for what is often a false flag. The real
// error is still logged to the console for debugging.
function friendlyPaymentError(error, t) {
  const code = error?.code || "";
  const declineCode = error?.decline_code || "";

  switch (declineCode) {
    case "insufficient_funds":
      return t.cardInsufficient;
    case "expired_card":
      return t.cardExpired;
    case "incorrect_cvc":
    case "invalid_cvc":
      return t.cardCvc;
    case "lost_card":
    case "stolen_card":
    case "pickup_card":
      return t.cardDeclined;
    default:
      break;
  }

  switch (code) {
    case "card_declined":
      return t.cardDeclinedProcessor;
    case "expired_card":
      return t.cardExpired;
    case "incorrect_cvc":
      return t.cardCvc;
    case "processing_error":
      return t.cardProcessing;
    case "authentication_required":
      return t.bankConfirm;
    default:
      return t.notCompleted;
  }
}

function StripePaymentForm({ onSuccess, tipperEmail, tipAmountNok }) {
  const { t, tf } = useTipLang();
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const email = tipperEmail?.trim() || undefined;
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              ...(email ? { email } : {}),
            },
          },
        },
        redirect: "if_required",
      });

      if (result.error) {
        console.error("Stripe payment error:", result.error);
        setMessage(friendlyPaymentError(result.error, t));
      } else if (
        result.paymentIntent &&
        result.paymentIntent.status === "succeeded"
      ) {
        const funMessages = t.quips.map((q) => `${t.thanks} ${q}`);
        const random =
          funMessages[Math.floor(Math.random() * funMessages.length)];

        // Fire client-side Purchase conversion (consent-gated). Deduped with the
        // server-side event via event_id = the Stripe PaymentIntent id.
        if (hasMarketingConsent()) {
          try {
            const eventId = result.paymentIntent.id;
            const value = Number(tipAmountNok) || undefined;
            if (window.fbq) {
              window.fbq(
                "track",
                "Purchase",
                { value, currency: "NOK" },
                { eventID: eventId },
              );
            }
            if (window.ttq) {
              window.ttq.track(
                "CompletePayment",
                { value, currency: "NOK" },
                { event_id: eventId },
              );
            }
          } catch {
            // never block the success flow on tracking
          }
        }

        if (onSuccess) {
          onSuccess(random);
        }

        setMessage(t.thanks);
      } else if (result.paymentIntent) {
        setMessage(tf("pendingStatus", { status: result.paymentIntent.status }));
      } else {
        setMessage(t.unexpectedResult);
      }
    } catch (err) {
      console.error("Unexpected payment error:", err);
      setMessage(t.genericError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="tip-card__payment-form">
      <div className="tip-card__payment-element">
        <PaymentElement />
      </div>

      {message && <p className="tip-card__error">{message}</p>}

      <button
        type="submit"
        disabled={!stripe || submitting}
        className="tip-card__cta tip-card__cta--secondary"
      >
        {submitting ? t.processing : t.paySecurely}
      </button>

      {/* Secure-payment note now lives directly under the Pay button */}
      <p className="tip-card__secure-note">{t.secureNote}</p>
    </form>
  );
}
