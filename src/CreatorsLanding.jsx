import { Link } from "react-router-dom";
import { usePageTitle } from "./hooks/usePageTitle.js";

function CreatorsLanding() {
  usePageTitle('Receive tips from your fans', "Accept tips from fans with KunTips. Keep 95\u2013100% of every tip. No subscription, no VAT, no fan accounts needed. Connect Stripe and start earning today.");
  let loggedInUsername = null;
  if (typeof window !== "undefined" && window.localStorage) {
    loggedInUsername = window.localStorage.getItem("kuntips_creator_username");
  }
  return (
    <div className="creators-page">
      {loggedInUsername && (
        <section className="card creators-status">
          <p>
            You're logged in as{" "}
            <span className="creators-username-tag">{loggedInUsername}</span>.
          </p>
          <p className="creators-small">
            Go straight to your{" "}
            <Link
              to={`/creators/dashboard?username=${encodeURIComponent(
                loggedInUsername,
              )}`}
            >
              creator dashboard
            </Link>
            .
          </p>
        </section>
      )}

      {/* HERO */}
      <section className="card creators-hero">
        <div className="creators-hero-text">
          <h1>Simple, private tipping for your fans</h1>
          <ul className="creators-hero-points">
            <li>Keep 95&ndash;100% of every tip</li>
            <li>No fan accounts needed to tip</li>
            <li>No subscription, no monthly fee</li>
            <li>No VAT for fans &mdash; tips are cheaper than purchases</li>
          </ul>

          <div className="creators-hero-actions">
            <Link to="/creators/register" className="btn btn-primary">
              Create creator account
            </Link>
            <Link to="/creators/login" className="btn btn-ghost">
              Log in to dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* FEE COMPARISON */}
      <section className="creators-compare-section">
        <h2 className="creators-compare-heading">Why creators choose KunTips</h2>
        <div className="creators-compare-cards">
          <div className="card creators-compare-card creators-compare-card--kuntips">
            <h3>KunTips</h3>
            <ul>
              <li><span className="creators-compare-check">&#10003;</span> Keep 95&ndash;100% of every tip</li>
              <li><span className="creators-compare-check">&#10003;</span> No fan account required</li>
              <li><span className="creators-compare-check">&#10003;</span> Free &mdash; no monthly fee</li>
              <li><span className="creators-compare-check">&#10003;</span> No VAT on tips</li>
            </ul>
          </div>
          <div className="card creators-compare-card creators-compare-card--others">
            <h3>Typical platforms</h3>
            <ul>
              <li><span className="creators-compare-x">&#10005;</span> Creators keep 70&ndash;95%</li>
              <li><span className="creators-compare-x">&#10005;</span> Fans usually need an account</li>
              <li><span className="creators-compare-x">&#10005;</span> Often paid subscription</li>
              <li><span className="creators-compare-x">&#10005;</span> 25% MVA added on top</li>
            </ul>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="creators-grid">
        <div className="card creators-step">
          <h2>1. Connect Stripe</h2>
          <p>
            Onboard with Stripe &mdash; they verify your identity and handle
            payouts directly to your bank account. Takes about 5 minutes.
          </p>
        </div>
        <div className="card creators-step">
          <h2>2. Share your tip link</h2>
          <p>
            You get a clean kuntips.no/&lt;username&gt; page. Drop it in
            your bio, social profiles, or anywhere you talk to fans.
          </p>
        </div>
        <div className="card creators-step">
          <h2>3. Receive payouts</h2>
          <p>
            Fans pick an amount and pay via Stripe in seconds. Request a
            payout from your dashboard whenever your balance is ready.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="card home-section home-section-last">
        <h2>Ready to start earning?</h2>
        <p>
          Create your account in minutes. Connect Stripe once and start
          receiving tips the same day.
        </p>
        <div className="home-hero-actions">
          <Link to="/creators/register" className="btn btn-primary">
            Create a creator account
          </Link>
          <Link to="/creators/login" className="btn btn-ghost">
            Log in to dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}

export default CreatorsLanding;
