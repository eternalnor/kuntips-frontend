// src/visit.js
// Landing ping + visitor identity for /admin/stats.
//
// Every visitor pings the Worker once per browser session (referral.js only
// ever pinged ?ref= arrivals), so the dashboard gets organic/direct traffic,
// conversion by device and in-app browser, and per-ad-creative results.
//
// Identity is a random id this browser made up for itself. It is first-party
// functional storage in the same sense as the referral code: it exists to
// count this browser once and to join a later signup back to the visit. It is
// not gated on marketing consent — no third party ever sees it, and gating it
// would make the conversion rates lie for everyone who declines cookies.
//
// The ad-creative id (?ad=) is LAST-touch on purpose: clicking a second ad is a
// second paid click, and the creative that produced the signup is the one that
// was clicked last. (The referral code stays first-touch; see referral.js.)

import { VANITY_PATHS } from "./vanity.js";

const VISITOR_KEY = "kuntips_visitor_id";
const AD_KEY = "kuntips_ad";
const PINGED_KEY = "kuntips_visit_pinged";
const AD_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

const VALID_ID = /^[A-Za-z0-9_-]{8,64}$/;

function randomId() {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    // fall through
  }
  return `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

/** This browser's visitor id, created on first use. Null if storage is unavailable. */
export function getVisitorId() {
  if (typeof window === "undefined") return null;
  try {
    let id = window.localStorage.getItem(VISITOR_KEY);
    if (!id || !VALID_ID.test(id)) {
      id = randomId();
      window.localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

/**
 * Sanitise ?ad= the same way the Worker does: platforms substitute a macro
 * ({{ad.id}} on Meta, __CID__ on TikTok) and every real id contains a digit
 * while no macro does — so an unexpanded macro never becomes a creative.
 */
function cleanAdId(raw) {
  if (typeof raw !== "string") return null;
  const cleaned = raw.trim().replace(/[^A-Za-z0-9_-]/g, "").slice(0, 32);
  if (!cleaned || !/\d/.test(cleaned)) return null;
  return cleaned;
}

/** Read ?ad= from a query string; store it (last-touch) when present. */
export function captureAdFromSearch(search) {
  if (typeof window === "undefined") return null;
  try {
    const ad = cleanAdId(new URLSearchParams(search).get("ad"));
    if (ad) {
      window.localStorage.setItem(AD_KEY, JSON.stringify({ ad, ts: new Date().toISOString() }));
    }
    return ad;
  } catch {
    return null;
  }
}

/** The ad creative this browser last arrived through, if within 30 days. */
export function getAttributedAd() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AD_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const ts = Date.parse(parsed?.ts);
    if (!parsed || Number.isNaN(ts) || Date.now() - ts > AD_MAX_AGE_MS) {
      window.localStorage.removeItem(AD_KEY);
      return null;
    }
    return cleanAdId(parsed.ad);
  } catch {
    return null;
  }
}

/**
 * Log this landing once per browser session. Fire-and-forget: a failed ping
 * must never affect the page.
 */
export function pingLanding() {
  if (typeof window === "undefined" || typeof fetch === "undefined" || !API_BASE_URL) return;
  // Read the LIVE url, not the router's location for the render that fired
  // the effect: a vanity path (/tt) redirects during render, so the router's
  // search is already stale by the time this runs. And never ping from the
  // vanity path itself — the redirected render pings, carrying the code.
  const pathname = window.location.pathname;
  if (VANITY_PATHS[pathname.replace(/^\/+|\/+$/g, "").toLowerCase()]) return;
  try {
    if (window.sessionStorage.getItem(PINGED_KEY) === "1") return;
    window.sessionStorage.setItem(PINGED_KEY, "1");
  } catch {
    // sessionStorage unavailable — ping anyway rather than lose the visit
  }
  try {
    const params = new URLSearchParams(window.location.search);
    const ref = (params.get("ref") || "").trim();
    fetch(`${API_BASE_URL}/visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId: getVisitorId(),
        code: /^[A-Za-z0-9_-]{1,64}$/.test(ref) ? ref : null,
        ad: cleanAdId(params.get("ad")),
        path: pathname,
        referrer: typeof document !== "undefined" ? document.referrer || null : null,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore
  }
}
