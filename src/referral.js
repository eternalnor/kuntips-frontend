// src/referral.js
// Referral-code capture.
//
// A tracked link used to have to point at /creators/register, because that was
// the only page that read ?ref=. That forced every marketing post to skip the
// landing page and drop strangers onto a bare form. Capturing the code anywhere
// means one link shape — kuntips.no/?ref=CODE — works for every campaign, and
// the visitor can browse before signing up without losing the attribution.
//
// The code is first-party functional storage, not tracking: it exists purely to
// deliver the thing the visitor clicked a link for. It is deliberately NOT
// gated on marketing consent, which would break referrals for anyone who
// declines cookies.

const REFERRAL_KEY = "kuntips_referral";

// Long enough to survive "I'll look at this properly tonight", short enough
// that a code from months ago doesn't get credit for an unrelated signup.
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

// Matches usernames and admin codes; keeps anything weird out of storage.
const VALID = /^[a-zA-Z0-9_-]{1,64}$/;

/** Read a stored referral code, or null if absent, malformed, or expired. */
export function getStoredReferral() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(REFERRAL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.code !== "string") return null;
    if (!VALID.test(parsed.code)) return null;
    const ts = Date.parse(parsed.ts);
    if (Number.isNaN(ts) || Date.now() - ts > MAX_AGE_MS) {
      window.localStorage.removeItem(REFERRAL_KEY);
      return null;
    }
    return parsed.code;
  } catch {
    return null;
  }
}

/**
 * Store a referral code. Last touch wins: if someone arrives through a second
 * campaign later, that campaign gets the credit.
 */
export function storeReferral(code) {
  if (typeof window === "undefined") return;
  if (typeof code !== "string" || !VALID.test(code)) return;
  try {
    window.localStorage.setItem(
      REFERRAL_KEY,
      JSON.stringify({ code, ts: new Date().toISOString() }),
    );
  } catch {
    // ignore
  }
}

/**
 * Pull ?ref= out of a query string and persist it.
 * @param {string} search location.search
 * @returns {string|null} the captured code, if there was one
 */
export function captureReferralFromSearch(search) {
  if (typeof window === "undefined") return null;
  try {
    const code = (new URLSearchParams(search).get("ref") || "").trim();
    if (!code || !VALID.test(code)) return null;
    storeReferral(code);
    return code;
  } catch {
    return null;
  }
}

/** The code to use for a signup: whatever is in the URL, else whatever we kept. */
export function getActiveReferral(search) {
  return captureReferralFromSearch(search) ?? getStoredReferral();
}

/** Called after a successful signup so the code can't leak into a later one. */
export function clearReferral() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(REFERRAL_KEY);
  } catch {
    // ignore
  }
}
