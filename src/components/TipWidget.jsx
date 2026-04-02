// src/components/TipWidget.jsx
import { useState, useMemo, useEffect, useRef } from 'react';
import { containsBlockedContent } from '../utils/wordFilter.js';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const MIN_TIP = 100;
const MAX_TIP = 2000;
const KUNTIPS_FEE_RATE = 0.05; // 5% KunTips service fee
const PROCESSOR_FEE_RATE = 0.9675; // 3.25% Stripe processor fee
const STRIPE_FIXED_FEE = 2; // 1.80NOK Stripe fixed fee

// Fallback if backend doesn't send a value yet
const DEFAULT_CREATOR_KEPT_PERCENT = 95;

const presetAmounts = [100, 250, 500, 1000, 2000];

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export function TipWidget({
  creatorUsername,
  creatorDisplayName,
  creatorKeptPercent = DEFAULT_CREATOR_KEPT_PERCENT,
}) {
  const [tipAmount, setTipAmount] = useState(MIN_TIP);
  const [inputValue, setInputValue] = useState(String(MIN_TIP));
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

  const safeTip = useMemo(() => {
    if (Number.isNaN(tipAmount)) return MIN_TIP;
    return tipAmount;
  }, [tipAmount]);

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
    if (amount < MIN_TIP) {
      return `Minimum tip is NOK${MIN_TIP}.`;
    }
    if (amount > MAX_TIP) {
      return `Maximum tip is NOK${MAX_TIP}.`;
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
            `Tip must be between NOK ${MIN_TIP} and NOK ${MAX_TIP}.`,
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
                Min kr {MIN_TIP} · Max kr {MAX_TIP} - NOK Only
              </span>
            </label>

            <div className="tip-card__amount-input-wrap">
              <span className="tip-card__amount-prefix">kr</span>
              <input
                id="custom-amount"
                type="number"
                min={MIN_TIP}
                max={MAX_TIP}
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


function StripePaymentForm({ onSuccess, tipperEmail }) {
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
        redirect: ‘if_required’,
      });

      if (result.error) {
        console.error(‘Stripe payment error:’, result.error);
        setMessage(result.error.message || ‘Payment failed. Please try again.’);
      } else if (
        result.paymentIntent &&
        result.paymentIntent.status === ‘succeeded’
      ) {
        const funMessages = [
          ‘Thank you! Your tip was sent successfully. May your beard grow long and strong, and your hair never fall out.’,
          ‘Thank you! Your tip was sent successfully. You just made someone\’s day a little better. ♥’,
          ‘Thank you! Your tip was sent successfully. Great things happen to generous people. Just saying.’,
          ‘Thank you! Your tip was sent successfully. That was a legend move. The universe owes you one.’,
        ];
        const random =
          funMessages[Math.floor(Math.random() * funMessages.length)];

        if (onSuccess) {
          onSuccess(random);
        }

        setMessage(‘Thank you! Your tip was sent successfully.’);
      } else if (result.paymentIntent) {
        setMessage(
          `Payment status: ${result.paymentIntent.status}. Please check your bank or try again.`,
        );
      } else {
        setMessage(‘Unexpected payment result. Please try again.’);
      }
    } catch (err) {
      console.error(‘Unexpected payment error:’, err);
      setMessage(‘Something went wrong. Please try again.’);
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
