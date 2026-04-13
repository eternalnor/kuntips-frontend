import { Link } from "react-router-dom";
import CreatorSearch from "../components/CreatorSearch.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";

export default function FansPage() {
  usePageTitle('Send a tip to your favourite creator', "Support creators with a private one-time tip. No account, no sign-up, no VAT. Pay securely with Stripe and the creator keeps 95\u2013100%.");
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
              Creators keep 95–100% of your tip, and you never need an account.
            </p>
            <div className="fans-search-wrap">
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
        <h2>Why fans love KunTips</h2>
        <div className="home-grid">
          <div className="home-tile">
            <h3>Private by default</h3>
            <p>
              Creators never see your payment details. Optionally leave your
              name, or tip completely anonymously.
            </p>
          </div>
          <div className="home-tile">
            <h3>No account required</h3>
            <p>
              No sign-up, no login. Just pick an amount and pay with your card
              through Stripe.
            </p>
          </div>
          <div className="home-tile">
            <h3>No VAT on tips</h3>
            <p>
              Tips aren't purchases, so there's no 25% MVA added. More of your
              money goes directly to the creator.
            </p>
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
              kuntips.no/theirname. Click it and you're taken straight to
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

      <section className="card home-section home-section-last">
        <h2>Are you a creator?</h2>
        <p>
          Set up a KunTips page in minutes. Connect Stripe once, share your
          link, and let fans support you — no platform fees eating into every
          tip.
        </p>
        <div className="home-hero-actions">
          <Link to="/creators/register" className="btn btn-primary">
            Create a creator account
          </Link>
          <Link to="/creators" className="btn btn-ghost">
            Learn more →
          </Link>
        </div>
      </section>

    </main>
  );
}
