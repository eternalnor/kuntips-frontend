// src/api/admin.js
// API helpers for the /admin/* endpoints. Uses a separate session token from
// the creator session (stored in localStorage under a different key).

const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "");

const ADMIN_SESSION_KEY = "kuntips_admin_session";
const ADMIN_USERNAME_KEY = "kuntips_admin_username";

// ───────────────────────────── session utilities ─────────────────────────────

export function getAdminSessionToken() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(ADMIN_SESSION_KEY);
  } catch {
    return null;
  }
}

export function setAdminSessionToken(token) {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      window.localStorage.setItem(ADMIN_SESSION_KEY, token);
    } else {
      window.localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  } catch {}
}

export function getAdminUsername() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(ADMIN_USERNAME_KEY);
  } catch {
    return null;
  }
}

export function setAdminUsername(username) {
  if (typeof window === "undefined") return;
  try {
    if (username) {
      window.localStorage.setItem(ADMIN_USERNAME_KEY, username);
    } else {
      window.localStorage.removeItem(ADMIN_USERNAME_KEY);
    }
  } catch {}
}

export function clearAdminSession() {
  setAdminSessionToken(null);
  setAdminUsername(null);
}

function adminAuthHeaders() {
  const token = getAdminSessionToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

// ───────────────────────────── low-level fetch ─────────────────────────────

async function adminFetch(path, options = {}) {
  const url =
    path.startsWith("http://") || path.startsWith("https://")
      ? path
      : `${API_BASE_URL}${path}`;

  const mergedHeaders = {
    "Content-Type": "application/json",
    ...adminAuthHeaders(),
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers: mergedHeaders });

  const contentType = response.headers.get("Content-Type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    // On 401, clear the admin session (but don't redirect — let the caller handle)
    if (response.status === 401) {
      clearAdminSession();
    }
    const error = new Error(body?.error || body?.message || `Request failed: ${response.status}`);
    error.status = response.status;
    error.data = body;
    throw error;
  }

  return body;
}

// ───────────────────────────── auth ─────────────────────────────

export async function adminLogin(username, password) {
  const data = await adminFetch("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  if (data?.sessionToken) {
    setAdminSessionToken(data.sessionToken);
    setAdminUsername(data.username || username);
  }
  return data;
}

export async function adminLogout() {
  try {
    await adminFetch("/admin/auth/logout", { method: "POST" });
  } catch {
    // even on error, clear local session
  }
  clearAdminSession();
}

export function adminMe() {
  return adminFetch("/admin/me", { method: "GET" });
}

// ───────────────────────────── platform events ─────────────────────────────

export function adminGetPlatformEvent() {
  return adminFetch("/admin/platform-event", { method: "GET" });
}

export function adminCreatePlatformEvent({ boost_tiers, expires_at, label }) {
  return adminFetch("/admin/platform-event", {
    method: "POST",
    body: JSON.stringify({ boost_tiers, expires_at, label }),
  });
}

export function adminDeletePlatformEvent() {
  return adminFetch("/admin/platform-event", { method: "DELETE" });
}

// ───────────────────────────── overview / creators / codes (Step 3) ─────────

export function adminOverview() {
  return adminFetch("/admin/overview", { method: "GET" });
}

export function adminCreators({ search = "", hasStripe = "", active = "", page = 1 } = {}) {
  const qs = new URLSearchParams();
  if (search) qs.set("search", search);
  if (hasStripe) qs.set("hasStripe", hasStripe);
  if (active) qs.set("active", active);
  qs.set("page", String(page));
  return adminFetch(`/admin/creators?${qs.toString()}`, { method: "GET" });
}

export function adminCreatorDetail(id) {
  return adminFetch(`/admin/creators/${id}`, { method: "GET" });
}

export function adminListReferralCodes() {
  return adminFetch("/admin/referral-codes", { method: "GET" });
}

export function adminCreateReferralCode({ code, description }) {
  return adminFetch("/admin/referral-codes", {
    method: "POST",
    body: JSON.stringify({ code, description }),
  });
}

export function adminToggleReferralCode(id, isActive) {
  return adminFetch(`/admin/referral-codes/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ is_active: isActive ? 1 : 0 }),
  });
}

export function adminResendPayoutEmail(payoutId, creatorId) {
  return adminFetch("/admin/resend-payout-email", {
    method: "POST",
    body: JSON.stringify({ payoutId, creatorId }),
  });
}
