// src/CreatorOnboardingError.jsx
import { Link } from "react-router-dom";
import { usePageTitle } from "./hooks/usePageTitle.js";

export default function CreatorOnboardingError() {
  usePageTitle("Oppsettet ble ikke fullført");
  return (
    <div className="page-shell">
      <div className="page-content">
        <h1 className="page-title">Vi kunne ikke fullføre Stripe-oppsettet</h1>
        <p className="page-lead">
          Stripe-tilkoblingen ble ikke fullført.
        </p>
        <p className="page-body">
          Dette kan skje om du lukket Stripe-vinduet, trykket på tilbakeknappen, eller noe gikk galt under verifiseringsstegene.
        </p>
        <p className="page-body">
          Du kan trygt prøve igjen. Stripe lager ikke duplikat-kontoer, så du fortsetter der du slapp.
        </p>

        <div className="page-actions">
          <Link to="/creators/login" className="btn btn-primary">
            Logg inn
          </Link>
          <Link to="/support" className="btn btn-secondary">
            Kontakt support
          </Link>
        </div>
      </div>
    </div>
  );
}
