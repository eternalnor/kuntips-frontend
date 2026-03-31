// src/CreatorOnboardingSuccess.jsx
import { Link } from "react-router-dom";
import { usePageTitle } from "./hooks/usePageTitle.js";

export default function CreatorOnboardingSuccess() {
  usePageTitle("Stripe connected");
  let username = null;

  try {
    if (typeof window !== "undefined" && window.localStorage) {
      username = window.localStorage.getItem("kuntips_creator_username");
    }
  } catch {
    username = null;
  }

  const dashboardPath = username
    ? `/creators/dashboard?username=${encodeURIComponent(username)}`
    : "/creators/login";

  return (
    <div className="page-shell">
      <div className="page-content">
        <h1 className="page-title">Your Stripe account is connected ✅</h1>
        <p className="page-lead">
          You’re all set — your tip page is now active and fans can start sending you tips.
        </p>
        <p className="page-body">
          Head to your creator dashboard to see your earnings, copy your tip link, and manage your profile.
        </p>

        <div className="page-actions">
          <Link to={dashboardPath} className="btn btn-primary">
            Go to creator dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
