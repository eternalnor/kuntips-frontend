import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { resetPassword } from "../api";
import { isStrongPassword, PASSWORD_ERROR, PasswordChecklist } from "../utils/passwordUtils.jsx";

function ResetPasswordPage() {
  usePageTitle("Reset password");
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    const errs = {};
    if (!newPassword) {
      errs.newPassword = "Please enter a new password.";
    } else if (!isStrongPassword(newPassword)) {
      errs.newPassword = PASSWORD_ERROR;
    }
    if (!confirmPassword) {
      errs.confirmPassword = "Please confirm your password.";
    } else if (newPassword !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
    } catch (err) {
      setError(
        err.data?.message ||
          err.message ||
          "Could not reset password. The link may have expired.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="creators-page">
        <section className="card creators-profile-card">
          <h1>Invalid link</h1>
          <p className="creators-subtext">
            This password reset link is invalid or has expired.
          </p>
          <p className="creators-small" style={{ marginTop: "1rem" }}>
            <Link to="/creators/forgot-password">Request a new reset link</Link>
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="creators-page">
      <section className="card creators-profile-card">
        {success ? (
          <>
            <h1>Password reset!</h1>
            <p className="creators-subtext">
              Your password has been updated. You can now log in with your new
              password.
            </p>
            <div
              className="creators-profile-actions"
              style={{ marginTop: "1.5rem" }}
            >
              <Link to="/creators/login" className="btn btn-primary">
                Log in
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1>Reset your password</h1>
            <p className="creators-subtext">Choose a new password below.</p>

            <form className="creators-profile-form" onSubmit={handleSubmit}>
              <div className="form-field creators-form-group">
                <label className="creators-label" htmlFor="newPassword">
                  New password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  className="form-input creators-input"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, newPassword: null }));
                  }}
                  autoComplete="new-password"
                />
                <PasswordChecklist password={newPassword} />
                {fieldErrors.newPassword && (
                  <p className="creators-error-inline">
                    {fieldErrors.newPassword}
                  </p>
                )}
              </div>

              <div className="form-field creators-form-group">
                <label className="creators-label" htmlFor="confirmPassword">
                  Confirm new password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="form-input creators-input"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setFieldErrors((prev) => ({
                      ...prev,
                      confirmPassword: null,
                    }));
                  }}
                  autoComplete="new-password"
                />
                {fieldErrors.confirmPassword && (
                  <p className="creators-error-inline">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>

              {error && <p className="creators-error-inline">{error}</p>}

              <div className="creators-profile-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Resetting…" : "Reset password"}
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

export default ResetPasswordPage;
