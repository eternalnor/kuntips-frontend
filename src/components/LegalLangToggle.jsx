// src/components/LegalLangToggle.jsx
// Language switch for the legal pages.
//
// Shares its language state with the tip page (useTipLang) on purpose: a tipper
// who switched the tip page to English and taps "Terms of Service" must land on
// English terms — two separate language choices would let the flow flip
// language mid-payment.

export default function LegalLangToggle({ lang, toggle, labels }) {
  return (
    <button
      type="button"
      className="legal-lang"
      onClick={toggle}
      aria-label={labels.ariaLabel}
      lang={lang === "no" ? "en" : "no"}
    >
      {labels.switchTo}
    </button>
  );
}

/**
 * The Norwegian version governs; the English version is a convenience
 * translation. Shown at the top of every ENGLISH legal page so an
 * English-reading visitor knows which text is authoritative. (Flipped from
 * English-prevails by owner decision 26 Aug 2026: both texts were drafted
 * without legal review, so the original-language argument carried no weight,
 * and Norwegian-prevails fits a Norwegian platform under Norwegian law.)
 */
export function ConvenienceNote() {
  return (
    <p className="legal-convenience-note">
      This English version is a translation provided for convenience. In case
      of any conflict between the versions, the Norwegian version prevails.
    </p>
  );
}
