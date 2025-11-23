import { Link } from "react-router-dom";

function CreatorsLanding() {
  return (
    <div className="creators-page">
      {/* HERO */}
      <section className="card creators-hero">
        <div className="creators-hero-text">
          <h1>Simple, anonymous tipping for your fans</h1>
          <p>
            KunTips lets your followers send tips without exposing their real
            identity. You get clean payouts to Stripe – they get peace of mind.
          </p>

          <div className="creators-hero-actions">
            <Link to="/creators/start" className="btn-primary">
              Start in test mode
            </Link>
            <span className="creators-hero-note">
              No NSFW hosting. No subscriptions. Just tips.
            </span>
          </div>
        </div>

        <div className="creators-hero-side">
          <div className="creators-pill">95% of tips to you</div>
          <div className="creators-pill">Fans cover fees</div>
          <div className="creators-pill">Norwegian company · Stripe</div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="creators-grid">
        <div className="card creators-step">
          <h2>1. Connect Stripe</h2>
          <p>
            You onboard with Stripe (test mode for now). They verify you and
            handle payouts to your bank account.
          </p>
        </div>
        <div className="card creators-step">
          <h2>2. Share your tip link</h2>
          <p>
            You get a clean kunTips.no/u/&lt;username&gt; page. Link it from
            social media, profiles, or anywhere you talk to fans.
          </p>
        </div>
        <div className="card creators-step">
          <h2>3. Receive anonymous tips</h2>
          <p>
            Fans choose an amount, pay via Stripe, and you receive payouts from
            Stripe. KunTips only takes a small platform fee.
          </p>
        </div>
      </section>

      {/* DETAILS / FAQ */}
      <section className="card creators-details">
        <h2>What KunTips is (and isn’t)</h2>
        <ul className="creators-list">
          <li>No content hosting. We only handle the tip payment.</li>
          <li>
            No subscriptions – single tips only, with sensible daily limits.
          </li>
          <li>
            Your real name never appears on the tip page – only your creator
            alias.
          </li>
          <li>
            Payouts go from Stripe to you. KunTips never touches card details.
          </li>
        </ul>

        <p className="creators-small">
          In this first version everything runs in Stripe test mode, so you can
          try the full flow before we open for real payouts.
        </p>

        <Link to="/creators/start" className="btn-secondary">
          See what you need to get started
        </Link>
      </section>
    </div>
  );
}

export default CreatorsLanding;
