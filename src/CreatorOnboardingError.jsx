// src/CreatorOnboardingError.jsx
import { Link } from "react-router-dom";
import { usePageTitle } from "./hooks/usePageTitle.js";

export default function CreatorOnboardingError() {
  usePageTitle("Onboarding error");
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
          You can safely try again — Stripe won’t create duplicate accounts,
          you’ll just pick up where you left off.
        </p>

        <div className="page-actions">
          <Link to="/creators/login" className="btn btn-primary">
            Go to login
          </Link>
          <Link to="/support" className="btn btn-secondary">
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
