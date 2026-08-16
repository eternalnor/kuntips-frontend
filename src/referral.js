// src/referral.js
// Referral-code capture.
//
// A tracked link used to have to point at /creators/register, because that was
// the only page that read ?ref=. That forced every marketing post to skip the
// landing page and drop strangers onto a bare form. Capturing the code anywhere
// means one link shape — kuntips.no/?ref=CODE — works for every campaign, and
// the visitor can browse before signing up without losing the attribution.
//
// FIRST-TOUCH, not last: an existing code is never overwritten. The question a
// campaign report answers is "what introduced this creator to us", and that is
// the first thing they clicked, not the most recent.
//
// Storage is plain localStorage. A server-set first-party cookie was considered,
// to dodge Safari's purge of script-writable storage after 7 days without
// interaction — but that only affects a visitor who clicks, then doesn't touch
// the site for over a week, then returns to sign up. It also wouldn't help the
// case it was meant for: a click inside the Instagram app uses a separate
// storage context, so nothing carries over to real Safari either way.
//
// The code is first-party functional storage, not tracking: it exists purely to
// deliver the thing the visitor clicked a link for. It is deliberately NOT
// gated on marketing consent, which would break referrals for anyone who
// declines cookies.

const REFERRAL_KEY = "kuntips_referral";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

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
 * Store a referral code locally. First-touch: an existing, unexpired code is
 * left alone, so a later campaign cannot claim a visitor an earlier one found.
 */
export function storeReferral(code) {
  if (typeof window === "undefined") return;
  if (typeof code !== "string" || !VALID.test(code)) return;
  if (getStoredReferral()) return; // first touch wins
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
 * Log the visit, so campaign stats have a denominator — "3 signups" is
 * unreadable without knowing whether that took 10 visits or 1000.
 *
 * Fire-and-forget: a failed ping must never affect the page.
 */
function pingVisit(code) {
  if (typeof fetch === "undefined" || !API_BASE_URL) return;
  try {
    fetch(`${API_BASE_URL}/referral/visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        path: typeof location !== "undefined" ? location.pathname : null,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore
  }
}

/**
 * Pull ?ref= out of a query string, persist it, and log the visit.
 * @param {string} search location.search
 * @returns {string|null} the captured code, if there was one
 */
export function captureReferralFromSearch(search) {
  if (typeof window === "undefined") return null;
  try {
    const code = (new URLSearchParams(search).get("ref") || "").trim();
    if (!code || !VALID.test(code)) return null;

    // Only ping once per code per visit — this runs on every route change, and
    // a re-render must not inflate the visit count the conversion rate divides
    // by. sessionStorage resets with the tab, which is the right granularity.
    let alreadyPinged = false;
    try {
      const key = `kuntips_ref_pinged_${code}`;
      alreadyPinged = window.sessionStorage.getItem(key) === "1";
      if (!alreadyPinged) window.sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage unavailable — ping anyway rather than lose the visit
    }
    if (!alreadyPinged) pingVisit(code);

    storeReferral(code);
    return getStoredReferral() ?? code;
  } catch {
    return null;
  }
}

/** The code to use for a signup: whatever is stored, else what's in the URL. */
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
