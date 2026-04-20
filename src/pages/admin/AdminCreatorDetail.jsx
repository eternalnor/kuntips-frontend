import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { adminCreatorDetail, adminResendPayoutEmail } from "../../api/admin.js";
import { usePageTitle } from "../../hooks/usePageTitle.js";

function formatNok(minor) {
  return Math.round((minor || 0) / 100).toLocaleString("nb-NO") + " NOK";
}

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

export default function AdminCreatorDetail() {
  const { id } = useParams();
  usePageTitle(`Creator #${id}`);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resending, setResending] = useState(null); // payout id currently resending

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    adminCreatorDetail(id)
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Failed to load");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function resendPayoutEmail(payoutId) {
    if (resending) return;
    setResending(payoutId);
    try {
      await adminResendPayoutEmail(payoutId, Number(id));
      alert("Payout email sent.");
    } catch (err) {
      alert("Failed: " + (err.message || "unknown"));
    } finally {
      setResending(null);
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-loading">Loading\u2026</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="admin-page">
        <p className="admin-login-error">{error}</p>
      </div>
    );
  }

  const { creator, totals, recentTips, payouts, referralsCount } = data;

  return (
    <div className="admin-page">
      <p className="admin-back">
        <Link to="/admin/creators" className="admin-link">\u2190 All creators</Link>
      </p>

      <h1>
        {creator.username}
        {creator.is_seed ? <span className="admin-chip admin-chip--muted" style={{ marginLeft: "0.6rem" }}>seed</span> : null}
      </h1>
      <p className="admin-page-sub">
        ID {creator.id} \u00b7 {creator.display_name} \u00b7 {creator.email || "(no email)"}
      </p>

      <section className="admin-stat-grid" style={{ marginTop: "0.5rem" }}>
        <StatCard label="Current tier" value={`T${creator.current_tier}`} />
        <StatCard label="Platform fee" value={`${(creator.platform_fee_bps / 100).toFixed(2)}%`} />
        <StatCard label="Stripe connected" value={creator.has_stripe ? "Yes" : "No"} />
        <StatCard label="Email verified" value={creator.email_verified ? "Yes" : "No"} />
        <StatCard label="Tips succeeded" value={totals.tips_succeeded} sub={`${totals.tips_all} total`} />
        <StatCard label="Lifetime earned" value={formatNok(totals.lifetime_net_nok * 100)} />
        <StatCard label="Referrals made" value={referralsCount} />
        <StatCard label="Debt" value={formatNok(creator.creator_debt_minor)} />
      </section>

      <section className="admin-section">
        <h2 className="admin-section-title">Meta</h2>
        <dl className="admin-dl">
          <dt>Joined</dt>
          <dd>{formatDate(creator.created_at)}</dd>
          <dt>Tier last promoted</dt>
          <dd>{formatDate(creator.tier_last_promotion_at)}</dd>
          <dt>Signup code</dt>
          <dd className="admin-mono">{creator.signup_code || "—"}</dd>
          <dt>Referred by</dt>
          <dd>{creator.referred_by_username || (creator.signup_code ? "KunTips" : "—")}</dd>
          <dt>Active</dt>
          <dd>{creator.is_active ? "Yes" : "No"}</dd>
        </dl>
      </section>

      {creator.bio && (
        <section className="admin-section">
          <h2 className="admin-section-title">Bio</h2>
          <p className="admin-bio">{creator.bio}</p>
        </section>
      )}

      <section className="admin-section">
        <h2 className="admin-section-title">Recent tips</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Intended</th>
              <th>Creator net</th>
              <th>Status</th>
              <th>From</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {recentTips.length === 0 && (
              <tr><td colSpan={6} className="admin-muted">No tips yet.</td></tr>
            )}
            {recentTips.map((t) => (
              <tr key={t.id}>
                <td>#{t.id}</td>
                <td>{formatNok(t.tip_amount_intended)}</td>
                <td>{formatNok(t.creator_net_minor)}</td>
                <td><StatusPill status={t.status} /></td>
                <td>{t.tipper_name || <span className="admin-muted">anon</span>}</td>
                <td className="admin-muted">{formatDate(t.tipped_at || t.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="admin-section">
        <h2 className="admin-section-title">Payouts</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Requested</th>
              <th>Paid</th>
              <th>Stripe ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {payouts.length === 0 && (
              <tr><td colSpan={7} className="admin-muted">No payouts yet.</td></tr>
            )}
            {payouts.map((p) => (
              <tr key={p.id}>
                <td>#{p.id}</td>
                <td>{formatNok(p.payout_amount_minor)}</td>
                <td><StatusPill status={p.status} /></td>
                <td className="admin-muted">{formatDate(p.requested_at)}</td>
                <td className="admin-muted">{formatDate(p.paid_at)}</td>
                <td className="admin-mono admin-muted">{p.stripe_payout_id || "—"}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => resendPayoutEmail(p.id)}
                    disabled={resending === p.id}
                    className="admin-btn-small"
                  >
                    {resending === p.id ? "Sending\u2026" : "Resend email"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="admin-stat-card">
      <span className="admin-stat-card__label">{label}</span>
      <span className="admin-stat-card__value">{value}</span>
      {sub && <span className="admin-stat-card__sub">{sub}</span>}
    </div>
  );
}

function StatusPill({ status }) {
  const color =
    status === "succeeded" || status === "paid" || status === "processing"
      ? "#22c55e"
      : status === "failed" || status === "dispute_lost" || status === "refunded" || status === "cancelled"
      ? "#f97316"
      : "#94a3b8";
  return (
    <span className="admin-pill" style={{ color, borderColor: color + "55" }}>
      {status}
    </span>
  );
}
