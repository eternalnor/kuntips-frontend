// src/CreatorsStart.jsx
import { Link } from "react-router-dom";

function CreatorsStart() {
  return (
    <div className="creators-page">
      <section className="card creators-start">
        <h1>What you need to get started as a creator</h1>
        <p>
          When KunTips is live, creators will connect their Stripe account to
          receive payouts. Stripe handles identity checks and payouts to your
          bank account – KunTips only handles the tip logic.
        </p>

        <div className="creators-columns">
          <div className="creators-column">
            <h2>You&apos;ll need</h2>
            <ul className="creators-list">
              <li>
                A Stripe account (created during onboarding if you don&apos;t
                have one).
              </li>
              <li>
                Basic identity info required by Stripe (name, address, bank
                details).
              </li>
              <li>
                A creator alias and short bio for your KunTips page.
              </li>
            </ul>
          </div>

          <div className="creators-column">
            <h2>What happens</h2>
            <ul className="creators-list">
              <li>You create a KunTips creator account.</li>
              <li>
                You&apos;re redirected to Stripe&apos;s secure onboarding flow
                to connect payouts.
              </li>
              <li>
                After onboarding, your tip page is activated and fans can send
                tips; Stripe handles KYC and payouts to you.
              </li>
            </ul>
          </div>
        </div>

        <div className="creators-cta-row">
          <Link to="/creators/register" className="btn-primary">
            Create creator account
          </Link>
          <Link to="/creators/login" className="btn-secondary">
            Log in to dashboard
          </Link>
        </div>

        <p className="creators-backlink">
          <Link to="/creators">← Back to creator information</Link>
        </p>
      </section>
    </div>
  );
}

export default CreatorsStart;
