// src/components/TipWidget.jsx
import { useState, useMemo, useEffect, useRef } from 'react';
import { containsBlockedContent } from '../utils/wordFilter.js';
import { hasMarketingConsent } from '../consent.js';
import { loadStripe } from '@stripe/stripe-js';
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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export function TipWidget({
  creatorUsername,
  creatorDisplayName,
  creatorKeptPercent = DEFAULT_CREATOR_KEPT_PERCENT,
}) {
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
      return 'Please enter a valid number.';
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
      setErrorMessage("That name isn't allowed. Please use a different name or tip anonymously.");
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
          'Configuration error: payment backend is not available. Please try again later.',
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
            'This creator could not be found or is not active right now.',
          );
        } else if (code === 'creator_not_connected') {
          setErrorMessage(
            'This creator has not finished setting up payouts yet. Please try again later.',
          );
        } else {
          setErrorMessage(
            'Something went wrong starting the payment. Please try again in a moment.',
          );
        }

        setIsSubmitting(false);
        return;
      }

      if (!data || !data.clientSecret) {
        console.error('Tip session response missing clientSecret', data);
        setErrorMessage(
          'We could not start the payment session. Please try again in a moment.',
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
        'Something went wrong starting the payment. Please try again in a moment.',
      );
      setIsSubmitting(false);
    }
  };

  const displayName = creatorDisplayName || creatorUsername;



  return (
    <section aria-label="Tip widget" className="tip-card">
      <div className="tip-card__header">
        <h2 className="tip-card__title">Support {displayName}</h2>
        <p className="tip-card__subtitle">
          Private by default — no account needed. You choose the amount and whether to leave your name.
        </p>
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
          {/* Custom amount */}
          <div className="tip-card__field">
            <label htmlFor="custom-amount" className="tip-card__label-row">
              <span>Custom amount</span>
              <span>
                Min kr {minTip} · Max kr {maxTip} - NOK Only
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
              <span>Tip</span>
              <span className="tip-card__value">kr {breakdown.tip}</span>
            </div>
            <div className="tip-card__row">
              <span>Service fee</span>
              <span>kr {breakdown.processorFee}</span>
            </div>
            <div className="tip-card__row">
              <span>Total charged</span>
              <span className="tip-card__value tip-card__value--strong">
                kr {breakdown.totalCharged}
              </span>
            </div>

            <div className="tip-card__divider" />

            <div className="tip-card__row">
              <span className="tip-card__label-muted">
                Creator receives {breakdown.creatorPercentage}% of your tip
              </span>
              <span className="tip-card__value tip-card__value--success">
                kr {breakdown.creatorReceives}
              </span>
            </div>

            <p className="tip-card__footnote">
              The service fee covers Stripe’s card processing and a small
              KunTips fee — paid by you, not deducted from the creator.
            </p>
          </div>

          {/* Optional tipper name */}
          <div className="tip-card__field">
            <label htmlFor="tipper-name" className="tip-card__label-row">
              <span>Your name <span className="tip-card__optional">(optional)</span></span>
            </label>
            <input
              id="tipper-name"
              type="text"
              maxLength={60}
              placeholder="Leave it blank to tip anonymously"
              value={tipperName}
              onChange={(e) => setTipperName(e.target.value)}
              className="tip-card__amount-input tip-card__name-input"
              disabled={isLocked}
            />
          </div>

          {/* Optional receipt email */}
          <div className="tip-card__field">
            <label htmlFor="tipper-email" className="tip-card__label-row">
              <span>Email for receipt <span className="tip-card__optional">(optional)</span></span>
            </label>
            <input
              id="tipper-email"
              type="email"
              maxLength={254}
              placeholder="Leave blank if you don't want a receipt"
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
                ? 'Starting secure payment…'
                : tipperName.trim()
                ? `Tip as ${tipperName.trim()}`
                : 'Tip anonymously'}
            </button>
            <p className="tip-card__secure-note">
              Payments are handled entirely by Stripe. KunTips never sees your card details.
            </p>
            <p className="tip-card__legal-note">
              By paying you agree to the{" "}
              <a href="/legal/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
              {" "}and{" "}
              <a href="/legal/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
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
                Send another tip
              </button>
            </div>
          ) : (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
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
              <h3 className="tip-overlay__title">Thank you for your tip!</h3>

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
                Close and continue
              </button>


              <p className="tip-overlay__hint">
                This window will also close if you scroll or click anywhere after
                a few seconds.
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
function friendlyPaymentError(error) {
  const code = error?.code || "";
  const declineCode = error?.decline_code || "";

  switch (declineCode) {
    case "insufficient_funds":
      return "That card has insufficient funds. Please try a different card.";
    case "expired_card":
      return "That card has expired. Please try a different card.";
    case "incorrect_cvc":
    case "invalid_cvc":
      return "The card's security code (CVC) looks wrong. Please check it and try again.";
    case "lost_card":
    case "stolen_card":
    case "pickup_card":
      return "Your card was declined. Please try a different card.";
    default:
      break;
  }

  switch (code) {
    case "card_declined":
      return "Your card was declined by our payment processor. This isn't a problem with KunTips — please try a different card.";
    case "expired_card":
      return "That card has expired. Please try a different card.";
    case "incorrect_cvc":
      return "The card's security code (CVC) looks wrong. Please check it and try again.";
    case "processing_error":
      return "Something went wrong processing that card. Please try again in a moment, or use a different card.";
    case "authentication_required":
      return "Your bank needs to confirm this payment. Please complete the verification and try again.";
    default:
      return "The payment couldn't be completed. Please try again or use a different card.";
  }
}

function StripePaymentForm({ onSuccess, tipperEmail, tipAmountNok }) {
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
        setMessage(friendlyPaymentError(result.error));
      } else if (
        result.paymentIntent &&
        result.paymentIntent.status === "succeeded"
      ) {
        const funMessages = [
          "Thank you! Your tip was sent successfully. May your beard grow long and strong, and your hair never fall out.",
          "Thank you! Your tip was sent successfully. You just made someone’s day a little better. \u2665",
          "Thank you! Your tip was sent successfully. Great things happen to generous people. Just saying.",
          "Thank you! Your tip was sent successfully. That was a legend move. The universe owes you one.",
        ];
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

        setMessage("Thank you! Your tip was sent successfully.");
      } else if (result.paymentIntent) {
        setMessage(
          `Payment status: ${result.paymentIntent.status}. Please check your bank or try again.`,
        );
      } else {
        setMessage("Unexpected payment result. Please try again.");
      }
    } catch (err) {
      console.error("Unexpected payment error:", err);
      setMessage("Something went wrong. Please try again.");
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
        {submitting ? 'Processing…' : 'Pay securely'}
      </button>

      {/* Secure-payment note now lives directly under the Pay button */}
      <p className="tip-card__secure-note">
        Payments are processed securely by Stripe. KunTips never stores your
        card details.
      </p>
    </form>
  );
}
