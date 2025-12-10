// src/CreatorOnboardingSuccess.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function CreatorOnboardingSuccess() {
  let lastUsername = null;

  try {
    if (typeof window !== "undefined" && window.localStorage) {
      lastUsername = window.localStorage.getItem(
        "kuntips_last_creator_username",
      );
    }
  } catch (e) {
    lastUsername = null;
  }

  const dashboardPath = lastUsername
    ? `/creators/dashboard?username=${encodeURIComponent(lastUsername)}`
    : "/creators/dashboard";

  return (
    <div className="page-shell">
      <div className="page-content">
        <h1 className="page-title">Your Stripe account is connected ✅</h1>
        <p className="page-lead">
          You’re almost ready to receive tips via KunTips.
        </p>
        <p className="page-body">
          You can now go to your creator dashboard to see your earnings and
          profile settings.
        </p>

        <div className="page-actions">
          <Link to={dashboardPath} className="btn btn-primary">
            Go to creator dashboard
          </Link>
        </div>

        {!lastUsername && (
          <p className="page-body-small">
            We couldn&apos;t detect your creator username automatically. On the
            dashboard, make sure to add{" "}
            <code>?username=&lt;your-creator-username&gt;</code> to the URL, for
            example:{" "}
            <code>/creators/dashboard?username=testcreator1</code>.
          </p>
        )}
      </div>
    </div>
  );
}
