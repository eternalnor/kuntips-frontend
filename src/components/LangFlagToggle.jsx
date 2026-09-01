// src/components/LangFlagToggle.jsx
// Site-wide language switch: both languages always visible, each with its
// flag, the active one highlighted — so nobody has to discover that the page
// exists in their language.
//
// The flags are inline SVGs, not emoji, on purpose: Windows renders flag
// emoji as bare letter pairs ("NO", "GB"), which would gut the whole point
// for every desktop visitor.
//
// One shared language state across the tip, legal and support pages
// (useTipLang): a tipper who switched the payment form to English must land
// on English terms when they tap the link — two separate choices would let
// the flow flip language mid-payment.

import { useTipLang } from "../hooks/useTipLang.js";
import { setTipLang } from "../tipLang.js";

function FlagNo() {
  return (
    <svg
      className="lang-flags__flag"
      viewBox="0 0 22 16"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="22" height="16" fill="#ef2b2d" />
      <rect x="6" width="4" height="16" fill="#fff" />
      <rect y="6" width="22" height="4" fill="#fff" />
      <rect x="7" width="2" height="16" fill="#002868" />
      <rect y="7" width="22" height="2" fill="#002868" />
    </svg>
  );
}

function FlagGb() {
  return (
    <svg
      className="lang-flags__flag"
      viewBox="0 0 22 16"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="22" height="16" fill="#012169" />
      <path d="M0 0 L22 16 M22 0 L0 16" stroke="#fff" strokeWidth="3.2" />
      <path d="M0 0 L22 16 M22 0 L0 16" stroke="#c8102e" strokeWidth="1.3" />
      <rect x="8.3" width="5.4" height="16" fill="#fff" />
      <rect y="5.3" width="22" height="5.4" fill="#fff" />
      <rect x="9.6" width="2.8" height="16" fill="#c8102e" />
      <rect y="6.6" width="22" height="2.8" fill="#c8102e" />
    </svg>
  );
}

export default function LangFlagToggle({ className = "" }) {
  const { lang } = useTipLang();

  const option = (code, Flag, label) => (
    <button
      type="button"
      lang={code}
      className={
        "lang-flags__opt" + (lang === code ? " lang-flags__opt--active" : "")
      }
      aria-pressed={lang === code}
      onClick={() => setTipLang(code)}
    >
      <Flag />
      <span>{label}</span>
    </button>
  );

  return (
    <div
      className={("lang-flags " + className).trim()}
      role="group"
      aria-label="Språk / Language"
    >
      {option("no", FlagNo, "Norsk")}
      {option("en", FlagGb, "English")}
    </div>
  );
}
