// CreatorLogin.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginCreator } from "./api";

function CreatorLogin() {
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
          "Could not log in. Please check your details and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="creators-page">
      <header className="creators-dashboard-header">
        <h1>Creator login</h1>
        <p className="creators-subtext">
          Log in with your KunTips creator email and password to access your
          dashboard.
        </p>
      </header>

      {typeof window !== "undefined" &&
        window.localStorage &&
        window.localStorage.getItem("kuntips_creator_username") && (
          <section className="card creators-status creators-status-info">
            <p>
              You’re already logged in as{" "}
              <span className="creators-username-tag">
                {window.localStorage.getItem("kuntips_creator_username")}
              </span>
              .
            </p>
            <p className="creators-small">
              Go straight to your{" "}
              <Link
                to={`/creators/dashboard?username=${encodeURIComponent(
                  window.localStorage.getItem("kuntips_creator_username"),
                )}`}
              >
                creator dashboard
              </Link>
              .
            </p>
          </section>
        )}

      <section className="card creators-profile-card">
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

          <div className="form-field creators-form-group">
            <label className="creators-label" htmlFor="password">
              Password
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
              {submitting ? "Logging in…" : "Log in"}
            </button>
          </div>
        </form>

        <p className="creators-small creators-profile-note">
          If you haven’t finished your creator onboarding yet, start here:{" "}
          <Link to="/creators/start">KunTips creator onboarding</Link>.
        </p>
      </section>

      <p className="creators-backlink">
        <Link to="/creators">← Back to creator information</Link>
      </p>
    </div>
  );
}

export default CreatorLogin;
