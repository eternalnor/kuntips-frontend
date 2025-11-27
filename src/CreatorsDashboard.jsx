// CreatorsDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { fetchCreatorDashboard } from "./api";

function useQuery() {
  const location = useLocation();
  return useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
}

function CreatorsDashboard() {
  const query = useQuery();
  const username = (query.get("username") || "").trim();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      setError("No creator username provided in the URL.");
      setPayload(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCreatorDashboard(username)
      .then((data) => {
        if (cancelled) return;
        setPayload(data);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load creator dashboard:", err);
        setError(
          err.data?.message ||
            err.message ||
            "Could not load dashboard data. Please try again.",
        );
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  const creatorDisplayName =
    payload?.creator?.displayName || payload?.creator?.username || username;

  const stats = payload?.stats;
  const tier = payload?.tier;
  const recentTips = payload?.recentTips || [];

  const keptPercentLabel = tier
    ? `${Math.round(tier.keptPercent * 10) / 10}%`
    : null;

  const nextTierText =
    tier && tier.nextTier
      ? `Tip ${tier.nextTier.missingVolumeNok} NOK more in the next 30 days to reach Tier ${tier.nextTier.tier}.`
      : "You’re at the highest tier right now.";

  return (
    <div className="creators-page">
      {/* HEADER */}
      <header className="creators-dashboard-header">
        <h1>Creator dashboard</h1>
        <p className="creators-subtext">
          Overview for{" "}
          <span className="creators-username-tag">
            {creatorDisplayName || "unknown creator"}
          </span>
          .
        </p>
        {!username && (
          <p className="creators-error-inline">
            Add <code>?username=&lt;your-username&gt;</code> to the URL to view
            a dashboard. Example:{" "}
            <code>/creators/dashboard?username=testcreator</code>
          </p>
        )}
      </header>

      {/* STATUS / ERRORS */}
      {loading && (
        <section className="card creators-status">
          <p>Loading dashboard data…</p>
        </section>
      )}

      {!loading && error && (
        <section className="card creators-status creators-status-error">
          <p>{error}</p>
          <p className="creators-small">
            Make sure your creator account is active and that the username in
            the URL matches your KunTips creator username.
          </p>
        </section>
      )}

      {!loading && !error && payload && (
        <>
          {/* STATS GRID */}
          <section className="card creators-dashboard-grid">
            <div className="creators-dashboard-tile">
              <h2>This month</h2>
              <p className="creators-dashboard-number">
                {stats?.thisMonthIntendedNok ?? 0} NOK
              </p>
              <p className="creators-dashboard-sub">
                Total tips this calendar month
              </p>
            </div>

            <div className="creators-dashboard-tile">
              <h2>Last 30 days</h2>
              <p className="creators-dashboard-number">
                {stats?.last30dIntendedNok ?? 0} NOK
              </p>
              <p className="creators-dashboard-sub">
                {stats?.last30dTipCount ?? 0} tip(s) in the last 30 days
              </p>
            </div>

            <div className="creators-dashboard-tile">
              <h2>All-time tips</h2>
              <p className="creators-dashboard-number">
                {stats?.lifetimeIntendedNok ?? 0} NOK
              </p>
              <p className="creators-dashboard-sub">
                {stats?.lifetimeTipCount ?? 0} total tip(s)
              </p>
            </div>
          </section>

          {/* TIER / FEE INFO */}
          <section className="card creators-dashboard-tier">
            <div className="creators-dashboard-tier-main">
              <h2>Your KunTips tier</h2>
              {tier ? (
                <>
                  <p className="creators-dashboard-number">
                    Tier {tier.currentTier}
                  </p>
                  <p className="creators-dashboard-sub">
                    You currently keep about {keptPercentLabel} of each tip
                    before Stripe’s own card processing fees.
                  </p>
                  <p className="creators-dashboard-sub">
                    Last 30 days volume: {tier.volume30dNok} NOK.
                  </p>
                  <p className="creators-dashboard-sub">{nextTierText}</p>
                </>
              ) : (
                <p className="creators-dashboard-sub">
                  Tier information is not available yet.
                </p>
              )}
            </div>
          </section>

          {/* RECENT TIPS TABLE */}
          <section className="card creators-dashboard-table-wrapper">
            <div className="creators-dashboard-table-header">
              <h2>Recent tips</h2>
              <p className="creators-dashboard-sub">
                Latest 20 tips for this creator.
              </p>
            </div>

            {recentTips.length === 0 ? (
              <p className="creators-dashboard-sub">
                No tips found yet. Once fans start tipping, you’ll see them
                listed here.
              </p>
            ) : (
              <div className="creators-dashboard-table-scroll">
                <table className="creators-dashboard-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Currency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTips.map((tip) => {
                      const date = tip.tippedAt
                        ? new Date(tip.tippedAt)
                        : null;
                      const dateLabel = date
                        ? date.toLocaleDateString("no-NO", {
                            year: "2-digit",
                            month: "2-digit",
                            day: "2-digit",
                          })
                        : "—";

                      return (
                        <tr key={tip.id}>
                          <td>{dateLabel}</td>
                          <td>{tip.tipAmountNok} NOK</td>
                          <td>
                            <span className={`status-pill status-${String(
                              tip.status || "",
                            ).toLowerCase()}`}>
                              {tip.status}
                            </span>
                          </td>
                          <td>{tip.currency}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <p className="creators-small">
              Payouts themselves are handled by Stripe. KunTips shows you
              aggregated stats here, while Stripe provides detailed payout
              reports for your accounting.
            </p>
          </section>
        </>
      )}

      <p className="creators-backlink">
        <Link to="/creators">← Back to creator information</Link>
      </p>
    </div>
  );
}

export default CreatorsDashboard;
