// src/CreatorsStart.jsx
import { Link } from "react-router-dom";
import { usePageTitle } from "./hooks/usePageTitle.js";

function CreatorsStart() {
  usePageTitle("Get started");
  return (
    <div className="creators-page">
      <section className="card creators-start">
        <h1>What you need to get started</h1>
        <p>
          Stripe handles identity verification and payouts — you&apos;ll need a
          few minutes and the following:
        </p>

        <ul className="creators-list">
          <li>A Stripe account — created automatically if you don&apos;t have one yet.</li>
          <li>Basic identity info required by Stripe (name, address, bank details).</li>
          <li>A username and short bio for your KunTips tip page.</li>
        </ul>

        <div className="creators-cta-row">
          <Link to="/creators/register" className="btn btn-primary">
            Create creator account
          </Link>
          <Link to="/creators/login" className="btn btn-secondary">
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
