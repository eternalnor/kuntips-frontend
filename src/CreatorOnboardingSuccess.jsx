// src/CreatorOnboardingSuccess.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function CreatorOnboardingSuccess() {
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
          {/* route path is /creators/dashboard */}
          <Link to="/creators/dashboard" className="primary-button">
            Go to creator dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
