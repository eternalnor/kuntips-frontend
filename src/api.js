// src/api.js
const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Normalize base URL (remove trailing slashes)
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "");

// --- Auth helpers (frontend only) ---

function getSessionToken() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem("kuntips_creator_session");
  } catch {
    return null;
  }
}

export function authHeaders() {
  const token = getSessionToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// --- Core JSON fetch ---

export async function fetchJson(path, options = {}) {
  const url =
    path.startsWith("http://") || path.startsWith("https://")
      ? path
      : `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // If backend ever sends non-JSON, we don't blow up parsing
      data = text;
    }
  }

  if (!response.ok) {
    const error = new Error(
      (data && data.message) || `Request failed with status ${response.status}`,
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// --- Creator dashboard / profile ---

export function fetchCreatorDashboard(username) {
  if (!username) {
    return Promise.reject(new Error("Creator username is required"));
  }

  const encoded = encodeURIComponent(username.trim().toLowerCase());
  return fetchJson(`/creators/${encoded}/dashboard`, {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });
}

export function updateCreatorProfile(username, { displayName, bio }) {
  if (!username) {
    return Promise.reject(new Error("Creator username is required"));
  }

  const encoded = encodeURIComponent(username.trim().toLowerCase());

  return fetchJson(`/creators/${encoded}/profile`, {
    method: "PUT",
    headers: {
      ...authHeaders(),
    },
    body: JSON.stringify({
      displayName,
      bio,
    }),
  });
}

// --- Auth API ---

export function loginCreator(email, password) {
  return fetchJson(`/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function fetchCurrentCreator() {
  return fetchJson(`/auth/me`, {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });
}
