import { Link } from "react-router-dom";
import CreatorSearch from "../components/CreatorSearch.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";

export default function WelcomePage() {
  usePageTitle(null); // just "KunTips"
  return (
    <main className="welcome-stage">
      <section className="welcome-hero welcome-hero-animate">
        <img
          src="/KunTips_Full_Logo_Transparent.webp"
          className="welcome-logo"
          alt="KunTips"
        />
        <p className="welcome-sub">
          Support your favourites — no fuss.
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

      <section className="welcome-search-section welcome-choices-animate">
        <CreatorSearch
          label="Already know who you want to tip? Enter their username:"
          placeholder="username"
          buttonText="Go to tip page →"
        />
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
