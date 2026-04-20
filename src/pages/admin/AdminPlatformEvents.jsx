import { useEffect, useState } from "react";
import {
  adminGetPlatformEvent,
  adminCreatePlatformEvent,
  adminDeletePlatformEvent,
} from "../../api/admin.js";
import { usePageTitle } from "../../hooks/usePageTitle.js";

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("nb-NO", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

// Convert an ISO string to the format needed by datetime-local input
function toLocalInputValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminPlatformEvents() {
  usePageTitle("Platform events");

  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [label, setLabel] = useState("");
  const [boostTiers, setBoostTiers] = useState(1);
  // default to 24 hours from now
  const [expiresAt, setExpiresAt] = useState(
    toLocalInputValue(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()),
  );

  async function refresh() {
    setLoading(true);
    try {
      const d = await adminGetPlatformEvent();
      setCurrent(d);
    } catch (err) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (submitting) return;
    if (!expiresAt) {
      alert("Pick an expiry date.");
      return;
    }
    setSubmitting(true);
    try {
      const iso = new Date(expiresAt).toISOString();
      await adminCreatePlatformEvent({
        boost_tiers: Number(boostTiers),
        expires_at: iso,
        label,
      });
      await refresh();
    } catch (err) {
      alert("Failed: " + (err.message || "unknown"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeactivate() {
    if (!confirm("Deactivate the current platform event?")) return;
    try {
      await adminDeletePlatformEvent();
      await refresh();
    } catch (err) {
      alert("Failed: " + (err.message || "unknown"));
    }
  }

  return (
    <div className="admin-page">
      <h1>Platform events</h1>
      <p className="admin-page-sub">
        Grant a temporary tier boost to every creator (e.g. a weekend promo).
      </p>

      {loading && <p className="admin-loading">Loading\u2026</p>}
      {error && <p className="admin-login-error">{error}</p>}

      {!loading && current && (
        <section className="admin-section">
          <h2 className="admin-section-title">Current</h2>
          {current.active && current.event ? (
            <div className="admin-event-box">
              <div>
                <strong>{current.event.label || "(no label)"}</strong>
              </div>
              <div>Boost: +{current.event.boost_tiers} tiers</div>
              <div>Expires: {formatDate(current.event.expires_at)}</div>
              <div style={{ marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={handleDeactivate}
                  className="admin-btn-small admin-btn-danger"
                >
                  Deactivate
                </button>
              </div>
            </div>
          ) : (
            <p className="admin-muted">No active event.</p>
          )}
        </section>
      )}

      <section className="admin-section">
        <h2 className="admin-section-title">Create new</h2>
        <form className="admin-form" onSubmit={handleCreate}>
          <label className="admin-field">
            <span>Label</span>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Easter weekend boost"
            />
          </label>

          <label className="admin-field">
            <span>Boost tiers</span>
            <input
              type="number"
              min={1}
              max={3}
              value={boostTiers}
              onChange={(e) => setBoostTiers(e.target.value)}
              required
            />
          </label>

          <label className="admin-field">
            <span>Expires at</span>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Creating\u2026" : "Activate event"}
          </button>
        </form>
      </section>
    </div>
  );
}
