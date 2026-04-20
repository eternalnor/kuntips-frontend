import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin, getAdminSessionToken } from "../../api/admin.js";
import { usePageTitle } from "../../hooks/usePageTitle.js";

export default function AdminLogin() {
  usePageTitle("Admin login");
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // If already logged in, redirect to overview
  useEffect(() => {
    if (getAdminSessionToken()) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await adminLogin(username.trim(), password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.data?.error || err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-login-stage">
      <div className="admin-login-card">
        <h1>Admin</h1>
        <p className="admin-login-sub">Restricted area.</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <label className="admin-field">
            <span>Username</span>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <label className="admin-field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="admin-login-error">{error}</p>}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? "Logging in\u2026" : "Log in"}
          </button>
        </form>
      </div>
    </main>
  );
}
