import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerCreator } from "./api";

function CreatorsRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    username: "",
    displayName: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: null }));
    setGlobalError(null);
  }

  function isStrongPassword(password) {
    if (!password || password.length < 8) return false;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasDigit = /\d/.test(password);
    return hasLetter && hasDigit;
  }

  function validateClientSide() {
    const nextErrors = {};

    const email = form.email.trim();
    const username = form.username.trim().toLowerCase();
    const displayName = form.displayName.trim();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    if (!email) {
      nextErrors.email = "Please enter your email.";
    } else if (!email.includes("@") || !email.includes(".")) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!username) {
      nextErrors.username = "Please choose a username.";
    } else if (username.length < 3 || username.length > 32) {
      nextErrors.username = "Username must be 3–32 characters.";
    } else if (!/^[a-z0-9_]+$/.test(username)) {
      nextErrors.username =
        "Use only lowercase letters, numbers and underscores.";
    }

    if (!displayName) {
      nextErrors.displayName = "Please enter a display name.";
    }

    if (!password) {
      nextErrors.password = "Please choose a password.";
    } else if (!isStrongPassword(password)) {
      nextErrors.password =
        "Password must be at least 8 characters and include at least one letter and one number.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (!form.agreeTerms) {
      nextErrors.agreeTerms =
        "You must confirm that you’re 18+ and accept the Creator Agreement and Terms.";
    }

    return nextErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    const clientErrors = validateClientSide();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    setGlobalError(null);

    try {
      const payload = {
        email: form.email.trim(),
        username: form.username.trim().toLowerCase(),
        displayName: form.displayName.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        agreeTerms: form.agreeTerms,
      };

      const data = await registerCreator(payload);

      // Store username/email for later convenience (mirrors CreatorLogin.jsx)
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(
          "kuntips_creator_username",
          data.creator.username,
        );
        window.localStorage.setItem(
          "kuntips_creator_email",
          data.creator.email || payload.email,
        );
      }

      const username = data.creator.username;
      navigate(`/creators/dashboard?username=${encodeURIComponent(username)}`);


    } catch (err) {
      console.error("Registration failed:", err);

      const mapped = {};
      const serverFieldErrors = err.data?.fieldErrors || {};
      const message = err.data?.message || "";

      // 1) Map structured fieldErrors if backend ever adds them
      if (serverFieldErrors.email === "invalid_email") {
        mapped.email = "Please enter a valid email address.";
      }
      if (serverFieldErrors.username === "invalid_username_length") {
        mapped.username = "Username must be 3–32 characters.";
      }
      if (serverFieldErrors.username === "invalid_username_chars") {
        mapped.username =
          "Use only lowercase letters, numbers and underscores.";
      }
      if (serverFieldErrors.password === "password_too_weak") {
        mapped.password =
          "Password must be at least 8 characters and include at least one letter and one number.";
      }
      if (serverFieldErrors.confirmPassword === "password_mismatch") {
        mapped.confirmPassword = "Passwords do not match.";
      }
      if (serverFieldErrors.agreeTerms === "terms_required") {
        mapped.agreeTerms =
          "You must confirm that you’re 18+ and accept the Creator Agreement and Terms.";
      }

      // 2) Map our current backend messages (status + message)
      if (err.status === 409) {
        if (message.toLowerCase().includes("email is already in use")) {
          mapped.email = "This email is already registered.";
        } else if (message.toLowerCase().includes("username is already taken")) {
          mapped.username = "This username is already taken.";
        }
      }

      if (err.status === 400) {
        if (message.toLowerCase().includes("valid email address")) {
          mapped.email = "Please enter a valid email address.";
        } else if (message.toLowerCase().includes("username must be 3–32")) {
          mapped.username = "Username must be 3–32 characters.";
        } else if (
          message.toLowerCase().includes("must be at least 8 characters") ||
          message.toLowerCase().includes("must contain at least one letter")
        ) {
          mapped.password =
            "Password must be at least 8 characters and include at least one letter and one number.";
        }
      }

      setErrors(mapped);

      if (!Object.keys(mapped).length) {
        setGlobalError(
          err.data?.message ||
            err.message ||
            "Could not create account. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="creators-page">
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
        <h1>Create your KunTips creator account</h1>
        <p className="creators-subtext">
          Register once, connect Stripe, and get a clean /u/&lt;username&gt; tip
          page you can share everywhere.
        </p>

        <form className="creators-profile-form" onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="form-field creators-form-group">
            <label className="creators-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input creators-input"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && (
              <p className="creators-error-inline">{errors.email}</p>
            )}
          </div>

          {/* USERNAME */}
          <div className="form-field creators-form-group">
            <label className="creators-label" htmlFor="username">
              Creator username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-input creators-input"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />
            <p className="creators-small">
              This becomes your public link: <code>/u/&lt;username&gt;</code>.
              Use only lowercase letters, numbers and underscores.
            </p>
            {errors.username && (
              <p className="creators-error-inline">{errors.username}</p>
            )}
          </div>

          {/* DISPLAY NAME */}
          <div className="form-field creators-form-group">
            <label className="creators-label" htmlFor="displayName">
              Display name
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              className="form-input creators-input"
              value={form.displayName}
              onChange={handleChange}
              autoComplete="name"
            />
            <p className="creators-small">
              Shown on your KunTips page and in your dashboard.
            </p>
            {errors.displayName && (
              <p className="creators-error-inline">{errors.displayName}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="form-field creators-form-group">
            <label className="creators-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input creators-input"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <p className="creators-small">
              At least 8 characters, with at least one letter and one number.
            </p>
            {errors.password && (
              <p className="creators-error-inline">{errors.password}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="form-field creators-form-group">
            <label className="creators-label" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="form-input creators-input"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="creators-error-inline">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* TERMS */}
          <div className="form-field creators-form-group creators-form-group--checkbox">
            <label className="creators-checkbox-label">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={form.agreeTerms}
                onChange={handleChange}
              />
              <span>
                I confirm that I am 18+ and I accept the{" "}
                <Link to="/legal/creator-agreement">
                  Creator Agreement
                </Link>{" "}
                and{" "}
                <Link to="/legal/terms">
                  Terms of Service
                </Link>
                .
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="creators-error-inline">{errors.agreeTerms}</p>
            )}
          </div>

          {globalError && (
            <p className="creators-error-inline">{globalError}</p>
          )}

          <div className="creators-profile-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </div>
        </form>

        <p className="creators-small creators-profile-note">
          Already have a KunTips creator account?{" "}
          <Link to="/creators/login">Log in here</Link>.
        </p>
      </section>

      <p className="creators-backlink">
        <Link to="/creators">← Back to creator information</Link>
      </p>
    </div>
  );
}

export default CreatorsRegister;
