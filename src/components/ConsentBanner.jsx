// src/components/ConsentBanner.jsx
// Centered consent modal with a dimmed backdrop. On first visit it requires a
// choice (Accept all / Necessary only) before the visitor can use the site.
// Both options are one click and equally accessible (GDPR-compliant — reject is
// never harder than accept). Re-opening from the footer link is dismissible.

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { hasDecided, setConsent, OPEN_CONSENT_EVENT } from "../consent.js";

const COPY = {
  no: {
    title: "Vi bruker informasjonskapsler",
    body: "Vi bruker nødvendige informasjonskapsler for at siden skal fungere. Med ditt samtykke bruker vi også markedsføringsverktøy (Meta og TikTok) for å måle og forbedre annonsene våre. Du kan endre valget når som helst.",
    acceptAll: "Godta alle",
    necessaryOnly: "Kun nødvendige",
    readMore: "Les mer i vår cookie-policy",
    lang: "English",
    close: "Lukk",
  },
  en: {
    title: "We use cookies",
    body: "We use necessary cookies to make the site work. With your consent, we also use marketing tools (Meta and TikTok) to measure and improve our ads. You can change your choice at any time.",
    acceptAll: "Accept all",
    necessaryOnly: "Necessary only",
    readMore: "Read more in our cookie policy",
    lang: "Norsk",
    close: "Close",
  },
};

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  // dismissible = true when re-opened from the footer after a prior choice.
  // On first visit it's false → the visitor must pick an option.
  const [dismissible, setDismissible] = useState(false);
  const [lang, setLang] = useState("no");

  useEffect(() => {
    if (!hasDecided()) {
      setVisible(true);
      setDismissible(false);
    }
    function onOpen() {
      setVisible(true);
      setDismissible(true);
    }
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
  }, []);

  if (!visible) return null;

  const t = COPY[lang];

  function acceptAll() {
    setConsent(true);
    setVisible(false);
  }

  function necessaryOnly() {
    setConsent(false);
    setVisible(false);
  }

  function onOverlayClick() {
    // Backdrop click only closes when re-opened (a choice already exists).
    if (dismissible) setVisible(false);
  }

  return (
    <div
      className="consent-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
      onClick={onOverlayClick}
    >
      <div className="consent-modal" onClick={(e) => e.stopPropagation()}>
        {dismissible && (
          <button
            type="button"
            className="consent-modal__close"
            onClick={() => setVisible(false)}
            aria-label={t.close}
          >
            &times;
          </button>
        )}

        <div className="consent-modal__head">
          <strong className="consent-modal__title">{t.title}</strong>
          <button
            type="button"
            className="consent-modal__lang"
            onClick={() => setLang(lang === "no" ? "en" : "no")}
          >
            {t.lang}
          </button>
        </div>

        <p className="consent-modal__body">{t.body}</p>

        <p className="consent-modal__readmore">
          <Link to="/legal/cookies" className="consent-modal__link">
            {t.readMore}
          </Link>
        </p>

        <div className="consent-modal__actions">
          <button
            type="button"
            className="btn btn-ghost consent-modal__btn"
            onClick={necessaryOnly}
          >
            {t.necessaryOnly}
          </button>
          <button
            type="button"
            className="btn btn-primary consent-modal__btn"
            onClick={acceptAll}
          >
            {t.acceptAll}
          </button>
        </div>
      </div>
    </div>
  );
}
