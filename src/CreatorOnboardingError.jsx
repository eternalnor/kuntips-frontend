// src/CreatorOnboardingError.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function CreatorOnboardingError() {
  return (
    <div className="page-shell">
      <div className="page-content">
        <h1 className="page-title">We couldn’t complete your Stripe setup</h1>
        <p className="page-lead">
          The Stripe Connect onboarding flow did not finish successfully.
        </p>
        <p className="page-body">
          This can happen if you closed the Stripe window, used the back
          button, or something went wrong during the verification steps.
        </p>

        <p className="page-body">
          You can safely try again. Stripe won’t double-charge you or create
          duplicate accounts; you’ll just continue the onboarding process.
        </p>

        <div className="page-actions">
          <Link to="/creators/start" className="primary-button">
            Try Stripe onboarding again
          </Link>
          <Link to="/support" className="secondary-link">
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
