import { Link } from "react-router-dom";
import { usePageTitle } from "./hooks/usePageTitle.js";

function CreatorsLanding() {
  usePageTitle('For creators');
  let loggedInUsername = null;
  if (typeof window !== "undefined" && window.localStorage) {
    loggedInUsername = window.localStorage.getItem("kuntips_creator_username");
  }
  return (
    <div className="creators-page">
      {/* HERO */}
      <section className="card creators-hero">
        <div className="creators-hero-text">
          <h1>Simple, private tipping for your fans</h1>
          <p>
            KunTips gives you a clean tip page you can share anywhere. Fans pay
            in seconds — no account, no sign-up. You keep the money, we handle
            the payment.
          </p>

          <div className="creators-hero-actions">
            <Link to="/creators/register" className="btn btn-primary">
              Create creator account
            </Link>
            <Link to="/creators/login" className="btn btn-secondary">
              Log in to dashboard
            </Link>
          </div>
        </div>

        <div className="creators-hero-side">
          <div className="creators-pill">Start at 95%, grow to 100%</div>
          <div className="creators-pill">Fans cover Stripe fees</div>
          <div className="creators-pill">No monthly subscription</div>
          <div className="creators-pill">Norwegian company · Stripe</div>
        </div>
      </section>

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

      {/* FEE MODEL — the main selling point */}
      <section className="card creators-fees">
        <div className="creators-fees-header">
          <h2>You keep more as you earn more</h2>
          <p className="creators-subtext">
            No subscription. No monthly fee. Your platform fee drops
            automatically as your tip earnings grow — you never have to pay or
            upgrade anything.
          </p>
        </div>

        <div className="creators-fees-tiers">
          <div className="creators-fee-tier creators-fee-tier--start">
            <div className="creators-fee-pct">95%</div>
            <div className="creators-fee-label">Starting rate</div>
            <div className="creators-fee-desc">From your very first tip</div>
          </div>
          <div className="creators-fee-arrow">→</div>
          <div className="creators-fee-tier">
            <div className="creators-fee-pct">97%</div>
            <div className="creators-fee-label">Mid tier</div>
            <div className="creators-fee-desc">As tips accumulate</div>
          </div>
          <div className="creators-fee-arrow">→</div>
          <div className="creators-fee-tier creators-fee-tier--top">
            <div className="creators-fee-pct">100%</div>
            <div className="creators-fee-label">Top tier</div>
            <div className="creators-fee-desc">Keep every øre</div>
          </div>
        </div>

        <ul className="creators-fees-points">
          <li>Fans cover Stripe's card processing fee on top of the tip amount — your cut is never reduced by card costs.</li>
          <li>Tiers are calculated automatically based on your cumulative earnings. No action needed on your part.</li>
          <li>Another way to climb faster — refer other creators and earn a tier boost that grows with your referral count. Your referral link is in your dashboard.</li>
          <li>Creators who join through your referral link get a free tier boost for their first 30 days.</li>
          <li>There is no subscription, no listing fee, and no charge just for having a KunTips account.</li>
        </ul>
      </section>

      {/* HOW IT WORKS */}
      <section className="creators-grid">
        <div className="card creators-step">
          <h2>1. Connect Stripe</h2>
          <p>
            Onboard with Stripe — they verify your identity and handle
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
      <section className="card creators-details">
        <Link to="/creators/register" className="btn btn-primary">
          Create your creator account
        </Link>
        <Link to="/creators/login" className="btn btn-secondary">
          Log in to dashboard
        </Link>
      </section>
    </div>
  );
}

export default CreatorsLanding;
