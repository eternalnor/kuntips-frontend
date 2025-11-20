import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <main className="home-page">
      {/* HERO */}
      <section className="card home-hero">
        <div className="home-hero-main">
          <div className="home-hero-text">

            <h1>Support your favorites. Stay anonymous.</h1>
            <p className="home-hero-sub">
              KunTips lets fans send tips to creators safely and discreetly.
              Tips never reveal who you are, and creators only share the
              information they choose on their profile. Card and bank details
              are handled by CCBill – not by KunTips.
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
              Simple, secure and discreet by design.
            </p>

          </div>

          {/* Simple visual card / mock */}
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
                  <span>$25.00</span>
                </div>
                <div className="home-hero-card-row">
                  <span>Creator keeps</span>
                  <span>≈ 90–95%</span>
                </div>
                <div className="home-hero-card-row home-hero-card-muted">
                  <span>Processor fee</span>
                  <span>Handled by CCBill</span>
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
            <h3>1. Fans tip anonymously</h3>
            <p>
              Fans choose a tip amount and complete the payment with CCBill.
              They don&apos;t need an account with KunTips, and their identity
              is never shown to the creator.
            </p>
          </div>
          <div className="home-tile">
            <h3>2. Creators keep most of it</h3>
            <p>
              KunTips is built to be fair. Our fee starts low and gets even
              better as monthly tips increase, so active creators can keep up to
              95% of the intended tip amount.
            </p>
          </div>
          <div className="home-tile">
            <h3>3. Safe and discreet</h3>
            <p>
              KunTips never stores card or bank details. All sensitive payment
              data lives with CCBill, a PCI-compliant provider with decades of
              experience in online payments.
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
              just one-off support when you feel like it.
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
              Add a simple KunTips link to your profiles and let fans support
              you directly. You decide what to show on your page – we quietly
              take care of the payment side in the background.
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

      {/* SECURITY & PRIVACY */}
      <section className="card home-section">
        <h2>Security, privacy and compliance</h2>
        <div className="home-grid">
          <div className="home-tile">
            <h3>CCBill handles payments</h3>
            <p>
              KunTips never sees your full card or bank details. All sensitive
              payment data is processed and stored by CCBill, a PCI-compliant
              specialist in high-risk and adult-friendly payments.
            </p>
          </div>
          <div className="home-tile">
            <h3>Anonymous, not lawless</h3>
            <p>
              Fans and creators are anonymous to each other, but the platform is
              not a free-for-all. In serious cases like fraud, abuse or criminal
              investigations, KunTips and CCBill can cooperate with law
              enforcement when required by law.
            </p>
          </div>
          <div className="home-tile">
            <h3>No data resale, no ads</h3>
            <p>
              We don&apos;t sell your data or use it for advertising profiles.
              Data is used only to run KunTips, prevent fraud, and meet legal
              obligations.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CALL */}
      <section className="card home-section home-section-last">
        <h2>See KunTips in action</h2>
        <p>
          Want to see what a public creator tip page looks like from a fan&apos;s
          point of view? Open our example profile and preview the tipping flow.
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
