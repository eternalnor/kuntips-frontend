import { Link } from 'react-router-dom';
import CreatorSearch from '../components/CreatorSearch.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';

export default function HomePage() {
  usePageTitle('How it works');
  return (
    <main className="home-page">
      {/* HERO */}
      <section className="card home-hero">
        <div className="home-hero-main">
          <div className=”home-hero-text”>
            <h1>Support your favorites — no accounts, no pressure.</h1>
            <p className=”home-hero-sub”>
              One-time tips to creators, processed by Stripe. No fan account needed, nothing shared with the creator.
            </p>

            <div className=”home-hero-actions”>
              <Link to=”/creators/register” className=”btn btn-primary”>
                Create a creator account
              </Link>
              <Link to=”/fans” className=”btn btn-ghost”>
                How tipping works →
              </Link>
            </div>
          </div>

          {/* Visual card */}
          <div className="home-hero-visual">
            <div className="home-hero-card">
              <div className="home-hero-card-header">
                <div className="home-avatar" />
                <div>
                  <div className="home-hero-card-name">Creator name</div>
                  <div className="home-hero-card-hint">Private tip</div>
                </div>
              </div>
              <div className="home-hero-card-body">
                <div className="home-hero-card-row">
                  <span>Tip amount</span>
                  <span>kr250.00</span>
                </div>
                <div className="home-hero-card-row">
                  <span>Creator keeps</span>
                  <span>≈ 95–100%</span>
                </div>
                <div className="home-hero-card-row home-hero-card-muted">
                  <span>Service fee</span>
                  <span>Handled by Stripe</span>
                </div>
              </div>
              <div className="home-hero-card-footer">
                <button className="home-hero-card-button" type="button">
                  Tip anonymously
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="card home-section">
        <h2>How KunTips works</h2>
        <div className="home-grid">
          <div className="home-tile">
            <h3>1. No account needed</h3>
            <p>Pick an amount and pay with your card — no KunTips account, no login, no donor list.</p>
          </div>
          <div className="home-tile">
            <h3>2. Creators keep more</h3>
            <p>Creators keep 95–100% of every tip. Fans cover a small service fee on top — not deducted from the creator.</p>
          </div>
          <div className="home-tile">
            <h3>3. Private and secure</h3>
            <p>Creators never see your payment details. Leave your name optionally, or tip anonymously.</p>
          </div>
        </div>
      </section>

      {/* FOR FANS & CREATORS */}
      <section className="card home-section">
        <h2>For fans and creators</h2>
        <div className="home-grid home-grid-two">
          <div className="home-tile">
            <h3>For fans</h3>
            <p>No sign-up, no subscription, nothing shared with the creator — just support when you feel like it.</p>
            <p className="home-tile-cta">
              <Link to="/fans" className="btn btn-ghost">
                More info →
              </Link>
            </p>
          </div>
          <div className="home-tile">
            <h3>For creators</h3>
            <p>Share your KunTips link anywhere. Connect Stripe once and start receiving tips the same day — you keep 95–100%.</p>
            <p className="home-tile-cta">
              <Link to="/creators/register" className="btn btn-primary">
                Create your account
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CALL */}
      <section className="card home-section home-section-last">
        <h2>Know who you want to tip?</h2>
        <p>Enter their username and go straight to their tip page.</p>
        <CreatorSearch placeholder="username" buttonText="Go to tip page →" />
      </section>
    </main>
  );
}
