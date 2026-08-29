// src/hooks/useTipLang.js
// Gives the tip page its current language and re-renders when it changes.
// Mirrors the localStorage + custom-event pattern used for auth and consent.

import { useState, useEffect } from "react";
import { getTipLang, setTipLang, TIP_LANG_EVENT } from "../tipLang.js";
import { TIP_STRINGS, fmt } from "../tipStrings.js";

export function useTipLang() {
  const [lang, setLang] = useState(getTipLang);

  useEffect(() => {
    const onChange = () => setLang(getTipLang());
    window.addEventListener(TIP_LANG_EVENT, onChange);
    // A second tab switching language should not leave this one stale.
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(TIP_LANG_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const t = TIP_STRINGS[lang] || TIP_STRINGS.no;

  return {
    lang,
    t,
    /** t() with placeholder substitution: tf("heading", { name }) */
    tf: (key, vars) => fmt(t[key], vars),
    toggle: () => setTipLang(lang === "no" ? "en" : "no"),
  };
}
