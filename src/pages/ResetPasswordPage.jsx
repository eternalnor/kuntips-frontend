import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { resetPassword } from "../api";
import { isStrongPassword, PASSWORD_ERROR, PasswordChecklist } from "../utils/passwordUtils.jsx";

function ResetPasswordPage() {
  usePageTitle("Nytt passord");
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
      errs.newPassword = "Skriv inn et nytt passord.";
    } else if (!isStrongPassword(newPassword)) {
      errs.newPassword = PASSWORD_ERROR;
    }
    if (!confirmPassword) {
      errs.confirmPassword = "Bekreft passordet.";
    } else if (newPassword !== confirmPassword) {
      errs.confirmPassword = "Passordene er ikke like.";
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
          "Vi fikk ikke tilbakestilt passordet. Linken kan ha utløpt.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="creators-page">
        <section className="card creators-profile-card">
          <h1>Ugyldig link</h1>
          <p className="creators-subtext">
            Denne linken for tilbakestilling av passord er ugyldig eller har utløpt.
          </p>
          <p className="creators-small" style={{ marginTop: "1rem" }}>
            <Link to="/creators/forgot-password">Be om en ny link</Link>
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
            <h1>Passordet er tilbakestilt</h1>
            <p className="creators-subtext">
              Passordet ditt er oppdatert. Du kan nå logge inn med det nye
              passordet.
            </p>
            <div
              className="creators-profile-actions"
              style={{ marginTop: "1.5rem" }}
            >
              <Link to="/creators/login" className="btn btn-primary">
                Logg inn
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1>Tilbakestill passordet ditt</h1>
            <p className="creators-subtext">Velg et nytt passord nedenfor.</p>

            <form className="creators-profile-form" onSubmit={handleSubmit}>
              <div className="form-field creators-form-group">
                <label className="creators-label" htmlFor="newPassword">
                  Nytt passord
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
                  Bekreft nytt passord
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
                  {submitting ? "Tilbakestiller…" : "Tilbakestill passord"}
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
