import { Link } from "react-router-dom";

function CreatorsStart() {
  return (
    <div className="creators-page">
      <section className="card creators-start">
        <h1>Get ready to connect Stripe</h1>
        <p>
          When KunTips goes live, creators will onboard through Stripe Connect.
          For now, this page walks you through what you&apos;ll need and lets
          you try the flow in test mode.
        </p>

        <div className="creators-columns">
          <div className="creators-column">
            <h2>You&apos;ll need</h2>
            <ul className="creators-list">
              <li>A Stripe account (created during onboarding if you don&apos;t have one).</li>
              <li>
                Basic identity info required by Stripe (name, address, bank
                details).
              </li>
              <li>A creator alias and short bio for your KunTips page.</li>
            </ul>
          </div>

          <div className="creators-column">
            <h2>What happens</h2>
            <ul className="creators-list">
              <li>You are redirected to Stripe&apos;s secure onboarding flow.</li>
              <li>
                After onboarding, you&apos;re sent back to KunTips and your tip
                page is activated.
              </li>
              <li>
                Fans can now send tips; Stripe handles KYC and payouts to you.
              </li>
            </ul>
          </div>
        </div>

        <div className="creators-cta-row">
          {/* Pure UI for now – backend hook comes later */}
          <button className="btn-primary" disabled>
            Connect Stripe (coming soon)
          </button>
          <p className="creators-small">
            This button is disabled while we keep everything in test mode. We&apos;ll
            hook it up to the real Stripe Connect flow in a later step.
          </p>
        </div>

        <p className="creators-backlink">
          <Link to="/creators">← Back to information page</Link>
        </p>
      </section>
    </div>
  );
}

export default CreatorsStart;
