// src/tipLang.js
// Language state for the tip page ONLY.
//
// The rest of the site is Norwegian and stays that way: creators must have a
// Norwegian bank account, so a creator who cannot read Norwegian could not
// complete onboarding regardless. The tip page is different — a Norwegian
// creator can easily have followers abroad, and that page is the one place a
// non-Norwegian speaker has to understand what they are paying.
//
// Deliberately NOT a site-wide i18n framework. One page, one small table, no
// build step, and no second copy of every string to keep in sync forever.

const KEY = "kuntips_tip_lang";
export const TIP_LANG_EVENT = "kuntips-tip-lang-change";

/** Norwegian unless the browser says otherwise. Stored choice always wins. */
export function getTipLang() {
  if (typeof window === "undefined") return "no";
  try {
    const stored = window.localStorage.getItem(KEY);
    if (stored === "no" || stored === "en") return stored;
  } catch {
    // ignore
  }
  try {
    // nb, nn, no, and no-NO all mean Norwegian. Everything else gets English,
    // which is the safer default for a stranger: a Norwegian who lands on
    // English can switch back in one tap, but someone who reads neither is
    // better served by the more widely understood of the two.
    const nav = (navigator.language || "").toLowerCase();
    if (nav.startsWith("nb") || nav.startsWith("nn") || nav.startsWith("no")) {
      return "no";
    }
    return "en";
  } catch {
    return "no";
  }
}

export function setTipLang(lang) {
  if (typeof window === "undefined") return;
  const next = lang === "en" ? "en" : "no";
  try {
    window.localStorage.setItem(KEY, next);
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(TIP_LANG_EVENT));
}
