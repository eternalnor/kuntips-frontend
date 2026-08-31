// src/CreatorOnboardingRefresh.jsx
//
// Stripe redirects here (refresh_url) whenever an onboarding account link is
// stale or already used — which happens whenever a creator leaves mid-flow to
// find their bank details and comes back. Without this route the user lands on
// the 404 page and the onboarding is dead.
//
// Behaviour: immediately mint a fresh account link and bounce straight back
// into Stripe. Only show UI if that fails (e.g. the session expired).

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "./hooks/usePageTitle.js";
import { DASH } from "./dashStrings.js";
import { createStripeAccountLink, getSessionToken } from "./api";

export default function CreatorOnboardingRefresh() {
  usePageTitle("Fortsetter oppsettet");
  const [failed, setFailed] = useState(null); // null | "no_session" | "error"
  const [retrying, setRetrying] = useState(false);

  function readUsername() {
    try {
      return window.localStorage.getItem("kuntips_creator_username");
    } catch {
      return null;
    }
  }

  async function resume() {
    setRetrying(true);
    if (!getSessionToken()) {
      setFailed("no_session");
      setRetrying(false);
      return;
    }
    try {
      const username = readUsername();
      const returnUrlPath = username
        ? `/creators/dashboard?username=${encodeURIComponent(username)}`
        : undefined;
      const data = await createStripeAccountLink(returnUrlPath);
      if (data?.url) {
        // full-page redirect — this leaves the SPA for Stripe
        window.location.href = data.url;
        return;
      }
      setFailed("error");
    } catch {
      setFailed("error");
    } finally {
      setRetrying(false);
    }
  }

  useEffect(() => {
    resume();
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const username = readUsername();
  const dashboardPath = username
    ? `/creators/dashboard?username=${encodeURIComponent(username)}`
    : "/creators/dashboard";

  if (!failed) {
    return (
      <div className="page-shell">
        <div className="page-content">
          <h1 className="page-title">{DASH.refreshTitle}</h1>
          <p className="page-lead">
            {DASH.refreshLead}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-content">
        <h1 className="page-title">{DASH.refreshFinishTitle}</h1>
        {failed === "no_session" ? (
          <>
            <p className="page-lead">
              {DASH.refreshNoSession}
            </p>
            <div className="page-actions">
              <Link to="/creators/login" className="btn btn-primary">
                {DASH.refreshLoginBtn}
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="page-lead">
              {DASH.refreshFailed}
            </p>
            <div className="page-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={resume}
                disabled={retrying}
              >
                {retrying ? DASH.refreshOpening : DASH.refreshRetry}
              </button>
              <Link to={dashboardPath} className="btn btn-ghost">
                Go to dashboard
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
