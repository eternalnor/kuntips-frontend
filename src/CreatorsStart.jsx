// src/CreatorsStart.jsx
import { Link } from "react-router-dom";

function CreatorsStart() {
  return (
    <div className="creators-page">
      <section className="card creators-start">
        <h1>What you need to get started as a creator</h1>
        <p>
          Getting started takes just a few minutes. You connect your Stripe
          account to receive payouts — Stripe handles identity verification and
          bank transfers, KunTips handles the tip flow.
        </p>

        <div className="creators-columns">
          <div className="creators-column">
            <h2>You&apos;ll need</h2>
            <ul className="creators-list">
              <li>
                A Stripe account — created automatically during onboarding if
                you don&apos;t have one yet.
              </li>
              <li>
                Basic identity info required by Stripe (name, address, bank
                details for payouts).
              </li>
              <li>
                A creator username and short bio for your KunTips tip page.
              </li>
            </ul>
          </div>

          <div className="creators-column">
            <h2>How it works</h2>
            <ul className="creators-list">
              <li>Create your KunTips creator account below.</li>
              <li>
                Connect Stripe from your dashboard — takes about 5 minutes.
              </li>
              <li>
                Your tip page goes live immediately. Share the link anywhere
                and fans can start tipping you the same day.
              </li>
            </ul>
          </div>
        </div>

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
