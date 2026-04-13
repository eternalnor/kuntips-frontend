import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CreatorSearch from "../components/CreatorSearch.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

export default function WelcomePage() {
  usePageTitle(null, "Send a one-time tip to your favourite creator in seconds. No account needed. Creators keep 95\u2013100%. Private, secure, powered by Stripe.");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/stats`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setStats(d))
      .catch(() => {});
  }, []);

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

      {stats && (
        <div className="welcome-stats-wrap welcome-choices-animate"><div className="welcome-stats-card">
          <div className="welcome-stat">
            <span className="welcome-stat__number">
              {stats.creators.toLocaleString("nb-NO")}+
            </span>
            <span className="welcome-stat__label">creators</span>
          </div>
          <div className="welcome-stats-divider" />
          <div className="welcome-stat">
            <span className="welcome-stat__number">
              {stats.tipsSent.toLocaleString("nb-NO")}+
            </span>
            <span className="welcome-stat__label">tips sent</span>
          </div>
          <div className="welcome-stats-divider" />
          <div className="welcome-stat">
            <span className="welcome-stat__number">
              {stats.totalEarnedNok.toLocaleString("nb-NO")}
            </span>
            <span className="welcome-stat__label">NOK earned</span>
          </div>
        </div></div>
      )}

      <section className="welcome-search-section welcome-choices-animate">
        <CreatorSearch
          label="Already know who you want to tip?"
          placeholder="username"
          buttonText="Go to tip page →"
        />
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
              <span className="welcome-choice-card__cta-pill">See how it works</span>
              <span className="welcome-choice-card__cta-arrow">&rarr;</span>
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
              <span className="welcome-choice-card__cta-pill">Start earning</span>
              <span className="welcome-choice-card__cta-arrow">&rarr;</span>
            </div>
          </div>
        </Link>
      </section>

      <section className="welcome-info" id="welcome-info">
        <div className="welcome-info-grid">
          <div className="card welcome-info-card">
            <h2>No accounts needed</h2>
            <p>Tip anonymously — no sign-up, no donor list, no trace.</p>
          </div>

          <div className="card welcome-info-card">
            <h2>Creators keep 95–100%</h2>
            <p>The highest payout rate in the industry. No subscriptions, no hidden fees.</p>
          </div>

          <div className="card welcome-info-card">
            <h2>Powered by Stripe</h2>
            <p>Your card details never touch KunTips. Payments are handled entirely by Stripe.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
