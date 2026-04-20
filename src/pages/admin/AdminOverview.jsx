import { useEffect, useState } from "react";
import { adminOverview } from "../../api/admin.js";
import { usePageTitle } from "../../hooks/usePageTitle.js";

function formatNok(n) {
  return (n || 0).toLocaleString("nb-NO");
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

function formatDateShort(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("nb-NO", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return iso;
  }
}

export default function AdminOverview() {
  usePageTitle("Overview");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    adminOverview()
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Failed to load overview");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="admin-page">
        <h1>Overview</h1>
        <p className="admin-loading">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <h1>Overview</h1>
        <p className="admin-login-error">{error}</p>
      </div>
    );
  }

  const { totals, funnel, last7Days, recentActivity, platformEvent } = data;

  return (
    <div className="admin-page">
      <h1>Overview</h1>
      <p className="admin-page-sub">Real numbers from the production DB.</p>

      {/* Totals */}
      <section className="admin-stat-grid">
        <StatCard label="Creators (active)" value={totals.creatorsActive} sub={`${totals.creators} total`} />
        <StatCard label="Stripe connected" value={totals.creatorsWithStripe} />
        <StatCard label="Tips succeeded" value={totals.tipsSucceeded} sub={`${totals.tips} total`} />
        <StatCard label="Volume (NOK)" value={formatNok(totals.volumeNok)} />
        <StatCard label="Earned by creators (NOK)" value={formatNok(totals.earnedByCreatorsNok)} />
        <StatCard label="Platform revenue (NOK)" value={formatNok(totals.platformRevenueNok)} highlight />
      </section>

      {/* Funnel */}
      <section className="admin-section">
        <h2 className="admin-section-title">Signup funnel</h2>
        <div className="admin-funnel">
          <FunnelStep label="Registered" value={funnel.registered} total={funnel.registered} />
          <FunnelStep label="Email verified" value={funnel.emailVerified} total={funnel.registered} />
          <FunnelStep label="Stripe connected" value={funnel.stripeConnected} total={funnel.registered} />
          <FunnelStep label="Received first tip" value={funnel.receivedFirstTip} total={funnel.registered} />
        </div>
      </section>

      {/* Last 7 days */}
      <section className="admin-section">
        <h2 className="admin-section-title">Last 7 days</h2>
        <div className="admin-split">
          <div className="admin-half">
            <h3 className="admin-h3">Signups</h3>
            <SimpleBars rows={last7Days.signups} valueKey="count" />
          </div>
          <div className="admin-half">
            <h3 className="admin-h3">Tips</h3>
            <SimpleBars rows={last7Days.tips} valueKey="count" subKey="volume_nok" subSuffix=" NOK" />
          </div>
        </div>
      </section>

      {/* Platform event */}
      <section className="admin-section">
        <h2 className="admin-section-title">Active platform event</h2>
        {platformEvent.active ? (
          <div className="admin-event-box">
            <div><strong>{platformEvent.label || "(no label)"}</strong></div>
            <div>Boost: +{platformEvent.boost_tiers} tiers</div>
            <div>Expires: {formatDate(platformEvent.expires_at)}</div>
          </div>
        ) : (
          <p className="admin-muted">No active platform event.</p>
        )}
      </section>

      {/* Recent activity */}
      <section className="admin-section">
        <div className="admin-split">
          <div className="admin-half">
            <h2 className="admin-section-title">Recent signups</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.recentSignups.length === 0 && (
                  <tr><td colSpan={3} className="admin-muted">None yet.</td></tr>
                )}
                {recentActivity.recentSignups.map((s) => (
                  <tr key={s.id}>
                    <td><strong>{s.username}</strong></td>
                    <td className="admin-mono">{s.email || "—"}</td>
                    <td className="admin-muted">{formatDate(s.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-half">
            <h2 className="admin-section-title">Recent tips</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Creator</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.recentTips.length === 0 && (
                  <tr><td colSpan={4} className="admin-muted">None yet.</td></tr>
                )}
                {recentActivity.recentTips.map((t) => (
                  <tr key={t.id}>
                    <td><strong>{t.creator_username}</strong></td>
                    <td>{formatNok(Math.round(t.tip_amount_intended / 100))} NOK</td>
                    <td><StatusPill status={t.status} /></td>
                    <td className="admin-muted">{formatDateShort(t.tipped_at || t.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, sub, highlight }) {
  return (
    <div className={"admin-stat-card" + (highlight ? " admin-stat-card--highlight" : "")}>
      <span className="admin-stat-card__label">{label}</span>
      <span className="admin-stat-card__value">{value}</span>
      {sub && <span className="admin-stat-card__sub">{sub}</span>}
    </div>
  );
}

function FunnelStep({ label, value, total }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="admin-funnel__step">
      <div className="admin-funnel__header">
        <span>{label}</span>
        <span className="admin-muted">{value} ({pct}%)</span>
      </div>
      <div className="admin-funnel__bar">
        <div className="admin-funnel__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SimpleBars({ rows, valueKey, subKey, subSuffix = "" }) {
  if (!rows || rows.length === 0) {
    return <p className="admin-muted">No data.</p>;
  }
  const max = Math.max(...rows.map((r) => r[valueKey] || 0), 1);
  return (
    <div className="admin-bars">
      {rows.map((r) => {
        const h = Math.max(3, Math.round(((r[valueKey] || 0) / max) * 60));
        return (
          <div className="admin-bar" key={r.date}>
            <div className="admin-bar__fill" style={{ height: `${h}px` }} />
            <div className="admin-bar__value">{r[valueKey]}</div>
            <div className="admin-bar__date">{formatDateShort(r.date)}</div>
            {subKey && (
              <div className="admin-bar__sub">{(r[subKey] || 0).toLocaleString("nb-NO")}{subSuffix}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StatusPill({ status }) {
  const color =
    status === "succeeded" ? "#22c55e" :
    status === "failed" || status === "dispute_lost" || status === "refunded" ? "#f97316" :
    "#94a3b8";
  return (
    <span className="admin-pill" style={{ color, borderColor: color + "55" }}>
      {status}
    </span>
  );
}
