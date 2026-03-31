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
          <div className="home-hero-text">
            <h1>Support your favorites — no accounts, no pressure.</h1>
            <p className="home-hero-sub">
              KunTips lets fans send one-time tips to creators in seconds. No
              sign-up for fans, no profiles or follower lists, and no personal
              details shared with creators — just a quick “thank you” powered by
              Stripe.
            </p>

            <p className="home-hero-sub">
              Creators drop a single KunTips link wherever they are online. We
              quietly handle the payment flow in the background so they can
              focus on their work, not another platform.
            </p>

            <div className="home-hero-actions">
              <Link to="/creators/register" className="btn btn-primary">
                Create a creator account
              </Link>
              <Link to="/fans" className="btn btn-ghost">
                How tipping works →
              </Link>
            </div>

            <p className="home-hero-note">
              Private by default, Stripe-secure. No subscriptions, no feeds,
              just tips.
            </p>
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
            <p>
              Fans choose a tip amount and pay securely with Stripe. There’s no
              KunTips account to create, no login, and no public donor list —
              just a clean, one-time payment.
            </p>
          </div>
          <div className="home-tile">
            <h3>2. Creators keep more</h3>
            <p>
              Fans cover Stripe&apos;s processing fee and a small KunTips
              service fee. Creators keep around 95–100% of each tip, depending
              on their tier – usually more than on traditional creator platforms.
            </p>
          </div>
          <div className="home-tile">
            <h3>3. Private and secure</h3>
            <p>
              Fans are private by default — no payment details are ever shared
              with creators. Fans can optionally leave their name if they want
              to. KunTips doesn&apos;t store card numbers; all sensitive data
              lives with Stripe, a PCI-compliant provider used by millions of
              businesses.
            </p>
          </div>
        </div>
      </section>

      {/* FOR FANS & CREATORS */}
      <section className="card home-section">
        <h2>For fans and creators</h2>
        <div className="home-grid home-grid-two">
          <div className="home-tile">
            <h3>For fans</h3>
            <p>
              Send a tip without signing up, logging in, or exposing your
              identity to the creator. No recurring charges, no subscriptions,
              no follow-up messages — just support when you feel like it.
            </p>
            <p className="home-tile-cta">
              <Link to="/fans" className="btn btn-ghost">
                More info for fans →
              </Link>
            </p>
          </div>
          <div className="home-tile">
            <h3>For creators</h3>
            <p>
              Add a KunTips link to your socials, streams, profiles or
              portfolio, and let fans support you directly. There are no feeds,
              algorithms or paywalled posts to manage — KunTips only handles
              tips and payouts.
            </p>
            <p>
              Connect Stripe once, get your link, and start receiving tips the
              same day. Creators keep 95–100% of every tip depending on their
              earnings tier.
            </p>
            <p className="home-tile-cta">
              <Link to="/creators/register" className="btn btn-primary">
                Create your creator account
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CALL */}
      <section className="card home-section home-section-last">
        <h2>Ready to send a tip?</h2>
        <p>
          If you already know a creator’s username, type it below and you’ll
          go straight to their tip page — no account needed.
        </p>
        <CreatorSearch placeholder="username" buttonText="Go to tip page →" />
      </section>
    </main>
  );
}
