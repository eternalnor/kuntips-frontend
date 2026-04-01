// CreatorsDashboard.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { usePageTitle } from "./hooks/usePageTitle.js";
import { containsBlockedContent } from "./utils/wordFilter.js";
import { isStrongPassword, PASSWORD_ERROR, PasswordChecklist } from "./utils/passwordUtils.jsx";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import {
  fetchCreatorDashboard,
  updateCreatorProfile,
  changePassword,
  logoutCreator,
  createStripeAccountLink,
  fetchPayoutPreview,
  requestPayout,
  fetchPayoutStatement,
  getSessionToken,
  resendVerificationEmail,
} from "./api";

// ── Countdown helper ────────────────────────────────────────────────────────
function computeTimeLeft(isoString) {
  if (!isoString) return null;
  const diff = new Date(isoString).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000)  /    60_000),
    seconds: Math.floor((diff %    60_000)  /     1_000),
  };
}

function useCountdown(isoString) {
  const [timeLeft, setTimeLeft] = useState(() => computeTimeLeft(isoString));
  const isoRef = useRef(isoString);
  isoRef.current = isoString;

  useEffect(() => {
    if (!isoString) { setTimeLeft(null); return; }
    setTimeLeft(computeTimeLeft(isoString));
    const id = setInterval(() => setTimeLeft(computeTimeLeft(isoRef.current)), 1000);
    return () => clearInterval(id);
  }, [isoString]);

  return timeLeft;
}

// ── Chart helpers ────────────────────────────────────────────────────────────
const MILESTONES_DEF = [
  { key: "firstTip",  icon: "🎯", label: "First tip",      desc: "Received your first tip" },
  { key: "nok1k",     icon: "💫", label: "1,000 NOK",      desc: "1,000 NOK earned lifetime" },
  { key: "nok5k",     icon: "⭐", label: "5,000 NOK",      desc: "5,000 NOK earned lifetime" },
  { key: "nok10k",    icon: "🌟", label: "10,000 NOK",     desc: "10,000 NOK earned lifetime" },
  { key: "nok50k",    icon: "💎", label: "50,000 NOK",     desc: "50,000 NOK earned lifetime" },
  { key: "nok100k",   icon: "👑", label: "100,000 NOK",    desc: "100,000 NOK earned lifetime" },
];

function fmtChartDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-date">{fmtChartDate(label)}</p>
      <p className="chart-tooltip-value">{payload[0].value} NOK</p>
    </div>
  );
}

function useQuery() {
  const location = useLocation();
  return useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
}

function CreatorsDashboard() {
  usePageTitle('Dashboard');
  const query = useQuery();
  const usernameQuery = (query.get("username") || "").trim();
  const navigate = useNavigate();


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payload, setPayload] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "profile" | "payouts"
  const [tipLinkCopied, setTipLinkCopied] = useState(false);
  const [referralLinkCopied, setReferralLinkCopied] = useState(false);

  // Profile editing state
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [profileSaved, setProfileSaved] = useState(false);

  // Password  stuff

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securitySaving, setSecuritySaving] = useState(false);
  const [securityError, setSecurityError] = useState(null);
  const [securitySuccess, setSecuritySuccess] = useState("");


  // Stripe manage-link state
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState(null);

  // Payout state
  const [payoutPreview, setPayoutPreview] = useState(null);
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutError, setPayoutError] = useState(null);
  const [payoutRequesting, setPayoutRequesting] = useState(false);
  const [payoutRequestSuccess, setPayoutRequestSuccess] = useState(null);
  const [payoutRequestError, setPayoutRequestError] = useState(null);

  // Payout statement state (expanded row)
  const [expandedPayoutId, setExpandedPayoutId] = useState(null);
  const [statementData, setStatementData] = useState({}); // { [payoutId]: statement | "loading" | "error" }

  // Email verification resend state
  const [resendingVerification, setResendingVerification] = useState(false);
  const [resendVerificationMsg, setResendVerificationMsg] = useState(null);

  useEffect(() => {
    if (!usernameQuery) {
      setLoading(false);
      setError("No creator username provided in the URL.");
      setPayload(null);
      return;
    }

    // Require a session token on the frontend
    const sessionToken = getSessionToken();

    if (!sessionToken) {
      setLoading(false);
      setError(
        "You need to log in to view your creator dashboard. Please go to the Creator login page and sign in with your email and password.",
      );
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
  const payoutHistory = payload?.payoutHistory || [];
  const charts = payload?.charts ?? null;
  const insights = payload?.insights ?? null;
  const percentileRank = payload?.percentileRank ?? null;
  const milestones = payload?.milestones ?? {};

  const status = payload?.status;
  const isActive = status?.isActive ?? true;
  const referralBoostTiers = tier?.referralBoostTiers ?? 0;
  const joinBoostTiers = tier?.joinBoostTiers ?? 0;
  const temporaryBoostTiers = tier?.temporaryBoostTiers ?? 0;
  const globalEventBoostTiers = tier?.globalEventBoostTiers ?? 0;
  const globalEvent = tier?.globalEvent ?? null;          // { label, expiresAt } | null
  const totalReferralsLast365d = tier?.totalReferralsLast365d ?? 0;

  const keptPercentLabel = tier
    ? `${Math.round(tier.keptPercent * 10) / 10}%`
    : null;

  const nextTierNumber = tier && tier.nextTier
    ? Math.min(tier.currentTier + 1, 6)
    : null;

  // Live countdown for the platform event (updated every second)
  const eventCountdown = useCountdown(globalEvent?.expiresAt ?? null);
  const isEasterEvent = /easter|påske/i.test(globalEvent?.label ?? "");

  const nextTierText =
    tier && tier.nextTier && nextTierNumber
      ? `Tip ${tier.nextTier.missingVolumeNok} NOK more in the next 30 days to reach Tier ${nextTierNumber}.`
      : null;


  // Build referral URL
  const referralLink =
    creatorUsername && typeof window !== "undefined"
      ? `${window.location.origin}/creators/register?ref=${creatorUsername}`
      : creatorUsername
      ? `/creators/register?ref=${creatorUsername}`
      : "";

  // Build public tip page URL
  const tipPageUrl =
    creatorUsername && typeof window !== "undefined"
      ? `${window.location.origin}/${creatorUsername}`
      : `/${creatorUsername}`;

  const stripeConnected = status?.stripeConnected ?? false;
  const canReceiveTips =
    status?.canReceiveTips ?? (isActive && stripeConnected);

  const stripeButtonLabel = stripeLoading
    ? "Opening Stripe…"
    : stripeConnected
    ? "Manage Stripe account"
    : "Connect Stripe payouts";

  async function handleProfileSave(e) {
    e.preventDefault();
    if (!creatorUsername || profileSaving) return;

    if (containsBlockedContent(bioInput)) {
      setProfileError("Your bio contains content that isn't allowed. Please revise it.");
      return;
    }

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
    const returnUrlPath = `/creators/dashboard?username=${encodeURIComponent(
      creatorUsername,
    )}`;

    const data = await createStripeAccountLink(returnUrlPath);

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
  } finally {
    setStripeLoading(false);
  }
}


    async function handlePasswordChange(e) {
    e.preventDefault();

    setSecurityError(null);
    setSecuritySuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setSecurityError("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityError("New password and confirmation do not match.");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setSecurityError(PASSWORD_ERROR);
      return;
    }

    setSecuritySaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSecuritySuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Failed to change password:", err);
      setSecurityError(
        err.data?.message ||
          err.message ||
          "Could not update password. Please try again.",
      );
    } finally {
      setSecuritySaving(false);
    }
  }

  function handleLogoutClick() {
    logoutCreator();
    navigate("/creators");
  }

  async function handleCopyTipLink() {
    if (!tipPageUrl) return;
    try {
      await navigator.clipboard.writeText(tipPageUrl);
      setTipLinkCopied(true);
      setTimeout(() => setTipLinkCopied(false), 2000);
    } catch {
      // Fallback: select the input
    }
  }

  async function handleCopyReferralLink() {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setReferralLinkCopied(true);
      setTimeout(() => setReferralLinkCopied(false), 2000);
    } catch {
      // Fallback: select the input
    }
  }

  useEffect(() => {
    if (!creatorUsername || !payload) return;

    let cancelled = false;
    setPayoutLoading(true);
    setPayoutError(null);

    fetchPayoutPreview(creatorUsername)
      .then((data) => {
        if (cancelled) return;
        setPayoutPreview(data);
        setPayoutLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setPayoutError(err.data?.message || err.message || "Could not load payout info.");
        setPayoutLoading(false);
      });

    return () => { cancelled = true; };
  }, [creatorUsername, payload]);

  async function handleViewStatement(payoutId) {
    if (expandedPayoutId === payoutId) {
      setExpandedPayoutId(null);
      return;
    }
    setExpandedPayoutId(payoutId);
    if (statementData[payoutId]) return; // already loaded
    setStatementData((prev) => ({ ...prev, [payoutId]: "loading" }));
    try {
      const data = await fetchPayoutStatement(creatorUsername, payoutId);
      setStatementData((prev) => ({ ...prev, [payoutId]: data }));
    } catch {
      setStatementData((prev) => ({ ...prev, [payoutId]: "error" }));
    }
  }

  async function handleRequestPayout() {
    if (!creatorUsername || payoutRequesting) return;

    setPayoutRequesting(true);
    setPayoutRequestError(null);
    setPayoutRequestSuccess(null);

    try {
      await requestPayout(creatorUsername);
      setPayoutRequestSuccess("Payout requested successfully. It will be processed by Stripe shortly.");
      fetchPayoutPreview(creatorUsername)
        .then(setPayoutPreview)
        .catch(() => {
          setPayoutError("Preview could not refresh automatically — your payout was still requested. Reload the page to see updated figures.");
        });
    } catch (err) {
      setPayoutRequestError(err.data?.message || err.message || "Could not request payout. Please try again.");
    } finally {
      setPayoutRequesting(false);
    }
  }

  async function handleResendVerification() {
    if (resendingVerification) return;
    setResendingVerification(true);
    setResendVerificationMsg(null);
    try {
      await resendVerificationEmail();
      setResendVerificationMsg("Verification email sent — check your inbox.");
    } catch (err) {
      setResendVerificationMsg(
        err.data?.message || err.message || "Could not send verification email."
      );
    } finally {
      setResendingVerification(false);
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

      {/* EMAIL VERIFICATION BANNER */}
      {payload && !payload.creator.emailVerified && (
        <section className="card creators-status creators-status-warning">
          <p>
            <strong>Please verify your email address</strong> — check your inbox
            for a verification link from KunTips.
          </p>
          <p className="creators-small">
            You need a verified email before you can connect Stripe and receive
            payouts.
          </p>
          {resendVerificationMsg ? (
            <p className="creators-small">{resendVerificationMsg}</p>
          ) : (
            <button
              className="btn btn-secondary"
              style={{ marginTop: "0.5rem" }}
              onClick={handleResendVerification}
              disabled={resendingVerification}
            >
              {resendingVerification ? "Sending…" : "Resend verification email"}
            </button>
          )}
        </section>
      )}

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
            If you believe this is a mistake, make sure you’re logged in with
            the correct creator email and that the username in the URL matches
            your KunTips creator username.
          </p>
        </section>
      )}


      {/* PLATFORM EVENT BANNER */}
      {!loading && !error && payload && globalEventBoostTiers > 0 && globalEvent && (
        <div className={`event-banner${isEasterEvent ? " event-banner--easter" : ""}`}>
          <div className="event-banner-shimmer" />
          {isEasterEvent && (
            <div className="event-banner-eggs">
              <span className="event-banner-egg">🥚</span>
              <span className="event-banner-egg">🐣</span>
              <span className="event-banner-egg">🥚</span>
              <span className="event-banner-egg">🐰</span>
              <span className="event-banner-egg">🥚</span>
              <span className="event-banner-egg">🌸</span>
            </div>
          )}
          <div className="event-banner-inner">
            <span className="event-banner-icon">
              {isEasterEvent ? "🐣" : "🎉"}
            </span>
            <div className="event-banner-text">
              <p className="event-banner-title">
                {globalEvent.label
                  ? globalEvent.label
                  : "Platform Bonus Active!"}
              </p>
              <p className="event-banner-subtitle">
                All creators receive{" "}
                <strong>
                  +{globalEventBoostTiers} tier
                  {globalEventBoostTiers > 1 ? "s" : ""}
                </strong>{" "}
                for the duration of this event.
              </p>
            </div>
            {eventCountdown ? (
              <div className="event-countdown">
                {eventCountdown.days > 0 && (
                  <div className="event-countdown-block">
                    <span className="event-countdown-number">{eventCountdown.days}</span>
                    <span className="event-countdown-label">day{eventCountdown.days !== 1 ? "s" : ""}</span>
                  </div>
                )}
                <div className="event-countdown-block">
                  <span className="event-countdown-number">
                    {String(eventCountdown.hours).padStart(2, "0")}
                  </span>
                  <span className="event-countdown-label">hr</span>
                </div>
                <div className="event-countdown-block">
                  <span className="event-countdown-number">
                    {String(eventCountdown.minutes).padStart(2, "0")}
                  </span>
                  <span className="event-countdown-label">min</span>
                </div>
                <div className="event-countdown-block">
                  <span className="event-countdown-number">
                    {String(eventCountdown.seconds).padStart(2, "0")}
                  </span>
                  <span className="event-countdown-label">sec</span>
                </div>
              </div>
            ) : (
              <p className="event-banner-subtitle" style={{ fontStyle: "italic" }}>
                Ending soon…
              </p>
            )}
          </div>
        </div>
      )}

      {!loading && !error && payload && (
          <>
          {/* TABS */}
          <div className="creators-tabs">
            <button
                type="button"
                className={activeTab === "overview" ? "creators-tab-button is-active" : "creators-tab-button"}
                onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
                type="button"
                className={activeTab === "profile" ? "creators-tab-button is-active" : "creators-tab-button"}
                onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
            <button
                type="button"
                className={activeTab === "payouts" ? "creators-tab-button is-active" : "creators-tab-button"}
                onClick={() => setActiveTab("payouts")}
            >
              Payouts
            </button>
          </div>

          {/* TAB CONTENT */}
          <div key={activeTab} className="creators-tab-content fade-soft">
            {activeTab === "overview" && (
                <>
                  {/* STRIPE STATUS PILL */}
                  <section className="card creators-stripe-status-bar">
                    {stripeConnected ? (
                      <div className="stripe-status-row">
                        <span className="stripe-status-pill stripe-status-connected">
                          ● Stripe connected
                        </span>
                        <span className="creators-small">
                          Your payout account is active. Manage it in the{" "}
                          <button
                            type="button"
                            className="creators-tab-link"
                            onClick={() => setActiveTab("payouts")}
                          >
                            Payouts tab
                          </button>.
                        </span>
                      </div>
                    ) : (
                      <div className="stripe-status-row">
                        <span className="stripe-status-pill stripe-status-disconnected">
                          ⚠ Stripe not connected
                        </span>
                        <span className="creators-small">
                          You need to connect Stripe before you can receive tips. Go to the{" "}
                          <button
                            type="button"
                            className="creators-tab-link"
                            onClick={() => setActiveTab("payouts")}
                          >
                            Payouts tab
                          </button>{" "}
                          to set it up.
                        </span>
                      </div>
                    )}
                  </section>

                  {/* TIP LINK CARD */}
                  <section className="card creators-tiplink-card">
                    <h2>Your tip link</h2>
                    <p className="creators-dashboard-sub">
                      Share this link with your fans so they can send you tips — they stay private by default, or can optionally leave their name.
                    </p>
                    <div className="creators-tiplink-row">
                      <input
                        type="text"
                        className="creators-tiplink-input"
                        value={tipPageUrl}
                        readOnly
                        onFocus={(e) => e.target.select()}
                      />
                      <button
                        type="button"
                        className={`btn ${tipLinkCopied ? "btn-success" : "btn-primary"} creators-tiplink-copy`}
                        onClick={handleCopyTipLink}
                      >
                        {tipLinkCopied ? "Copied!" : "Copy link"}
                      </button>
                    </div>
                    <a
                      href={`/${creatorUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="creators-small creators-tiplink-preview"
                    >
                      Preview your page →
                    </a>
                  </section>

                  {/* STATS GRID */}
                  <section className="card creators-dashboard-grid">
                    <div className="creators-dashboard-tile">
                      <h2>Awaiting payout</h2>
                      <p className="creators-dashboard-number">
                        {payoutPreview
                          ? `${Math.round(payoutPreview.eligible_creator_net_minor / 100)} NOK`
                          : "—"}
                      </p>
                      <p className="creators-dashboard-sub">
                        {payoutPreview
                          ? `${payoutPreview.pending_tip_count} tip(s) in 7‑day hold`
                          : payoutLoading ? "Loading…" : "—"}
                      </p>
                    </div>

                    <div className="creators-dashboard-tile">
                      <h2>Last 30 days</h2>
                      <p className="creators-dashboard-number">
                        {stats?.last30dNetNok ?? 0} NOK
                      </p>
                      <p className="creators-dashboard-sub">
                        {stats?.last30dTipCount ?? 0} tip(s) in the last 30 days
                      </p>
                    </div>

                    <div className="creators-dashboard-tile">
                      <h2>All-time earnings</h2>
                      <p className="creators-dashboard-number">
                        {stats?.lifetimeNetNok ?? 0} NOK
                      </p>
                      <p className="creators-dashboard-sub">
                        {stats?.lifetimeTipCount ?? 0} total tip(s)
                      </p>
                    </div>
                  </section>

                  {/* EARNINGS CHART */}
                  {charts && (
                    <section className="card creators-chart-card">
                      <div className="creators-chart-header">
                        <div>
                          <h2>Last 30 days</h2>
                          {charts.daily.length > 0 && (
                            <p className="creators-small">
                              {fmtChartDate(charts.daily[0].date)} – {fmtChartDate(charts.daily[charts.daily.length - 1].date)}
                            </p>
                          )}
                        </div>
                        <div className="creators-chart-meta">
                          {percentileRank !== null && (
                            <span className="chart-percentile-badge">
                              Top {percentileRank}% of creators
                            </span>
                          )}
                          {charts.changePercent !== null && (
                            <span className={`chart-change-badge ${charts.changePercent >= 0 ? "chart-change-up" : "chart-change-down"}`}>
                              {charts.changePercent >= 0 ? "↑" : "↘"} {Math.abs(charts.changePercent)}% vs prev. 30 days
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="creators-chart-wrap">
                        <ResponsiveContainer width="100%" height={200}>
                          <AreaChart data={charts.daily} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                            <defs>
                              <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="#38bdf8" stopOpacity={0.28} />
                                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} />
                            <XAxis
                              dataKey="date"
                              tickFormatter={fmtChartDate}
                              tick={{ fill: "rgba(148,163,184,0.7)", fontSize: 11 }}
                              tickLine={false}
                              axisLine={false}
                              interval={6}
                            />
                            <YAxis
                              tick={{ fill: "rgba(148,163,184,0.7)", fontSize: 11 }}
                              tickLine={false}
                              axisLine={false}
                              tickFormatter={v => v === 0 ? "" : `${v}`}
                            />
                            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(56,189,248,0.25)", strokeWidth: 1 }} />
                            <Area
                              type="monotone"
                              dataKey="amountNok"
                              stroke="#38bdf8"
                              strokeWidth={2}
                              fill="url(#earningsGrad)"
                              dot={false}
                              activeDot={{ r: 4, fill: "#38bdf8", strokeWidth: 0 }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      {/* INSIGHTS BAR */}
                      {insights && (
                        <div className="creators-insights-bar">
                          {insights.streakDays > 0 && (
                            <span className="insight-chip">
                              🔥 {insights.streakDays}-day streak
                            </span>
                          )}
                          {insights.projectedMonthNok !== null && (
                            <span className="insight-chip">
                              📈 On pace for ~{insights.projectedMonthNok.toLocaleString()} NOK this month
                            </span>
                          )}
                          {insights.bestDayNok > 0 && (
                            <span className="insight-chip">
                              🏆 Best day: {insights.bestDayNok.toLocaleString()} NOK
                            </span>
                          )}
                          {insights.bestMonthNok > 0 && insights.bestMonthLabel && (
                            <span className="insight-chip">
                              📅 Best month: {insights.bestMonthNok.toLocaleString()} NOK ({insights.bestMonthLabel})
                            </span>
                          )}
                        </div>
                      )}

                      {/* MILESTONE BADGES */}
                      <div className="creators-milestones">
                        {MILESTONES_DEF.map(m => (
                          <div
                            key={m.key}
                            className={`milestone-badge ${milestones[m.key] ? "milestone-unlocked" : "milestone-locked"}`}
                            title={`${m.label} — ${m.desc}`}
                          >
                            <span className="milestone-icon">{m.icon}</span>
                            <span className="milestone-label">{m.label}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* TIER / FEE INFO */}
                  <section className={`card creators-dashboard-tier${globalEventBoostTiers > 0 ? " tier-card-event" : ""}${globalEventBoostTiers > 0 && isEasterEvent ? " tier-card-event--easter" : ""}`}>
                    <div className="creators-dashboard-tier-main">
                      <h2>Your KunTips tier</h2>
                      {tier ? (
                          <>
                            {globalEventBoostTiers > 0 ? (
                              <div className="tier-display-event">
                                <div className="tier-display-event-number">
                                  <span className="tier-event-word">Tier</span>
                                  <span className="tier-event-digit">{tier.currentTier}</span>
                                </div>
                                <span className="tier-event-badge">
                                  ✦ EVENT BOOST ACTIVE ✦
                                </span>
                                {tier.baseTier !== tier.currentTier && (
                                  <p className="tier-event-note">
                                    Boosted from Tier {tier.baseTier} — you keep{" "}
                                    <strong>{keptPercentLabel}</strong> of every tip
                                    during this event.
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="creators-dashboard-number">
                                Tier {tier.currentTier}
                              </p>
                            )}
                            <p className="creators-dashboard-sub">
                              You currently keep {keptPercentLabel} of each tip. Fans
                              cover payment fees. Stripe only charges a small fixed
                              payout fee (2.75 NOK) each time you transfer your
                              balance to your bank.
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
                              <th>You receive</th>
                              <th>From</th>
                              <th>Status</th>
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
                                    <td>{tip.netAmountNok} NOK</td>
                                    <td className="tip-from-cell">
                                      {tip.tipperName
                                        ? <span className="tip-from-name">{tip.tipperName}</span>
                                        : <span className="tip-from-anon">Anonymous</span>}
                                    </td>
                                    <td>
                                      <span className={`status-pill status-${String(tip.status || "").toLowerCase()}`}>
                                        {tip.status}
                                      </span>
                                    </td>
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
                <>
                  {/* PUBLIC PROFILE */}
                  <section className="card creators-profile-card">
                    <h2>Public profile</h2>
                    <p className="creators-dashboard-sub">
                      This is what fans see on your KunTips page (
                      <code>kuntips.no/{creatorUsername}</code>).
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
                      <div className="form-field creators-form-group">
                        <label className="creators-label" htmlFor="displayName">
                          Display name
                        </label>
                        <input
                            id="displayName"
                            type="text"
                            className="form-input creators-input"
                            value={displayNameInput}
                            onChange={(e) => setDisplayNameInput(e.target.value)}
                            maxLength={80}
                        />
                        <p className="creators-small">
                          Shown on your KunTips page and in dashboards.
                        </p>
                      </div>

                      <div className="form-field creators-form-group">
                        <label className="creators-label" htmlFor="bio">
                          Bio
                        </label>
                        <textarea
                            id="bio"
                            className="form-textarea creators-textarea"
                            rows={3}
                            value={bioInput}
                            onChange={(e) => setBioInput(e.target.value.slice(0, 160))}
                            maxLength={160}
                        />
                        <p className="creators-small" style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>A short description shown on your tip page.</span>
                          <span style={{ color: bioInput.length >= 150 ? "#f87171" : "inherit" }}>
                            {bioInput.length}/160
                          </span>
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
                            className="btn btn-primary"
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

                  {/* REFERRAL PROGRAM */}
                  <section className="card creators-dashboard-tier">
                    <div className="creators-dashboard-tier-main">
                      <h2>Referral program</h2>

                      {creatorUsername ? (
                          <>
                            <p className="creators-dashboard-sub">
                              Share this link with other creators. When they sign up and start
                              receiving tips, you get a permanent referral bonus on your tier
                              (up to Tier 6).
                            </p>

                            {referralLink && (
                                <div className="creators-referral-link-block">
                                  <div className="creators-tiplink-row">
                                    <input
                                        id="referral-link"
                                        type="text"
                                        value={referralLink}
                                        readOnly
                                        onFocus={(e) => e.target.select()}
                                        className="creators-tiplink-input"
                                    />
                                    <button
                                        type="button"
                                        className={`btn ${referralLinkCopied ? "btn-success" : "btn-primary"} creators-tiplink-copy`}
                                        onClick={handleCopyReferralLink}
                                    >
                                      {referralLinkCopied ? "Copied!" : "Copy link"}
                                    </button>
                                  </div>
                                  <p className="creators-small">
                                    New creators who register through it will count towards your referral boosts.
                                  </p>
                                </div>
                            )}

                            <p className="creators-dashboard-sub">
                              Creators referred in the last 365 days:{" "}
                              <strong>{totalReferralsLast365d}</strong>
                            </p>

                            {referralBoostTiers > 0 && (
                                <p className="creators-dashboard-sub">
                                  Referral boost:{" "}
                                  <strong>+{referralBoostTiers} tier{referralBoostTiers > 1 ? "s" : ""}</strong>{" "}
                                  applied to your effective tier right now.
                                </p>
                            )}
                            {joinBoostTiers > 0 && (
                                <p className="creators-dashboard-sub">
                                  Join boost:{" "}
                                  <strong>+{joinBoostTiers} tier{joinBoostTiers > 1 ? "s" : ""}</strong>{" "}
                                  because you recently joined KunTips. Temporary, stacked on top of your base tier.
                                </p>
                            )}
                            {temporaryBoostTiers > 0 && (
                                <p className="creators-dashboard-sub">
                                  Temporary promo boost:{" "}
                                  <strong>+{temporaryBoostTiers} tier{temporaryBoostTiers > 1 ? "s" : ""}</strong>{" "}
                                  currently active.
                                </p>
                            )}
                            {globalEventBoostTiers > 0 && (
                                <p className="creators-dashboard-sub">
                                  🎉 Platform event boost:{" "}
                                  <strong>+{globalEventBoostTiers} tier{globalEventBoostTiers > 1 ? "s" : ""}</strong>{" "}
                                  — a special KunTips promotion is active for all creators right now!
                                </p>
                            )}
                            {referralBoostTiers === 0 && joinBoostTiers === 0 &&
                             temporaryBoostTiers === 0 && globalEventBoostTiers === 0 && (
                                <p className="creators-dashboard-sub">
                                  You don't have any extra boosts yet. Once you reach 10 referred
                                  creators in a 12-month period, you get +1 tier. At 35, +2 tiers;
                                  and 100 gives +3 tiers – always capped at Tier 6.
                                </p>
                            )}
                          </>
                      ) : (
                          <p className="creators-dashboard-sub">
                            Referral details will appear here when your username is available.
                          </p>
                      )}
                    </div>
                  </section>

                  {/* SECURITY */}
                  <section className="card creators-security-card">
                    <h2>Account security</h2>
                    <p className="creators-dashboard-sub">
                      Change your password and log out of this browser.
                    </p>

                    <form
                        className="creators-profile-form creators-security-form"
                        onSubmit={handlePasswordChange}
                    >
                      <div className="form-field creators-form-group">
                        <label className="creators-label" htmlFor="currentPassword">
                          Current password
                        </label>
                        <input
                            id="currentPassword"
                            type="password"
                            className="form-input creators-input"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>

                      <div className="form-field creators-form-group">
                        <label className="creators-label" htmlFor="newPassword">
                          New password
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            className="form-input creators-input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <PasswordChecklist password={newPassword} />
                      </div>

                      <div className="form-field creators-form-group">
                        <label className="creators-label" htmlFor="confirmPassword">
                          Confirm new password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className="form-input creators-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>

                      {securityError && (
                          <p className="creators-error-inline">{securityError}</p>
                      )}
                      {securitySuccess && !securityError && (
                          <p className="creators-success-inline">{securitySuccess}</p>
                      )}

                      <div className="creators-profile-actions creators-security-actions">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={securitySaving}
                        >
                          {securitySaving ? "Updating…" : "Update password"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleLogoutClick}
                        >
                          Log out of this browser
                        </button>
                      </div>
                    </form>
                  </section>
                </>
            )}

            {activeTab === "payouts" && (
                <>
                {/* STRIPE CONNECTION */}
                <section className="card creators-stripe-card">
                  <div className="creators-stripe-main">
                    <h2>Stripe payouts</h2>
                    {stripeConnected ? (
                        <>
                          <p className="creators-dashboard-sub">
                            Your Stripe account is connected. KunTips uses Stripe to
                            handle all payouts. You keep{" "}
                            {keptPercentLabel || "95%"} of each tip; fans cover
                            Stripe fees and the KunTips platform fee.
                          </p>
                          <p className="creators-dashboard-sub">
                            Use this button to review or update your payout details
                            (bank account, tax info, etc.) directly in Stripe.
                          </p>
                        </>
                    ) : (
                        <>
                          <p className="creators-dashboard-sub">
                            Stripe payouts are not connected yet. You need a Stripe
                            account to receive tips from fans.
                          </p>
                          <p className="creators-dashboard-sub">
                            Click the button below to create or connect a Stripe
                            account. Once finished, you&apos;ll be redirected back here.
                          </p>
                        </>
                    )}
                  </div>

                  {stripeError && (
                      <p className="creators-error-inline creators-stripe-error">
                        {stripeError}
                      </p>
                  )}

                  <div className="creators-stripe-actions">
                    <button
                        type="button"
                        className="btn btn-primary"
                        disabled={!creatorUsername || stripeLoading}
                        onClick={handleManageStripeClick}
                    >
                      {stripeButtonLabel}
                    </button>
                    <p className="creators-small creators-stripe-note">
                      This opens Stripe in a new session. When you&apos;re done,
                      come back here to see your updated stats and tip readiness.
                    </p>
                  </div>
                </section>

                {/* PAYOUT PREVIEW */}
                <section className="card creators-payouts-card">
                  <h2>Payout balance</h2>
                  <p className="creators-dashboard-sub">
                    Tips are held for 7 days before becoming eligible for payout.
                    When you request a payout, eligible tips are sent to your connected Stripe account.
                  </p>

                  {payoutLoading && (
                    <p className="creators-dashboard-sub">Loading payout info…</p>
                  )}

                  {payoutError && (
                    <p className="creators-error-inline">{payoutError}</p>
                  )}

                  {!payoutLoading && payoutPreview && (
                    <>
                      <div className="creators-dashboard-grid">
                        <div className="creators-dashboard-tile">
                          <h2>Ready to pay out</h2>
                          <p className="creators-dashboard-number">
                            {(payoutPreview.eligible_creator_net_minor / 100).toFixed(2)} NOK
                          </p>
                          <p className="creators-dashboard-sub">
                            {payoutPreview.eligible_tip_count} tip(s) eligible
                          </p>
                        </div>
                        <div className="creators-dashboard-tile">
                          <h2>Pending</h2>
                          <p className="creators-dashboard-number">
                            {payoutPreview.pending_tip_count}
                          </p>
                          <p className="creators-dashboard-sub">
                            {payoutPreview.pending_tip_count === 1 ? "tip" : "tips"} in 7-day hold
                          </p>
                        </div>
                      </div>

                      {payoutPreview.pending_tip_count > 0 && payoutPreview.next_tip_becomes_eligible_at && (
                        <p className="creators-dashboard-sub">
                          Next pending tip clears on{" "}
                          {new Date(payoutPreview.next_tip_becomes_eligible_at).toLocaleDateString("no-NO")}.
                        </p>
                      )}

                      {payoutPreview.creator_debt_minor > 0 && (
                        <p className="creators-dashboard-sub">
                          Note: you have an outstanding platform fee balance of{" "}
                          <strong>{(payoutPreview.creator_debt_minor / 100).toFixed(2)} NOK</strong>{" "}
                          that will be deducted from your next payout.
                        </p>
                      )}

                      {payoutRequestSuccess && (
                        <p className="creators-success-inline">{payoutRequestSuccess}</p>
                      )}
                      {payoutRequestError && (
                        <p className="creators-error-inline">{payoutRequestError}</p>
                      )}

                      <div className="creators-profile-actions">
                        <button
                          type="button"
                          className="btn btn-primary"
                          disabled={!payoutPreview.eligible || payoutRequesting}
                          onClick={handleRequestPayout}
                        >
                          {payoutRequesting ? "Requesting…" : "Request payout"}
                        </button>
                      </div>

                      {!payoutPreview.eligible && payoutPreview.eligible_tip_count === 0 && (
                        <p className="creators-small">
                          No eligible tips yet. Tips become eligible 7 days after the fan&apos;s payment clears.
                        </p>
                      )}
                    </>
                  )}
                </section>

                {/* PAYOUT HISTORY */}
                {payoutHistory.length > 0 && (
                  <section className="card creators-payouts-card">
                    <h2>Payout history</h2>
                    <p className="creators-dashboard-sub">
                      Your last {payoutHistory.length} payout{payoutHistory.length !== 1 ? "s" : ""}.
                      Click a row to see the itemised tip breakdown.
                    </p>
                    <div className="payout-history-list">
                      {payoutHistory.map((p) => {
                        const isExpanded = expandedPayoutId === p.id;
                        const stmt = statementData[p.id];
                        const statusLabel =
                          p.status === "paid" ? "✅ Paid"
                          : p.status === "processing" ? "⏳ Processing"
                          : p.status === "failed" ? "❌ Failed"
                          : p.status === "cancelled" ? "— Cancelled"
                          : p.status;

                        return (
                          <div key={p.id} className="payout-history-row">
                            <button
                              type="button"
                              className="payout-history-summary"
                              onClick={() => handleViewStatement(p.id)}
                              aria-expanded={isExpanded}
                            >
                              <span className="payout-history-ref">{p.reference}</span>
                              <span className="payout-history-date">
                                {new Date(p.requestedAt).toLocaleDateString("nb-NO")}
                              </span>
                              <span className="payout-history-amount">
                                {p.payoutAmountNok.toLocaleString("nb-NO")} NOK
                              </span>
                              <span className="payout-history-status">{statusLabel}</span>
                              <span className="payout-history-chevron">{isExpanded ? "▲" : "▼"}</span>
                            </button>

                            {isExpanded && (
                              <div className="payout-history-detail">
                                {stmt === "loading" && (
                                  <p className="creators-dashboard-sub">Loading statement…</p>
                                )}
                                {stmt === "error" && (
                                  <p className="creators-error-inline">Could not load statement.</p>
                                )}
                                {stmt && stmt !== "loading" && stmt !== "error" && (
                                  <>
                                    <div className="payout-statement-meta">
                                      <span>Reference: <strong>{stmt.reference}</strong></span>
                                      {stmt.stripePayoutId && (
                                        <span className="payout-statement-stripe-id">
                                          Stripe ID: {stmt.stripePayoutId}
                                        </span>
                                      )}
                                      {p.debtAppliedNok > 0 && (
                                        <span className="payout-statement-debt">
                                          Debt deducted: −{p.debtAppliedNok} NOK
                                        </span>
                                      )}
                                    </div>
                                    {stmt.items.length === 0 ? (
                                      <p className="creators-dashboard-sub">No tips in this payout.</p>
                                    ) : (
                                      <table className="payout-statement-table">
                                        <thead>
                                          <tr>
                                            <th>Date</th>
                                            <th>From</th>
                                            <th>Tip</th>
                                            <th>Platform fee</th>
                                            <th>You received</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {stmt.items.map((item) => (
                                            <tr key={item.tipId}>
                                              <td>{new Date(item.tippedAt).toLocaleDateString("nb-NO")}</td>
                                              <td>{item.tipperName || <em>Anonymous</em>}</td>
                                              <td>{item.tipAmountNok} NOK</td>
                                              <td>{item.platformFeeNok} NOK</td>
                                              <td><strong>{item.creatorNetNok} NOK</strong></td>
                                            </tr>
                                          ))}
                                        </tbody>
                                        <tfoot>
                                          <tr>
                                            <td colSpan="4"><strong>Total paid out</strong></td>
                                            <td><strong>{p.payoutAmountNok.toLocaleString("nb-NO")} NOK</strong></td>
                                          </tr>
                                        </tfoot>
                                      </table>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}
                </>
            )}
          </div>


          </>
          )}

          <p className="creators-backlink">
            <Link to="/creators">← Back to creator information</Link>
          </p>
          </div>
      );
      }

      export default CreatorsDashboard;
