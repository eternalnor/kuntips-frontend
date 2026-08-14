import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { verifyEmail, createStripeAccountLink, getSessionToken } from "../api";

function VerifyEmailPage() {
  usePageTitle("Verify email");
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token") || "";

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState(null);

  const storedUsername =
    typeof window !== "undefined"
      ? window.localStorage.getItem("kuntips_creator_username")
      : null;
  const dashboardUrl = storedUsername
    ? `/creators/dashboard?username=${encodeURIComponent(storedUsername)}`
    : "/creators/login";

  // Verification emails are very often opened on a different device than the
  // one used to register, so there may be no session here at all.
  const hasSession = typeof window !== "undefined" && !!getSessionToken();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage(
        "No verification token found. Please check the link in your email.",
      );
      return;
    }

    verifyEmail(token)
      .then(() => {
        setStatus("success");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.data?.message ||
            err.message ||
            "Verification failed. The link may have expired.",
        );
      });
  }, [token]);

  async function handleConnectStripe() {
    if (stripeLoading) return;
    setStripeLoading(true);
    setStripeError(null);
    try {
      const returnUrlPath = storedUsername
        ? `/creators/dashboard?username=${encodeURIComponent(storedUsername)}`
        : undefined;
      const data = await createStripeAccountLink(returnUrlPath);
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      setStripeError("Could not open Stripe. Please try again.");
    } catch (err) {
      setStripeError(
        err.data?.message || err.message || "Could not open Stripe. Please try again.",
      );
    } finally {
      setStripeLoading(false);
    }
  }

  return (
    <div className="creators-page">
      <section className="card creators-profile-card">
        {status === "loading" && (
          <>
            <h1>Verifying your email&hellip;</h1>
            <p className="creators-subtext">Please wait.</p>
          </>
        )}

        {status === "success" && (
          <>
            <h1>Email verified!</h1>
            <p className="creators-subtext">
              One step left: connect Stripe so you can actually receive tips.
              It takes about 5 minutes.
            </p>
            <p className="creators-small" style={{ marginTop: "0.75rem" }}>
              Have your ID and bank account number ready. You do <strong>not</strong>{" "}
              need an organisation number — you can register as a private
              individual.
            </p>

            <div
              className="creators-profile-actions"
              style={{ marginTop: "1.5rem" }}
            >
              {hasSession ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleConnectStripe}
                  disabled={stripeLoading}
                >
                  {stripeLoading ? "Opening Stripe…" : "Connect payouts — about 5 min"}
                </button>
              ) : (
                <Link to="/creators/login" className="btn btn-primary">
                  Log in to finish setup
                </Link>
              )}
            </div>

            {stripeError && (
              <p className="creators-error" style={{ marginTop: "0.75rem" }}>
                {stripeError}
              </p>
            )}

            <p className="creators-small" style={{ marginTop: "1rem" }}>
              <Link to={dashboardUrl}>Skip for now and go to the dashboard</Link>
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1>Verification failed</h1>
            <p className="creators-subtext">{message}</p>
            <p className="creators-small" style={{ marginTop: "1rem" }}>
              If you have already verified this address, the link simply
              won&rsquo;t work a second time — just log in as normal.
            </p>
            <div
              className="creators-profile-actions"
              style={{ marginTop: "1.25rem" }}
            >
              <Link to="/creators/login" className="btn btn-primary">
                Log in
              </Link>
              <Link to={dashboardUrl} className="btn btn-ghost">
                Go to dashboard
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default VerifyEmailPage;
