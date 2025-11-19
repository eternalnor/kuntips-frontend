// src/components/TipWidget.jsx
import { useState, useMemo } from 'react';

const MIN_TIP = 10;
const MAX_TIP = 200;
const PROCESSOR_FEE_RATE = 0.12; // 12% (processor)
const CREATOR_SHARE = 0.925;       // 95% to creator

const presetAmounts = [10, 25, 50, 100, 200];

export function TipWidget({ creatorUsername, creatorDisplayName }) {
  const [tipAmount, setTipAmount] = useState(50);
  const [inputValue, setInputValue] = useState('50');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const safeTip = useMemo(() => {
    if (Number.isNaN(tipAmount)) return MIN_TIP;
    return Math.min(Math.max(tipAmount, MIN_TIP), MAX_TIP);
  }, [tipAmount]);

  const breakdown = useMemo(() => {
    const T = safeTip;

    const totalCharged = T / (1 - PROCESSOR_FEE_RATE);
    const processorFee = totalCharged - T;
    const creatorReceives = T * CREATOR_SHARE;

    const format = (value) => value.toFixed(2);

    return {
      tip: format(T),
      processorFee: format(processorFee),
      totalCharged: format(totalCharged),
      creatorReceives: format(creatorReceives),
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
      return `Minimum tip is $${MIN_TIP}.`;
    }
    if (amount > MAX_TIP) {
      return `Maximum tip is $${MAX_TIP}.`;
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

    setIsSubmitting(true);

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBase}/tips/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creatorUsername,
          tipAmount: numeric,
          currency: 'USD',
        }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(text || 'Failed to create tip session.');
      }

      const data = await response.json();
      if (!data || !data.redirectUrl) {
        throw new Error('Missing redirect URL from server.');
      }

      // Redirect to CCBill / checkout
      window.location.href = data.redirectUrl;
    } catch (err) {
      console.error(err);
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
          const isRecommended = amount === 0;

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
              <span>${amount}</span>
              {isRecommended && (
                <span className="tip-card__preset-badge">Recommended</span>
              )}
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
              Min ${MIN_TIP} · Max ${MAX_TIP}
            </span>
          </label>

          <div className="tip-card__amount-input-wrap">
            <span className="tip-card__amount-prefix">$</span>
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
            <span className="tip-card__value">${breakdown.tip}</span>
          </div>
          <div className="tip-card__row">
            <span>Processor fee (~12%)</span>
            <span>${breakdown.processorFee}</span>
          </div>
          <div className="tip-card__row">
            <span>Total charged</span>
            <span className="tip-card__value tip-card__value--strong">
              ${breakdown.totalCharged}
            </span>
          </div>

          <div className="tip-card__divider" />

          <div className="tip-card__row">
            <span className="tip-card__label-muted">Creator receives</span>
            <span className="tip-card__value tip-card__value--success">
              ${breakdown.creatorReceives}
            </span>
          </div>

          <p className="tip-card__footnote">
            Fans cover the processing fee. KunTips takes a flat 5% from the
            tip before payout. Creators receive the green amount above.
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
          Payments are processed securely by CCBill. KunTips never stores your
          card details.
        </p>
      </form>
    </section>
  );
}
