// src/consent.js
// Cookie-consent state. Two categories: Necessary (always on) + Marketing/Analytics.
// Mirrors the localStorage + custom-event reactivity pattern used for auth (api.js).

const CONSENT_KEY = "kuntips_cookie_consent";
const CONSENT_VERSION = 1;

// Custom events (mirrors "kuntips-auth-change")
export const CONSENT_CHANGE_EVENT = "kuntips-consent-change";
export const OPEN_CONSENT_EVENT = "kuntips-open-consent";

/**
 * Returns the stored consent object, or null if no decision has been made.
 * Shape: { v: number, marketing: boolean, ts: string }
 */
export function getConsent() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.marketing !== "boolean") return null;
    return parsed;
  } catch {
    return null;
  }
}

/** True once the visitor has made any choice (accept or reject). */
export function hasDecided() {
  return getConsent() !== null;
}

/** True only if the visitor opted in to marketing/analytics tracking. */
export function hasMarketingConsent() {
  const c = getConsent();
  return !!(c && c.marketing);
}

/**
 * Persist the visitor's choice and notify listeners.
 * @param {boolean} marketing whether marketing/analytics tracking is allowed
 */
export function setConsent(marketing) {
  if (typeof window === "undefined") return;
  try {
    const value = {
      v: CONSENT_VERSION,
      marketing: !!marketing,
      ts: new Date().toISOString(),
    };
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
    window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
  } catch {
    // ignore
  }
}

/** Ask the banner to re-open its settings view (used by the footer link). */
export function openConsentSettings() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}
