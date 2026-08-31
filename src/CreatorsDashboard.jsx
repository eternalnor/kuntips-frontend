// CreatorsDashboard.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { usePageTitle } from "./hooks/usePageTitle.js";
import { DASH } from "./dashStrings.js";
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
  { key: "firstTip",  icon: "🎯", label: "Første tips",    desc: "Du har fått ditt første tips" },
  { key: "nok1k",     icon: "💫", label: "1 000 kr",      desc: "1 000 kr tjent totalt" },
  { key: "nok5k",     icon: "⭐", label: "5 000 kr",      desc: "5 000 kr tjent totalt" },
  { key: "nok10k",    icon: "🌟", label: "10 000 kr",     desc: "10 000 kr tjent totalt" },
  { key: "nok50k",    icon: "💎", label: "50 000 kr",     desc: "50 000 kr tjent totalt" },
  { key: "nok100k",   icon: "👑", label: "100 000 kr",    desc: "100 000 kr tjent totalt" },
];

function fmtChartDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
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
  usePageTitle('Oversikt');
  const query = useQuery();
  // Resolve the creator from the URL first, then fall back to the stored
  // session. Stripe returns and verification links routinely land here without
  // the query param, and erroring out at that point stranded the creator.
  const usernameParam = (query.get("username") || "").trim();
  const storedUsername = (() => {
    try {
      return (
        window.localStorage.getItem("kuntips_creator_username") || ""
      ).trim();
    } catch {
      return "";
    }
  })();
  const usernameQuery = usernameParam || storedUsername;
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
      setError(
        "Vi kunne ikke se hvilken konto vi skulle åpne. Vennligst logg inn på nytt, så kommer du rett til din oversikt.",
      );
      setPayload(null);
      return;
    }

    // Require a session token on the frontend
    const sessionToken = getSessionToken();

    if (!sessionToken) {
      setLoading(false);
      setError(
        "Du må logge inn for å se oversikten din. Vennligst gå til innloggingssiden og logg inn med e-postadressen og passordet ditt.",
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
            "Vi fikk ikke lastet oversikten. Vennligst prøv igjen.",
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
    payload?.creator?.displayName || creatorUsername || "ukjent skaper";
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
      ? `Få ${tier.nextTier.missingVolumeNok} kr mer i tips de neste 30 dagene for å nå nivå ${nextTierNumber}.`
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

  // Three states, not two. "Started but not finished" was previously invisible:
  // the creator was told they were done while payouts silently did not work.
  const stripeConnected = status?.stripeConnected ?? false;
  const stripeStarted = status?.stripeStarted ?? false;
  const stripeStalled = stripeStarted && !stripeConnected;
  const stripeRequirementsDue = status?.stripeRequirementsDue ?? [];
  // Receiving tips and withdrawing to a bank are separate capabilities — a
  // creator can be able to take money while payouts are still paused.
  const canRequestPayout = status?.canRequestPayout ?? true;
  const canReceiveTips =
    status?.canReceiveTips ?? (isActive && stripeConnected);

  const stripeButtonLabel = stripeLoading
    ? "Åpner Stripe…"
    : stripeConnected
    ? "Administrer Stripe-kontoen"
    : stripeStalled
    ? "Fullfør Stripe-oppsettet"
    : "Koble til Stripe-utbetalinger";

  async function handleProfileSave(e) {
    e.preventDefault();
    if (!creatorUsername || profileSaving) return;

    if (containsBlockedContent(bioInput)) {
      setProfileError("Din bio inneholder noe som ikke er tillatt. Vennligst endre teksten.");
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
          "Vi fikk ikke lagret profilen. Vennligst prøv igjen.",
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
        "Vi fikk ikke åpnet Stripe. Vennligst prøv igjen.",
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
      setSecurityError("Vennligst fyll ut alle passordfeltene.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityError("De to passordene er ikke like.");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setSecurityError(PASSWORD_ERROR);
      return;
    }

    setSecuritySaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSecuritySuccess("Passordet er oppdatert.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Failed to change password:", err);
      setSecurityError(
        err.data?.message ||
          err.message ||
          "Vi fikk ikke oppdatert passordet. Vennligst prøv igjen.",
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
        setPayoutError(err.data?.message || err.message || "Vi fikk ikke lastet utbetalingsinformasjonen.");
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
      setPayoutRequestSuccess("Utbetalingen ble startet. Stripe gjennomfører den om kort tid.");
      fetchPayoutPreview(creatorUsername)
        .then(setPayoutPreview)
        .catch(() => {
          setPayoutError("Forhåndsvisningen ble ikke oppdatert automatisk, men utbetalingen er bestilt. Last siden på nytt for å se oppdaterte tall.");
        });
    } catch (err) {
      setPayoutRequestError(err.data?.message || err.message || "Vi fikk ikke sendt utbetalingen. Vennligst prøv igjen.");
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
      setResendVerificationMsg("Bekreftelsen er sendt – sjekk innboksen.");
    } catch (err) {
      setResendVerificationMsg(
        err.data?.message || err.message || "Vi fikk ikke sendt bekreftelsen."
      );
    } finally {
      setResendingVerification(false);
    }
  }


  return (
    <div className="creators-page">
      {/* HEADER */}
      <header className="creators-dashboard-header">
        <h1>Oversikt</h1>
        <p className="creators-subtext">
          {DASH.overviewFor}{" "}
          <span className="creators-username-tag">{creatorDisplayName}</span>.
        </p>
      </header>

      {/* EMAIL VERIFICATION BANNER */}
      {payload && !payload.creator.emailVerified && (
        <section className="card creators-status creators-status-warning">
          <p>
            <strong>Bekreft e-postadressen din</strong> – sjekk innboksen din
            {DASH.verifyBannerTail}
          </p>
          <p className="creators-small">
            {DASH.verifyBannerSub}
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
              {resendingVerification ? "Sender…" : "Send bekreftelsen på nytt"}
            </button>
          )}
        </section>
      )}

      {/* STATUS / ERRORS */}
      {loading && (
        <section className="card creators-status">
          <p>Laster oversikt…</p>
        </section>
      )}

      {!loading && error && (
        <section className="card creators-status creators-status-error">
          <p>{error}</p>
          <p className="creators-small">
            {DASH.errorHint}
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
                  : "Plattformbonus aktiv"}
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
                  <span className="event-countdown-label">t</span>
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
                  <span className="event-countdown-label">sek</span>
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
              {DASH.tabOverview}
            </button>
            <button
                type="button"
                className={activeTab === "profile" ? "creators-tab-button is-active" : "creators-tab-button"}
                onClick={() => setActiveTab("profile")}
            >
              {DASH.tabProfile}
            </button>
            <button
                type="button"
                className={activeTab === "payouts" ? "creators-tab-button is-active" : "creators-tab-button"}
                onClick={() => setActiveTab("payouts")}
            >
              {DASH.tabPayouts}
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
                    ) : stripeStalled ? (
                      <div className="stripe-status-row">
                        <span className="stripe-status-pill stripe-status-disconnected">
                          {DASH.pillUnfinished}
                        </span>
                        <span className="creators-small">
                          {DASH.stalledShort}
                        </span>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleManageStripeClick}
                          disabled={stripeLoading}
                        >
                          {stripeLoading ? "Åpner Stripe…" : "Fullfør Stripe-oppsettet"}
                        </button>
                      </div>
                    ) : (
                      <div className="stripe-status-row">
                        <span className="stripe-status-pill stripe-status-disconnected">
                          {DASH.pillNotConnected}
                        </span>
                        <span className="creators-small">
                          {DASH.connectShort}
                        </span>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleManageStripeClick}
                          disabled={stripeLoading}
                        >
                          {stripeLoading ? "Åpner Stripe…" : "Koble til Stripe-utbetalinger"}
                        </button>
                      </div>
                    )}
                  </section>

                  {/* TIP LINK CARD */}
                  <section
                    className={
                      "card creators-tiplink-card" +
                      (canReceiveTips ? "" : " creators-tiplink-card--inactive")
                    }
                  >
                    <h2>KunTips-linken din</h2>
                    {canReceiveTips ? (
                      <p className="creators-dashboard-sub">
                        {DASH.tipLinkShare}
                      </p>
                    ) : (
                      <p className="creators-dashboard-sub">
                        {DASH.tipLinkInactive}
                      </p>
                    )}
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
                        {tipLinkCopied ? "Kopiert" : "Kopier link"}
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
                      <h2>Venter på utbetaling</h2>
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
                      <h2>Siste 30 dager</h2>
                      <p className="creators-dashboard-number">
                        {stats?.last30dNetNok ?? 0} NOK
                      </p>
                      <p className="creators-dashboard-sub">
                        {stats?.last30dTipCount ?? 0} tip(s) in the last 30 days
                      </p>
                    </div>

                    <div className="creators-dashboard-tile">
                      <h2>Total inntjening</h2>
                      <p className="creators-dashboard-number">
                        {stats?.lifetimeNetNok ?? 0} NOK
                      </p>
                      <p className="creators-dashboard-sub">
                        {stats?.lifetimeTipCount ?? 0}{DASH.totalTipsSuffix}
                      </p>
                    </div>
                  </section>

                  {/* EARNINGS CHART */}
                  {charts && (
                    <section className="card creators-chart-card">
                      <div className="creators-chart-header">
                        <div>
                          <h2>Siste 30 dager</h2>
                          {charts.daily.length > 0 && (
                            <p className="creators-small">
                              {fmtChartDate(charts.daily[0].date)} – {fmtChartDate(charts.daily[charts.daily.length - 1].date)}
                            </p>
                          )}
                          {stats?.last30dNetNok > 0 && (
                            <p className="creators-chart-total">
                              {stats.last30dNetNok.toLocaleString("nb-NO")}{DASH.earnedSuffix}
                            </p>
                          )}
                        </div>
                        <div className="creators-chart-meta">
                          {percentileRank !== null && (
                            <span className="chart-percentile-badge">
                              {DASH.topPercentPre}{percentileRank}{DASH.topPercentPost}
                            </span>
                          )}
                          {charts.changePercent !== null && (
                            <span className={`chart-change-badge ${charts.changePercent >= 0 ? "chart-change-up" : "chart-change-down"}`}>
                              {charts.changePercent >= 0 ? "↑" : "↘"} {Math.abs(charts.changePercent)}{DASH.vsPrev30}
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
                              🔥 {insights.streakDays}{DASH.streakSuffix}
                            </span>
                          )}
                          {insights.projectedMonthNok !== null && (
                            <span className="insight-chip">
                              {DASH.onPacePre}{insights.projectedMonthNok.toLocaleString("nb-NO")}{DASH.onPacePost}
                            </span>
                          )}
                          {insights.bestDayNok > 0 && (
                            <span className="insight-chip">
                              {DASH.bestDayPre}{insights.bestDayNok.toLocaleString("nb-NO")}{DASH.krSuffix}
                            </span>
                          )}
                          {insights.bestMonthNok > 0 && insights.bestMonthLabel && (
                            <span className="insight-chip">
                              {DASH.bestMonthPre}{insights.bestMonthNok.toLocaleString("nb-NO")}{DASH.krSuffix} ({insights.bestMonthLabel})
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
                      <h2>KunTips-nivået ditt</h2>
                      {tier ? (
                          <>
                            {globalEventBoostTiers > 0 ? (
                              <div className="tier-display-event">
                                <div className="tier-display-event-number">
                                  <span className="tier-event-word">Nivå</span>
                                  <span className="tier-event-digit">{tier.currentTier}</span>
                                </div>
                                <span className="tier-event-badge">
                                  ✦ BONUS AKTIV ✦
                                </span>
                                {tier.baseTier !== tier.currentTier && (
                                  <p className="tier-event-note">
                                    Løftet fra nivå {tier.baseTier} – du beholder{" "}
                                    <strong>{keptPercentLabel}</strong> av hvert tips
                                    så lenge bonusen varer.
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="creators-dashboard-number">
                                Nivå {tier.currentTier}
                              </p>
                            )}
                            <p className="creators-dashboard-sub">
                              {DASH.tierKeepPre}{keptPercentLabel}{DASH.tierKeepPost}
                              {DASH.tierFeeText}
                            </p>
                            <p className="creators-dashboard-sub">
                              Tips siste 30 dager: {tier.volume30dNok} kr.
                            </p>
                            <p className="creators-dashboard-sub">{nextTierText}</p>
                          </>
                      ) : (
                          <p className="creators-dashboard-sub">
                            Nivåinformasjon er ikke tilgjengelig ennå.
                          </p>
                      )}
                    </div>
                  </section>

                  {/* RECENT TIPS TABLE */}
                  <section className="card creators-dashboard-table-wrapper">
                    <div className="creators-dashboard-table-header">
                      <h2>Siste tips</h2>
                      <p className="creators-dashboard-sub">
                        {DASH.recentSub}
                      </p>
                    </div>

                    {recentTips.length === 0 ? (
                        <p className="creators-dashboard-sub">
                          {DASH.noTips}
                        </p>
                    ) : (
                        <div className="creators-dashboard-table-scroll">
                          <table className="creators-dashboard-table">
                            <thead>
                            <tr>
                              <th>Dato</th>
                              <th>Du får</th>
                              <th>Fra</th>
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
                                        : <span className="tip-from-anon">Anonym</span>}
                                    </td>
                                    <td>
                                      <span className={`status-pill status-${String(tip.status || "").toLowerCase()}`}>
                                        {DASH.tipStatus[String(tip.status || "").toLowerCase()] || tip.status}
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
                      {DASH.payoutsNote}
                    </p>
                  </section>
                </>
            )}

            {activeTab === "profile" && (
                <>
                  {/* PUBLIC PROFILE */}
                  <section className="card creators-profile-card">
                    <h2>Offentlig profil</h2>
                    <p className="creators-dashboard-sub">
                      {DASH.profileSubPre}
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
                          {DASH.labelDisplayName}
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
                          {DASH.displayNameHelp}
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
                          <span>{DASH.bioHelp}</span>
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
                            {DASH.profileSaved}
                          </p>
                      )}

                      <div className="creators-profile-actions">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={profileSaving || !displayNameInput.trim()}
                        >
                          {profileSaving ? "Lagrer…" : "Lagre endringer"}
                        </button>
                      </div>
                    </form>

                    <p className="creators-small creators-profile-note">
                      {DASH.profileNote}
                    </p>
                  </section>

                  {/* REFERRAL PROGRAM */}
                  <section className="card creators-dashboard-tier">
                    <div className="creators-dashboard-tier-main">
                      <h2>Vervekampanje</h2>

                      {creatorUsername ? (
                          <>
                            <p className="creators-dashboard-sub">
                              {DASH.referralSub}
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
                                      {referralLinkCopied ? "Kopiert" : "Kopier link"}
                                    </button>
                                  </div>
                                  <p className="creators-small">
                                    {DASH.referralCount}
                                  </p>
                                </div>
                            )}

                            <p className="creators-dashboard-sub">
                              {DASH.referred365}{" "}
                              <strong>{totalReferralsLast365d}</strong>
                            </p>

                            {referralBoostTiers > 0 && (
                                <p className="creators-dashboard-sub">
                                  {DASH.boostReferralPre}
                                  <strong>+{referralBoostTiers} nivå</strong>
                                  {DASH.boostReferralPost}
                                </p>
                            )}
                            {joinBoostTiers > 0 && (
                                <p className="creators-dashboard-sub">
                                  {DASH.boostJoinPre}
                                  <strong>+{joinBoostTiers} nivå</strong>
                                  {DASH.boostJoinPost}
                                </p>
                            )}
                            {temporaryBoostTiers > 0 && (
                                <p className="creators-dashboard-sub">
                                  {DASH.boostTempPre}
                                  <strong>+{temporaryBoostTiers} nivå</strong>
                                  {DASH.boostTempPost}
                                </p>
                            )}
                            {globalEventBoostTiers > 0 && (
                                <p className="creators-dashboard-sub">
                                  {DASH.boostEventPre}
                                  <strong>+{globalEventBoostTiers} nivå</strong>
                                  {DASH.boostEventPost}
                                </p>
                            )}
                            {referralBoostTiers === 0 && joinBoostTiers === 0 &&
                             temporaryBoostTiers === 0 && globalEventBoostTiers === 0 && (
                                <p className="creators-dashboard-sub">
                                  {DASH.noBoosts}
                                </p>
                            )}
                          </>
                      ) : (
                          <p className="creators-dashboard-sub">
                            {DASH.referralUnavailable}
                          </p>
                      )}
                    </div>
                  </section>

                  {/* SECURITY */}
                  <section className="card creators-security-card">
                    <h2>Sikkerhet</h2>
                    <p className="creators-dashboard-sub">
                      {DASH.securitySub}
                    </p>

                    <form
                        className="creators-profile-form creators-security-form"
                        onSubmit={handlePasswordChange}
                    >
                      <div className="form-field creators-form-group">
                        <label className="creators-label" htmlFor="currentPassword">
                          {DASH.labelCurrentPassword}
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
                          {DASH.labelNewPassword}
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
                          {DASH.labelConfirmPassword}
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
                          {securitySaving ? "Oppdaterer…" : "Oppdater passord"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleLogoutClick}
                        >
                          {DASH.logoutBtn}
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
                    <h2>Stripe-utbetalinger</h2>
                    {stripeConnected ? (
                        <>
                          <p className="creators-dashboard-sub">
                            {DASH.connectedSubPre}
                            {keptPercentLabel || "95 %"}
                            {DASH.connectedSubPost}
                          </p>
                          <p className="creators-dashboard-sub">
                            Bruk denne knappen til å se eller oppdatere
                            utbetalingsopplysningene dine (bankkonto m.m.)
                            direkte i Stripe.
                          </p>
                          {!canRequestPayout && (
                            <p className="creators-error-inline">
                              Du kan ta imot tips, men Stripe har satt
                              <strong> utbetalinger</strong> på pause for kontoen
                              din – så du får ikke tatt ut penger til banken
                              ennå. Pengene ligger trygt i Stripe-saldoen din.
                              Åpne Stripe nedenfor for å se hva som gjenstår.
                            </p>
                          )}
                        </>
                    ) : stripeStalled ? (
                        <>
                          <p className="creators-dashboard-sub">
                            {DASH.stalledPayout1}
                          </p>
                          <p className="creators-dashboard-sub">
                            {DASH.stalledPayout2}
                          </p>
                          {stripeRequirementsDue.length > 0 && (
                            <p className="creators-small">
                              {DASH.stripeStillNeeds}
                              {stripeRequirementsDue.slice(0, 4).join(", ")}
                              {stripeRequirementsDue.length > 4 ? "…" : ""}
                            </p>
                          )}
                        </>
                    ) : (
                        <>
                          <p className="creators-dashboard-sub">
                            Stripe-utbetalinger er ikke koblet til ennå. Du trenger en
                            Stripe-konto for å ta imot tips.
                          </p>
                          <p className="creators-dashboard-sub">
                            Det tar rundt fem minutter. Ha kontonummeret klart.
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
                      {DASH.opensNewSession}
                    </p>
                  </div>
                </section>

                {/* PAYOUT PREVIEW */}
                <section className="card creators-payouts-card">
                  <h2>Saldo</h2>
                  <p className="creators-dashboard-sub">
                    {DASH.balanceSub}
                  </p>

                  {payoutLoading && (
                    <p className="creators-dashboard-sub">{DASH.loadingPayout}</p>
                  )}

                  {payoutError && (
                    <p className="creators-error-inline">{payoutError}</p>
                  )}

                  {!payoutLoading && payoutPreview && (
                    <>
                      <div className="creators-dashboard-grid">
                        <div className="creators-dashboard-tile">
                          <h2>Klar til utbetaling</h2>
                          <p className="creators-dashboard-number">
                            {(payoutPreview.eligible_creator_net_minor / 100).toFixed(2)} NOK
                          </p>
                          <p className="creators-dashboard-sub">
                            {payoutPreview.eligible_tip_count}{DASH.eligibleSuffix}
                          </p>
                        </div>
                        <div className="creators-dashboard-tile">
                          <h2>Venter</h2>
                          <p className="creators-dashboard-number">
                            {payoutPreview.pending_tip_count}
                          </p>
                          <p className="creators-dashboard-sub">
                            {DASH.pendingHold}
                          </p>
                        </div>
                      </div>

                      {payoutPreview.pending_tip_count > 0 && payoutPreview.next_tip_becomes_eligible_at && (
                        <p className="creators-dashboard-sub">
                          {DASH.nextClearsPre}
                          {new Date(payoutPreview.next_tip_becomes_eligible_at).toLocaleDateString("no-NO")}.
                        </p>
                      )}

                      {payoutPreview.creator_debt_minor > 0 && (
                        <p className="creators-dashboard-sub">
                          {DASH.debtPre}
                          <strong>{(payoutPreview.creator_debt_minor / 100).toFixed(2)} NOK</strong>
                          {DASH.debtPost}
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
                          {payoutRequesting ? "Sender…" : "Be om utbetaling"}
                        </button>
                      </div>

                      {!payoutPreview.eligible && payoutPreview.eligible_tip_count === 0 && (
                        <p className="creators-small">
                          {DASH.noEligible}
                        </p>
                      )}
                    </>
                  )}
                </section>

                {/* PAYOUT HISTORY */}
                {payoutHistory.length > 0 && (
                  <section className="card creators-payouts-card">
                    <h2>Utbetalingshistorikk</h2>
                    <p className="creators-dashboard-sub">
                      {DASH.historySubPre}{payoutHistory.length}{DASH.historySubPost}
                    </p>
                    <div className="payout-history-list">
                      {payoutHistory.map((p) => {
                        const isExpanded = expandedPayoutId === p.id;
                        const stmt = statementData[p.id];
                        const statusLabel =
                          p.status === "paid" ? DASH.statusPaid
                          : p.status === "processing" ? DASH.statusProcessing
                          : p.status === "failed" ? DASH.statusFailed
                          : p.status === "cancelled" ? DASH.statusCancelled
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
                                  <p className="creators-dashboard-sub">{DASH.loadingStatement}</p>
                                )}
                                {stmt === "error" && (
                                  <p className="creators-error-inline">{DASH.couldNotLoadStatement}</p>
                                )}
                                {stmt && stmt !== "loading" && stmt !== "error" && (
                                  <>
                                    <div className="payout-statement-meta">
                                      <span>Referanse: <strong>{stmt.reference}</strong></span>
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
                                      <p className="creators-dashboard-sub">{DASH.noTipsInPayout}</p>
                                    ) : (
                                      <table className="payout-statement-table">
                                        <thead>
                                          <tr>
                                            <th>Dato</th>
                                            <th>Fra</th>
                                            <th>Tips</th>
                                            <th>Gebyr</th>
                                            <th>Du fikk</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {stmt.items.map((item) => (
                                            <tr key={item.tipId}>
                                              <td>{new Date(item.tippedAt).toLocaleDateString("nb-NO")}</td>
                                              <td>{item.tipperName || <em>Anonym</em>}</td>
                                              <td>{item.tipAmountNok} NOK</td>
                                              <td>{item.platformFeeNok} NOK</td>
                                              <td><strong>{item.creatorNetNok} NOK</strong></td>
                                            </tr>
                                          ))}
                                        </tbody>
                                        <tfoot>
                                          <tr>
                                            <td colSpan="4"><strong>Utbetalt totalt</strong></td>
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
            <Link to="/creators">{DASH.backToCreators}</Link>
          </p>
          </div>
      );
      }

      export default CreatorsDashboard;
