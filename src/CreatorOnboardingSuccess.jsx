// src/CreatorOnboardingSuccess.jsx
import { Link } from "react-router-dom";
import { usePageTitle } from "./hooks/usePageTitle.js";

export default function CreatorOnboardingSuccess() {
  usePageTitle("Stripe er koblet til");
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
        <h1 className="page-title">Stripe-kontoen din er koblet til ✅</h1>
        <p className="page-lead">
          Du er klar! Tipssiden din er nå aktiv, og følgerne dine kan sende deg tips.
        </p>
        <p className="page-body">
          I oversikten kan du se inntjeningen din, kopiere linken til siden og redigere profilen din.
        </p>

        <div className="page-actions">
          <Link to={dashboardPath} className="btn btn-primary">
            Gå til oversikten din
          </Link>
        </div>
      </div>
    </div>
  );
}
