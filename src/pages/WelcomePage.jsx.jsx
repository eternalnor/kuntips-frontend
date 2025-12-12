import { Link } from "react-router-dom";

export default function WelcomePage() {
  return (
    <main className="welcome-stage">
      <section className="welcome-hero welcome-hero-animate">
        <h1 className="welcome-title">Welcome to KunTips</h1>
        <p className="welcome-sub">
          One-time tips, powered by Stripe. No fan accounts. No feed. Just a clean tip flow.
        </p>
      </section>

      <section className="welcome-choices welcome-choices-animate">
        <Link to="/fans" className="welcome-choice-card welcome-choice-card--fan">
          <div className="welcome-choice-card__inner">
            <div className="welcome-choice-card__eyebrow">For fans</div>
            <div className="welcome-choice-card__title">Send a tip</div>
            <div className="welcome-choice-card__desc">
              Pick an amount and pay securely. Fast, private, simple.
            </div>

            <div className="welcome-choice-card__cta">
              <span className="welcome-choice-card__cta-pill">Continue</span>
              <span className="welcome-choice-card__cta-arrow">→</span>
            </div>
          </div>
        </Link>

        <Link to="/creators" className="welcome-choice-card welcome-choice-card--creator">
          <div className="welcome-choice-card__inner">
            <div className="welcome-choice-card__eyebrow">For creators</div>
            <div className="welcome-choice-card__title">Receive tips</div>
            <div className="welcome-choice-card__desc">
              Connect Stripe once and share your KunTips link.
            </div>

            <div className="welcome-choice-card__cta">
              <span className="welcome-choice-card__cta-pill">Continue</span>
              <span className="welcome-choice-card__cta-arrow">→</span>
            </div>
          </div>
        </Link>
      </section>

      <section className="welcome-more-section">
        <Link to="/home" className="welcome-more-bar">
          <span className="welcome-more-bar__label">More info</span>
          <span className="welcome-more-bar__hint">How KunTips works</span>
          <span className="welcome-more-bar__arrow">→</span>
        </Link>

        <p className="welcome-more-note">Or scroll to see a quick breakdown.</p>
      </section>

      <section className="welcome-info" id="welcome-info">
        <div className="welcome-info-grid">
          <div className="card welcome-info-card">
            <h2>For fans</h2>
            <p>Open a creator link, choose an amount, pay securely. No KunTips account.</p>
          </div>

          <div className="card welcome-info-card">
            <h2>For creators</h2>
            <p>Connect Stripe once and share your KunTips link anywhere.</p>
          </div>

          <div className="card welcome-info-card">
            <h2>Privacy & payouts</h2>
            <p>Stripe processes payments. KunTips keeps data collection minimal.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
