// src/components/ConsentBanner.jsx
// Bottom consent bar. Two categories: Necessary (always on) + Marketing/Analytics.
// Norwegian default with an English toggle. Re-openable from the footer link.

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  hasDecided,
  setConsent,
  OPEN_CONSENT_EVENT,
} from "../consent.js";

const COPY = {
  no: {
    title: "Vi bruker informasjonskapsler",
    body: "Vi bruker nødvendige informasjonskapsler for at siden skal fungere, og – hvis du samtykker – markedsføringsverktøy (Meta og TikTok) for å måle og forbedre annonsene våre.",
    acceptAll: "Godta alle",
    necessaryOnly: "Kun nødvendige",
    readMore: "Les mer",
    lang: "English",
  },
  en: {
    title: "We use cookies",
    body: "We use necessary cookies to make the site work and — if you consent — marketing tools (Meta and TikTok) to measure and improve our ads.",
    acceptAll: "Accept all",
    necessaryOnly: "Necessary only",
    readMore: "Read more",
    lang: "Norsk",
  },
};

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [lang, setLang] = useState("no");

  useEffect(() => {
    // Show if no decision made yet.
    if (!hasDecided()) setVisible(true);

    // Re-open when the footer "Cookie settings" link fires the event.
    function onOpen() {
      setVisible(true);
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

  return (
    <div className="consent-banner" role="dialog" aria-live="polite" aria-label={t.title}>
      <div className="consent-banner__inner">
        <div className="consent-banner__text">
          <div className="consent-banner__head">
            <strong className="consent-banner__title">{t.title}</strong>
            <button
              type="button"
              className="consent-banner__lang"
              onClick={() => setLang(lang === "no" ? "en" : "no")}
            >
              {t.lang}
            </button>
          </div>
          <p className="consent-banner__body">
            {t.body}{" "}
            <Link to="/legal/cookies" className="consent-banner__link">
              {t.readMore}
            </Link>
          </p>
        </div>

        <div className="consent-banner__actions">
          <button
            type="button"
            className="btn btn-ghost consent-banner__btn"
            onClick={necessaryOnly}
          >
            {t.necessaryOnly}
          </button>
          <button
            type="button"
            className="btn btn-primary consent-banner__btn"
            onClick={acceptAll}
          >
            {t.acceptAll}
          </button>
        </div>
      </div>
    </div>
  );
}
