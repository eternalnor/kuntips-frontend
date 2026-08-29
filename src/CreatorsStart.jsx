// src/CreatorsStart.jsx
import { Link } from "react-router-dom";
import { usePageTitle } from "./hooks/usePageTitle.js";

function CreatorsStart() {
  usePageTitle("Kom i gang");
  return (
    <div className="creators-page">
      <section className="card creators-start">
        <h1>Dette trenger du for å komme i gang</h1>
        <p>
          Stripe står for verifisering og utbetaling. Sett av noen minutter, og ha dette klart:
        </p>

        <ul className="creators-list">
          <li>En Stripe-konto – den opprettes automatisk hvis du ikke har en.</li>
          <li>Opplysningene Stripe krever: navn, adresse og kontonummer.</li>
          <li>Et brukernavn og en kort bio til KunTips-siden din.</li>
        </ul>

        <div className="creators-cta-row">
          <Link to="/creators/register" className="btn btn-primary">
            Opprett din KunTips-konto
          </Link>
          <Link to="/creators/login" className="btn btn-secondary">
            Logg inn
          </Link>
        </div>

        <p className="creators-backlink">
          <Link to="/creators">← Tilbake til informasjon for skapere</Link>
        </p>
      </section>
    </div>
  );
}

export default CreatorsStart;
