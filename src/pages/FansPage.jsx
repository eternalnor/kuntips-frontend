import { Link } from "react-router-dom";
import CreatorSearch from "../components/CreatorSearch.jsx";

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
              <Link to="/home" className="btn btn-ghost">
                How it works
              </Link>
            </div>
            <div style={{ marginTop: "1.25rem" }}>
              <CreatorSearch
                label="Know who you want to tip? Enter their username:"
                placeholder="username"
                buttonText="Go to tip page →"
              />
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
        <h2>Find a creator</h2>
        <p>
          If a creator has shared their KunTips link with you, you can also
          type their username directly below to go straight to their tip page.
        </p>
        <CreatorSearch placeholder="username" buttonText="Go to tip page →" />
      </section>
    </main>
  );
}
