//  api.js
const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Normalize base URL (remove trailing slashes)
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "");

async function fetchJson(path, options = {}) {
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

export function fetchCreatorDashboard(username) {
  if (!username) {
    return Promise.reject(new Error("Creator username is required"));
  }

  const encoded = encodeURIComponent(username.trim().toLowerCase());
  return fetchJson(`/creators/${encoded}/dashboard`, {
    method: "GET",
  });
}
