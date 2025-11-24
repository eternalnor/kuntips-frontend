import { useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function CreatorsStart() {
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState(null);

  async function handleConnectStripe() {
    if (isStarting) return;

    setIsStarting(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/connect/create-account-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // TEMP: hard-coded test creator while we’re in dev.
            // Later this will come from a logged-in creator.
            username: "testcreator1",
            displayName: "Test Creator 1",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to start Stripe onboarding.",
        );
      }

      if (!data?.url || typeof data.url !== "string") {
        throw new Error("Backend did not return a redirect URL.");
      }

      // Hand off to Stripe Connect onboarding
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setError(
        err?.message ||
          "Something went wrong starting the Stripe onboarding flow.",
      );
      setIsStarting(false);
    }
  }

  return (
    <div className="creators-page">
      <section className="card creators-start">
        <h1>Get ready to connect Stripe</h1>
        <p>
          When KunTips goes live, creators will onboard through Stripe Connect.
          For now, this page walks you through what you&apos;ll need and lets
          you try the flow in test mode.
        </p>

        <div className="creators-columns">
          <div className="creators-column">
            <h2>You&apos;ll need</h2>
            <ul className="creators-list">
              <li>
                A Stripe account (created during onboarding if you don&apos;t
                have one).
              </li>
              <li>
                Basic identity info required by Stripe (name, address, bank
                details).
              </li>
              <li>A creator alias and short bio for your KunTips page.</li>
            </ul>
          </div>

          <div className="creators-column">
            <h2>What happens</h2>
            <ul className="creators-list">
              <li>You are redirected to Stripe&apos;s secure onboarding flow.</li>
              <li>
                After onboarding, you&apos;re sent back to KunTips and your tip
                page is activated.
              </li>
              <li>
                Fans can now send tips; Stripe handles KYC and payouts to you.
              </li>
            </ul>
          </div>
        </div>

        <div className="creators-cta-row">
          <button
            className="btn-primary"
            onClick={handleConnectStripe}
            disabled={isStarting}
          >
            {isStarting ? "Opening Stripe…" : "Connect Stripe (test mode)"}
          </button>

          <p className="creators-small">
            You&apos;ll be redirected to Stripe to complete onboarding, then
            sent back to KunTips.
          </p>

          {error && <p className="creators-error">{error}</p>}

          {import.meta.env.DEV && (
            <p className="creators-dev-note">
              Dev only: if the redirect fails, you can{" "}
              <a
                href="https://kuntips-backend.eternalnor.workers.dev/connect/create-account-link"
                target="_blank"
                rel="noreferrer"
              >
                open the raw onboarding link
              </a>{" "}
              to debug.
            </p>
          )}
        </div>

        <p className="creators-backlink">
          <Link to="/creators">← Back to information page</Link>
        </p>
      </section>
    </div>
  );
}

export default CreatorsStart;
