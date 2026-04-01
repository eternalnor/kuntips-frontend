// src/api.js

const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "");

const SESSION_KEY = "kuntips_creator_session";

/**
 * Low-level helper to talk to the KunTips backend.
 */
async function fetchJson(path, options = {}) {
  const url =
    path.startsWith("http://") || path.startsWith("https://")
      ? path
      : `${API_BASE_URL}${path}`;

  const baseHeaders = {
    "Content-Type": "application/json",
  };

  const mergedHeaders = {
    ...baseHeaders,
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers: mergedHeaders,
  });

  const contentType = response.headers.get("Content-Type") || "";
  const isJson = contentType.includes("application/json");

  const body = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("kuntips_creator_session");
        window.localStorage.removeItem("kuntips_creator_username");
        window.localStorage.removeItem("kuntips_creator_email");
        window.dispatchEvent(new Event("kuntips-auth-change"));
      } catch {}
    }
    const error = new Error(body?.message || `Request failed: ${response.status}`);
    error.status = response.status;
    error.data = body;
    throw error;
  }

  return body;
}

/**
 * Session token utilities
 */

export function getSessionToken() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function setSessionToken(token) {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      window.localStorage.setItem(SESSION_KEY, token);
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // ignore
  }
}

export function clearSessionToken() {
  setSessionToken(null);
}

export function authHeaders() {
  const token = getSessionToken();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Auth-related API helpers
 */

// Login: returns { token/sessionToken, creator }
export async function loginCreator(email, password) {
  const data = await fetchJson("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const token = data?.sessionToken || data?.token;
  if (token) {
    setSessionToken(token);
  }

  return data;
}

// Register: returns { sessionToken, creator } and stores session token
export async function registerCreator(payload) {
  const body = {
    email: payload.email,
    username: payload.username,
    displayName: payload.displayName,
    password: payload.password,
    // backend ignores extra fields, but we can pass them if you want:
    // confirmPassword: payload.confirmPassword,
    // agreeTerms: payload.agreeTerms,
  };

  // NEW: optional referral code
  if (payload.referralCode) {
    body.referralCode = payload.referralCode;
  }

  const data = await fetchJson("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const token = data?.sessionToken || data?.token;
  if (token) {
    setSessionToken(token);
  }

  return data;
}

// Fetch current creator from token
export function fetchCurrentCreator() {
  return fetchJson("/auth/me", {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });
}

// Change password (requires valid session token)
export function changePassword(currentPassword, newPassword) {
  return fetchJson("/auth/change-password", {
    method: "POST",
    headers: {
      ...authHeaders(),
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

// Clear local session only – backend token will simply expire
export function logoutCreator() {
  clearSessionToken();
}

/**
 * Creator dashboard + profile
 */

export function fetchCreatorDashboard(username) {
  const safeUsername = encodeURIComponent(username);
  return fetchJson(`/creators/${safeUsername}/dashboard`, {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });
}

export function updateCreatorProfile(username, { displayName, bio }) {
  const safeUsername = encodeURIComponent(username);
  return fetchJson(`/creators/${safeUsername}/profile`, {
    method: "PUT",
    headers: {
      ...authHeaders(),
    },
    body: JSON.stringify({ displayName, bio }),
  });
}

export function createStripeAccountLink(returnUrlPath) {
  const body = returnUrlPath ? { returnUrlPath } : {};
  return fetchJson("/connect/create-account-link", {
    method: "POST",
    headers: {
      ...authHeaders(),
    },
    body: JSON.stringify(body),
  });
}

export function fetchPayoutPreview(username) {
  const safeUsername = encodeURIComponent(username);
  return fetchJson(`/creators/${safeUsername}/payouts/preview`, {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });
}

export function requestPayout(username) {
  const safeUsername = encodeURIComponent(username);
  return fetchJson(`/creators/${safeUsername}/payouts/request`, {
    method: "POST",
    headers: {
      ...authHeaders(),
    },
    body: JSON.stringify({}),
  });
}

export function fetchPayoutStatement(username, payoutId) {
  const safeUsername = encodeURIComponent(username);
  return fetchJson(`/creators/${safeUsername}/payouts/${payoutId}/statement`, {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });
}

// Verify email address with token from URL
export function verifyEmail(token) {
  return fetchJson(`/auth/verify-email?token=${encodeURIComponent(token)}`, {
    method: "GET",
  });
}

// Resend verification email (requires session)
export function resendVerificationEmail() {
  return fetchJson("/auth/resend-verification", {
    method: "POST",
    headers: {
      ...authHeaders(),
    },
    body: JSON.stringify({}),
  });
}

// Request a password reset link (no session required)
export function forgotPassword(email) {
  return fetchJson("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// Reset password using the token from the email link
export function resetPassword(token, newPassword) {
  return fetchJson("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
}
