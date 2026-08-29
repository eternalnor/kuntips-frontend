// CreatorLogin.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginCreator } from "./api";
import { usePageTitle } from "./hooks/usePageTitle.js";

function CreatorLogin() {
  usePageTitle('Logg inn');
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const data = await loginCreator(email, password);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "kuntips_creator_session",
          data.sessionToken,
        );
        window.localStorage.setItem(
          "kuntips_creator_username",
          data.creator.username,
        );
        window.localStorage.setItem(
          "kuntips_creator_email",
          data.creator.email || email,
        );
        // Notify SiteHeader to update immediately (same-tab)
        window.dispatchEvent(new Event("kuntips-auth-change"));
      }

      const username = data.creator.username;
      navigate(
        `/creators/dashboard?username=${encodeURIComponent(username)}`,
      );
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err.data?.message ||
          err.message ||
          "Vi fikk ikke logget deg inn. Sjekk opplysningene og prøv igjen.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="creators-page">
      <div className="creators-page-header">
        <h1>Logg inn</h1>
        <p className="creators-subtext">
          Logg inn med e-postadressen og passordet ditt.
        </p>
      </div>

      {typeof window !== "undefined" &&
        window.localStorage &&
        window.localStorage.getItem("kuntips_creator_username") && (
          <section className="card creators-status creators-status-info">
            <p>
              Du er allerede logget inn som{" "}
              <span className="creators-username-tag">
                {window.localStorage.getItem("kuntips_creator_username")}
              </span>
              .
            </p>
            <p className="creators-small">
              Gå rett til{" "}
              <Link
                to={`/creators/dashboard?username=${encodeURIComponent(
                  window.localStorage.getItem("kuntips_creator_username"),
                )}`}
              >
                oversikten din
              </Link>
              .
            </p>
          </section>
        )}

      <section className="card creators-profile-card">
        <form className="creators-profile-form" onSubmit={handleSubmit}>
          <div className="form-field creators-form-group">
            <label className="creators-label" htmlFor="email">
              E-post
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

          <div className="form-field creators-form-group">
            <label className="creators-label" htmlFor="password">
              Passord
            </label>
            <input
              id="password"
              type="password"
              className="form-input creators-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="creators-error-inline creators-login-error">
              {error}
            </p>
          )}

          <div className="creators-profile-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !email || !password}
            >
              {submitting ? "Logger inn…" : "Logg inn"}
            </button>
          </div>

          <p className="creators-small" style={{ marginTop: "0.75rem", textAlign: "center" }}>
            <Link to="/creators/forgot-password">Glemt passordet?</Link>
          </p>
        </form>

        <p className="creators-small creators-profile-note">
          Har du ikke fullført oppsettet ennå, starter du her:{" "}
          <Link to="/creators/start">kom i gang</Link>.
        </p>
      </section>

      <p className="creators-backlink">
        <Link to="/creators">← Tilbake til informasjon for skapere</Link>
      </p>
    </div>
  );
}

export default CreatorLogin;
