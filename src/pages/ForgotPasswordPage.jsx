import { useState } from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { forgotPassword } from "../api";

function ForgotPasswordPage() {
  usePageTitle("Forgot password");

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      await forgotPassword(email.trim());
      setSubmitted(true);
    } catch (err) {
      // Even on error, show the generic message to avoid leaking info
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="creators-page">
      <section className="card creators-profile-card">
        {submitted ? (
          <>
            <h1>Check your email</h1>
            <p className="creators-subtext">
              If <strong>{email}</strong> is registered, you&apos;ll receive a
              password reset link shortly. Check your inbox (and spam folder).
            </p>
            <p className="creators-small" style={{ marginTop: "1rem" }}>
              <Link to="/creators/login">Back to login</Link>
            </p>
          </>
        ) : (
          <>
            <h1>Forgot password</h1>
            <p className="creators-subtext">
              Enter your email address and we&apos;ll send you a link to reset your
              password.
            </p>

            <form className="creators-profile-form" onSubmit={handleSubmit}>
              <div className="form-field creators-form-group">
                <label className="creators-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input creators-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              {error && (
                <p className="creators-error-inline">{error}</p>
              )}

              <div className="creators-profile-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting || !email}
                >
                  {submitting ? "Sending…" : "Send reset link"}
                </button>
              </div>
            </form>

            <p className="creators-small creators-profile-note">
              <Link to="/creators/login">Back to login</Link>
            </p>
          </>
        )}
      </section>
    </div>
  );
}

export default ForgotPasswordPage;
