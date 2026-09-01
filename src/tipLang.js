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

/** Stored choice wins; otherwise Norwegian, full stop. */
export function getTipLang() {
  if (typeof window === "undefined") return "no";
  try {
    const stored = window.localStorage.getItem(KEY);
    if (stored === "no" || stored === "en") return stored;
  } catch {
    // ignore
  }
  // Norwegian by default (owner decision 1 Sep 2026). The platform is
  // Norway-only and plenty of Norwegians run English-locale phones, which the
  // old browser-language sniff misread as foreign visitors. The flag toggle
  // is prominent enough that an actual English reader switches in one tap.
  return "no";
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
