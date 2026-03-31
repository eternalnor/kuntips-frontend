import { Link } from "react-router-dom";

export default function FansPage() {
  return (
    <main className="home-page">
      <section className="card home-hero">
        <div className="home-hero-main">
          <div className="home-hero-text">
            <h1>Send a tip — no account, no fuss.</h1>
            <p className="home-hero-sub">
              KunTips lets you support your favourite creators with a one-time
              tip. No sign-up, no subscription, no personal details shared with
              the creator — just a clean, private payment powered by Stripe.
            </p>
            <div className="home-hero-actions">
              <Link to="/u/testcreator1" className="btn btn-primary">
                Try the example tip page
              </Link>
              <Link to="/home" className="btn btn-ghost">
                How it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="card home-section">
        <h2>How tipping works</h2>
        <div className="home-grid">
          <div className="home-tile">
            <h3>1. Open a creator's link</h3>
            <p>
              Creators share a personal KunTips link — something like
              kuntips.no/u/theirname. Click it and you're taken straight to
              their tip page.
            </p>
          </div>
          <div className="home-tile">
            <h3>2. Pick an amount</h3>
            <p>
              Choose a preset amount or enter your own between 100 and 2,000
              NOK. You'll see exactly what the creator receives before you
              confirm.
            </p>
          </div>
          <div className="home-tile">
            <h3>3. Pay securely with Stripe</h3>
            <p>
              Enter your card details in Stripe's secure payment form. KunTips
              never sees your card number — and neither does the creator.
            </p>
          </div>
        </div>
      </section>

      <section className="card home-section">
        <h2>Your privacy is protected</h2>
        <div className="home-grid home-grid-two">
          <div className="home-tile">
            <h3>Private by default</h3>
            <p>
              Creators only see that a tip was received — they never see your
              payment details. You can optionally leave your name if you want
              the creator to know it was from you, but there's no pressure to
              do so. No public donor list, no follow-up messages.
            </p>
          </div>
          <div className="home-tile">
            <h3>No KunTips account required</h3>
            <p>
              You do not need to create an account or log in. Stripe collects
              the payment details required to process your tip, but that data
              stays with Stripe — KunTips never stores your card number.
            </p>
          </div>
        </div>
      </section>

      <section className="card home-section home-section-last">
        <h2>Ready to try it?</h2>
        <p>
          Open the example tip page to see exactly what fans see — choose an
          amount and walk through the full payment flow before sending a real
          tip.
        </p>
        <p>
          <Link to="/u/testcreator1" className="btn btn-primary">
            Open example tip page
          </Link>
        </p>
      </section>
    </main>
  );
}
