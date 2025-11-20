import { Link } from 'react-router-dom';

export default function HomePage() {
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
              <Link to="/support" className="btn btn-primary">
                Creator onboarding (coming soon)
              </Link>
              <Link to="/u/testcreator" className="btn btn-ghost">
                View example tip page
              </Link>
            </div>

            <p className="home-hero-note">
              Anonymous, simple and Stripe-secure. No subscriptions, no feeds,
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
                  <div className="home-hero-card-hint">Anonymous tip</div>
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
            <h3>3. Anonymous and secure</h3>
            <p>
              Fans and creators never see each other’s personal payment details.
              KunTips doesn&apos;t store card numbers; all sensitive data lives
              with Stripe, a PCI-compliant provider used by millions of
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
              <Link to="/u/testcreator" className="btn btn-ghost">
                Open example tip page
              </Link>
            </p>
          </div>
          <div className="home-tile">
            <h3>For creators</h3>
            <p>
              Add a KunTips link to your socials, streams, profiles or
              portfolio, and let fans support you directly. There are no feeds,
              algorithms or paywalled posts to manage – KunTips only handles
              tips and payouts.
            </p>
            <p>
              <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                Creator dashboard and full onboarding are coming soon. For now,
                reach out if you want early access.
              </span>
            </p>
            <p className="home-tile-cta">
              <Link to="/support" className="btn btn-primary">
                Ask about creator access
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* WHAT KUNTIPS IS */}
      <section className="card home-section home-section-center">
        <h2>What KunTips is (and isn’t)</h2>
        <p>
          KunTips is a tiny layer between fans and creators: one-time tips in,
          payouts out. We don’t host creator content, run subscriptions, or
          manage paywalled media. You keep using the platforms you already have
          — we simply give fans a clean way to say “thanks”.
        </p>
      </section>

      {/* SECURITY & PRIVACY */}
      <section className="card home-section">
        <h2>Security, privacy and compliance</h2>
        <div className="home-grid">
          <div className="home-tile">
            <h3>Stripe handles payments</h3>
            <p>
              KunTips never sees your full card or bank details. All sensitive
              payment data is processed and stored by Stripe, a PCI-compliant
              global payments provider.
            </p>
          </div>
          <div className="home-tile">
            <h3>Anonymous, not lawless</h3>
            <p>
              Fans and creators are anonymous to each other, but the platform is
              not a free-for-all. In serious cases like fraud, abuse or criminal
              investigations, KunTips and Stripe can cooperate with law
              enforcement and our payment partners where legally required.
            </p>
          </div>
          <div className="home-tile">
            <h3>No data resale, no ads</h3>
            <p>
              We don&apos;t sell your data or use it for advertising profiles.
              Data is used only to run KunTips, prevent fraud, and meet legal
              obligations — not to build ad networks or social graphs.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CALL */}
      <section className="card home-section home-section-last">
        <h2>See KunTips from a fan’s point of view</h2>
        <p>
          Want to experience the flow yourself? Open our example creator page,
          adjust the tip amount, and see exactly what fans will see before they
          pay.
        </p>
        <p>
          <Link to="/u/testcreator" className="btn btn-primary">
            Open example tip page
          </Link>
        </p>
      </section>
    </main>
  );
}
