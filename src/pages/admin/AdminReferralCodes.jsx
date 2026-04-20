import { useEffect, useState } from "react";
import {
  adminListReferralCodes,
  adminCreateReferralCode,
  adminToggleReferralCode,
} from "../../api/admin.js";
import { usePageTitle } from "../../hooks/usePageTitle.js";

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("nb-NO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function AdminReferralCodes() {
  usePageTitle("Referral codes");
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newCode, setNewCode] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const d = await adminListReferralCodes();
      setCodes(d.codes || []);
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
    setSubmitting(true);
    try {
      await adminCreateReferralCode({
        code: newCode,
        description: newDescription,
      });
      setNewCode("");
      setNewDescription("");
      await refresh();
    } catch (err) {
      alert("Failed: " + (err.data?.error || err.message || "unknown"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggle(id, isActive) {
    try {
      await adminToggleReferralCode(id, !isActive);
      await refresh();
    } catch (err) {
      alert("Failed: " + (err.message || "unknown"));
    }
  }

  const shareBase = "https://kuntips.no/creators/register?ref=";

  return (
    <div className="admin-page">
      <h1>Referral codes</h1>
      <p className="admin-page-sub">
        Trackable codes for marketing campaigns. Signups via a code show "KunTips" as the referrer on the creator's dashboard.
      </p>

      <section className="admin-section">
        <h2 className="admin-section-title">Create new code</h2>
        <form className="admin-form admin-form--inline" onSubmit={handleCreate}>
          <label className="admin-field">
            <span>Code</span>
            <input
              type="text"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              placeholder="E.g. TWITTER_MARCH"
              required
            />
          </label>

          <label className="admin-field admin-field--grow">
            <span>Description</span>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Where is this posted?"
            />
          </label>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Creating…" : "Create"}
          </button>
        </form>
      </section>

      {loading && <p className="admin-loading">Loading…</p>}
      {error && <p className="admin-login-error">{error}</p>}

      {!loading && (
        <section className="admin-section">
          <h2 className="admin-section-title">All codes ({codes.length})</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
                <th>Signups</th>
                <th>Stripe</th>
                <th>First tip</th>
                <th>Volume</th>
                <th>Created</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {codes.length === 0 && (
                <tr><td colSpan={9} className="admin-muted">No codes yet.</td></tr>
              )}
              {codes.map((c) => (
                <tr key={c.id} style={c.is_active ? {} : { opacity: 0.55 }}>
                  <td>
                    <div className="admin-mono admin-code-chip">{c.code}</div>
                    <div className="admin-muted admin-share-link">
                      <a
                        href={`${shareBase}${encodeURIComponent(c.code)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        share link
                      </a>
                    </div>
                  </td>
                  <td>{c.description || <span className="admin-muted">—</span>}</td>
                  <td><strong>{c.stats.signups}</strong></td>
                  <td>{c.stats.stripe_connected}</td>
                  <td>{c.stats.first_tip}</td>
                  <td>{c.stats.volume_nok.toLocaleString("nb-NO")} NOK</td>
                  <td className="admin-muted">{formatDate(c.created_at)}</td>
                  <td>
                    {c.is_active ? (
                      <span className="admin-good">Active</span>
                    ) : (
                      <span className="admin-muted">Inactive</span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggle(c.id, c.is_active)}
                      className={"admin-btn-small" + (c.is_active ? " admin-btn-danger" : "")}
                    >
                      {c.is_active ? "Deactivate" : "Reactivate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
