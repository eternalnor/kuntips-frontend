import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { verifyEmail } from "../api";

function VerifyEmailPage() {
  usePageTitle("Verify email");
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token") || "";

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  const storedUsername =
    typeof window !== "undefined"
      ? window.localStorage.getItem("kuntips_creator_username")
      : null;
  const dashboardUrl = storedUsername
    ? `/creators/dashboard?username=${encodeURIComponent(storedUsername)}`
    : "/creators/login";

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
              Your email address has been verified. You can now connect Stripe
              and start receiving tips.
            </p>
            <div
              className="creators-profile-actions"
              style={{ marginTop: "1.5rem" }}
            >
              <Link to={dashboardUrl} className="btn btn-primary">
                Go to dashboard
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <h1>Verification failed</h1>
            <p className="creators-subtext">{message}</p>
            <p className="creators-small" style={{ marginTop: "1rem" }}>
              <Link to={dashboardUrl}>Go to dashboard</Link> to request a new
              verification email.
            </p>
          </>
        )}
      </section>
    </div>
  );
}

export default VerifyEmailPage;
