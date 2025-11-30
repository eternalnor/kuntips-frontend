// CreatorsDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  fetchCreatorDashboard,
  updateCreatorProfile,
  fetchJson,
} from "./api";

function useQuery() {
  const location = useLocation();
  return useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
}

function CreatorsDashboard() {
  const query = useQuery();
  const usernameQuery = (query.get("username") || "").trim();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payload, setPayload] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "profile"

  // Profile editing state
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [profileSaved, setProfileSaved] = useState(false);

  // Stripe manage-link state
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState(null);

  useEffect(() => {
    if (!usernameQuery) {
      setLoading(false);
      setError("No creator username provided in the URL.");
      setPayload(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setProfileSaved(false);

    fetchCreatorDashboard(usernameQuery)
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
  }, [usernameQuery]);

  // When payload changes, initialize the profile form fields
  useEffect(() => {
    if (!payload || !payload.creator) return;

    const c = payload.creator;
    setDisplayNameInput(c.displayName || c.username || "");
    setBioInput(c.bio || "");
    setProfileSaved(false);
    setProfileError(null);
  }, [payload]);

  const creatorUsername = payload?.creator?.username || usernameQuery;
  const creatorDisplayName =
    payload?.creator?.displayName || creatorUsername || "unknown creator";
  const creatorBio = payload?.creator?.bio || "";

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

  async function handleProfileSave(e) {
    e.preventDefault();
    if (!creatorUsername || profileSaving) return;

    setProfileSaving(true);
    setProfileError(null);
    setProfileSaved(false);

    try {
      await updateCreatorProfile(creatorUsername, {
        displayName: displayNameInput,
        bio: bioInput,
      });

      // Optimistic update of local payload so UI reflects changes immediately
      setPayload((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          creator: {
            ...prev.creator,
            displayName: displayNameInput,
            bio: bioInput,
          },
        };
      });

      setProfileSaved(true);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setProfileError(
        err.data?.message ||
          err.message ||
          "Could not save profile. Please try again.",
      );
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleManageStripeClick() {
    if (!creatorUsername || stripeLoading) return;

    setStripeLoading(true);
    setStripeError(null);

    try {
      const data = await fetchJson("/connect/create-account-link", {
        method: "POST",
        body: JSON.stringify({
          username: creatorUsername,
          // When Stripe sends them back, we want them on this dashboard again
          returnUrlPath: `/creators/dashboard?username=${encodeURIComponent(
            creatorUsername,
          )}`,
        }),
      });

      const redirectUrl = data.accountLinkUrl || data.url;
      if (!redirectUrl) {
        throw new Error("Backend did not return an account link URL.");
      }

      // Full page redirect into Stripe Connect
      window.location.href = redirectUrl;
    } catch (err) {
      console.error("Failed to create Stripe account link:", err);
      setStripeError(
        err.data?.message ||
          err.message ||
          "Could not open Stripe. Please try again.",
      );
      setStripeLoading(false);
    }
  }

  return (
    <div className="creators-page">
      {/* HEADER */}
      <header className="creators-dashboard-header">
        <h1>Creator dashboard</h1>
        <p className="creators-subtext">
          Overview for{" "}
          <span className="creators-username-tag">{creatorDisplayName}</span>.
        </p>
        {!usernameQuery && (
          <p className="creators-error-inline">
            Add <code>?username=&lt;your-username&gt;</code> to the URL to view
            a dashboard. Example:{" "}
            <code>/creators/dashboard?username=testcreator1</code>
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
          {/* TABS */}
          <div className="creators-tabs">
            <button
              type="button"
              className={
                activeTab === "overview"
                  ? "creators-tab-button is-active"
                  : "creators-tab-button"
              }
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              type="button"
              className={
                activeTab === "profile"
                  ? "creators-tab-button is-active"
                  : "creators-tab-button"
              }
              onClick={() => setActiveTab("profile")}
            >
              Profile &amp; settings
            </button>
          </div>

          {/* TAB CONTENT */}
          {activeTab === "overview" && (
            <>
              {/* STRIPE / PAYOUT STATUS */}
              <section className="card creators-stripe-card">
                <div className="creators-stripe-main">
                  <h2>Stripe payouts</h2>
                  <p className="creators-dashboard-sub">
                    KunTips uses Stripe to handle all payouts. You keep about{" "}
                    {keptPercentLabel || "95%"} of each tip; fans cover Stripe
                    fees and the KunTips platform fee.
                  </p>
                  <p className="creators-dashboard-sub">
                    Use this button to review or update your payout details
                    (bank account, tax info, etc.) directly in Stripe.
                  </p>
                </div>

                {stripeError && (
                  <p className="creators-error-inline creators-stripe-error">
                    {stripeError}
                  </p>
                )}

                <div className="creators-stripe-actions">
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={!creatorUsername || stripeLoading}
                    onClick={handleManageStripeClick}
                  >
                    {stripeLoading ? "Opening Stripe…" : "Manage Stripe account"}
                  </button>
                  <p className="creators-small creators-stripe-note">
                    This opens Stripe in a new session. When you’re done, come
                    back here to see your updated stats.
                  </p>
                </div>
              </section>

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
                        You currently keep {keptPercentLabel} of each tip.
                        Stripe only charges kr2.75 every time you choose to pay out.
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
                                <span
                                  className={`status-pill status-${String(
                                    tip.status || "",
                                  ).toLowerCase()}`}
                                >
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

          {activeTab === "profile" && (
            <section className="card creators-profile-card">
              <h2>Public profile</h2>
              <p className="creators-dashboard-sub">
                This is what fans see on your KunTips page (
                <code>/u/{creatorUsername}</code>).
              </p>

              <div className="creators-profile-header">
                <div className="creators-profile-avatar">
                  {creatorDisplayName.charAt(0).toUpperCase()}
                </div>
                <div className="creators-profile-text">
                  <div className="creators-profile-name">
                    {creatorDisplayName}
                  </div>
                  <div className="creators-profile-username">
                    @{creatorUsername}
                  </div>
                </div>
              </div>

              <form className="creators-profile-form" onSubmit={handleProfileSave}>
                <div className="creators-form-group">
                  <label className="creators-label" htmlFor="displayName">
                    Display name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    className="creators-input"
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                    maxLength={80}
                  />
                  <p className="creators-small">
                    Shown on your KunTips page and in dashboards.
                  </p>
                </div>

                <div className="creators-form-group">
                  <label className="creators-label" htmlFor="bio">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    className="creators-textarea"
                    rows={4}
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    maxLength={500}
                  />
                  <p className="creators-small">
                    A short description that helps fans understand who they are
                    tipping.
                  </p>
                </div>

                {profileError && (
                  <p className="creators-error-inline">{profileError}</p>
                )}
                {profileSaved && !profileError && (
                  <p className="creators-success-inline">
                    Profile saved. Your public page will reflect these changes
                    shortly.
                  </p>
                )}

                <div className="creators-profile-actions">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={profileSaving || !displayNameInput.trim()}
                  >
                    {profileSaving ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </form>

              <p className="creators-small creators-profile-note">
                Profile editing currently lets you change your display name and
                bio. Avatar and additional branding options will be added later.
              </p>
            </section>
          )}
        </>
      )}

      <p className="creators-backlink">
        <Link to="/creators">← Back to creator information</Link>
      </p>
    </div>
  );
}

export default CreatorsDashboard;
