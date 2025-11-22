// src/components/TipWidget.jsx
import { useState, useMemo } from 'react';
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
const PROCESSOR_FEE_RATE = 0.015; // 1.5% Stripe processor fee
const STRIPE_FIXED_FEE = 1.8; // 1.80NOK Stripe fixed fee
const CREATOR_SHARE = 0.95;       // 95% to creator

const presetAmounts = [100, 250, 500, 1000, 2000];

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


export function TipWidget({ creatorUsername, creatorDisplayName }) {
  const [tipAmount, setTipAmount] = useState(MIN_TIP);
  const [inputValue, setInputValue] = useState(String(MIN_TIP));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

    // NEW: track when a tip was completed + fun message
  const [tipCompleted, setTipCompleted] = useState(false);
  const [funMessage, setFunMessage] = useState('');

  const safeTip = useMemo(() => {
    if (Number.isNaN(tipAmount)) return MIN_TIP;
    return tipAmount;
  }, [tipAmount]);


  const breakdown = useMemo(() => {
    const T = safeTip;

    const totalCharged = T / (1 - (PROCESSOR_FEE_RATE + KUNTIPS_FEE_RATE)) + STRIPE_FIXED_FEE;
    const processorFee = totalCharged - T;
    const creatorReceives = T * CREATOR_SHARE;
    const creatorPercentage = 100 * CREATOR_SHARE;

    const format = (value) => value.toFixed(2);
    const format2 = (value) => value.toFixed(0);

    return {
      tip: format(T),
      processorFee: format(processorFee),
      totalCharged: format(totalCharged),
      creatorReceives: format(creatorReceives),
      creatorPercentage: format2(creatorPercentage),
    };
  }, [safeTip]);

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

    // NEW: reset completion state for a fresh payment
    setTipCompleted(false);
    setFunMessage('');

    setIsSubmitting(true);

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL;

      if (!apiBase) {
        console.error('VITE_API_BASE_URL is not set');
        setErrorMessage(
          'Configuration error: payment backend is not available. Please try again later.'
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
            `Tip must be between NOK ${MIN_TIP} and NOK ${MAX_TIP}.`
          );
        } else if (code === 'creator_not_found') {
          setErrorMessage(
            'This creator could not be found or is not active right now.'
          );
        } else if (code === 'creator_not_connected') {
          setErrorMessage(
            'This creator has not finished setting up payouts yet. Please try again later.'
          );
        } else {
          setErrorMessage(
            'Something went wrong starting the payment. Please try again in a moment.'
          );
        }

        setIsSubmitting(false);
        return;
      }

      if (!data || !data.clientSecret) {
        console.error('Tip session response missing clientSecret', data);
        setErrorMessage(
          'We could not start the payment session. Please try again in a moment.'
        );
        setIsSubmitting(false);
        return;
      }

      console.log('Tip session created OK:', data);

      // Store clientSecret so we can render Stripe Payment Element
      setClientSecret(data.clientSecret);
      setErrorMessage(null);
      setIsSubmitting(false);


      // ❗ For now we only create the session on the server.
      // Actual Stripe card collection / confirmation will be wired up next.
      console.log('Tip session created OK:', data);
      setErrorMessage(
        'Tip session created successfully (test mode). Stripe payment UI is the next step.'
      );
      setIsSubmitting(false);
    } catch (err) {
      console.error('Unexpected error creating tip session', err);
      setErrorMessage(
        'Something went wrong starting the payment. Please try again in a moment.'
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
          100% anonymous. You choose the amount — we handle the rest.
        </p>
      </div>

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
            <span>Service fee (processing + KunTips, ~8%)</span>
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
            <span className="tip-card__label-muted">Creator receives at least {breakdown.creatorPercentage}% of your tip</span>
            <span className="tip-card__value tip-card__value--success">
              kr {breakdown.creatorReceives}
            </span>
          </div>

          <p className="tip-card__footnote">
            Fans cover Stripe’s processing fee and a 5% KunTips service fee.
            Creators pay a tier-based commission of 0–5% on the tip amount and
            receive the green amount shown above.
          </p>
        </div>

        {/* CTA */}
                <button
          type="submit"
          disabled={isSubmitting}
          className="tip-card__cta"
        >
          {isSubmitting ? 'Starting secure payment…' : 'Tip anonymously now'}
        </button>

        <p className="tip-card__secure-note">
          Payments are processed securely by Stripe. KunTips never stores your
          card details.
        </p>
      </form>

            {clientSecret && (
        <div className="tip-card__payment">
          {tipCompleted ? (
            <div className="tip-card__success">
              <p className="tip-card__success-title">
                Thank you! Your tip was sent successfully.
              </p>
              <p className="tip-card__success-text">
                If you entered an email address at checkout, Stripe has sent you a
                receipt for this tip.
              </p>
              {funMessage && (
                <p className="tip-card__success-text tip-card__success-text--fun">
                  {funMessage}
                </p>
              )}

              <button
                type="button"
                className="tip-card__cta tip-card__cta--secondary"
                onClick={() => {
                  // Clear the current PaymentIntent so they can start a new tip
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
                }}
              />
            </Elements>
          )}
        </div>
      )}

    </section>
  );
}

function StripePaymentForm({ onSuccess }) {

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

    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (result.error) {
      console.error('Stripe payment error:', result.error);
      setMessage(result.error.message || 'Payment failed. Please try again.');
    } else if (
      result.paymentIntent &&
      result.paymentIntent.status === 'succeeded'
    ) {
      // NEW: pick a fun positive message
      const funMessages = [
        'Thank you! May your beard grow long and strong, and your hair never fall out.',
        'You just made someone’s day a little better. ♥',
        'Great things happen to generous people. Just saying.',
        'Legend move. The universe owes you one.'
      ];
      const random =
        funMessages[Math.floor(Math.random() * funMessages.length)];

      if (onSuccess) {
        onSuccess(random);
      }

      // We won’t show this for long because the parent swaps to the success block,
      // but keep it as a fallback.
      setMessage('Thank you! Your tip was sent successfully.');
    } else if (result.paymentIntent) {
      setMessage(
        `Payment status: ${result.paymentIntent.status}. Please check your bank or try again.`
      );
    } else {
      setMessage('Unexpected payment result. Please try again.');
    }

    setSubmitting(false);
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
    </form>
  );
}
