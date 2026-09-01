import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { registerCreator } from "./api";
import { hasMarketingConsent } from "./consent.js";
import { getActiveReferral, clearReferral } from "./referral.js";
import { usePageTitle } from "./hooks/usePageTitle.js";
import { passwordRequirements, isStrongPassword, PASSWORD_ERROR, PasswordChecklist } from "./utils/passwordUtils.jsx";

function CreatorsRegister() {
  usePageTitle('Opprett konto');
  const location = useLocation();
  const navigate = useNavigate();

  // ?ref= if it's on this URL, otherwise whatever was captured earlier in the
  // visit — someone who landed on kuntips.no/?ref=CODE and browsed before
  // signing up still gets attributed. Backend compares codes case-insensitively.
  const referralUsernameFromUrl = (getActiveReferral(location.search) || "")
    .trim()
    .toLowerCase();

  const [form, setForm] = useState({
    email: "",
    username: "",
    displayName: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    // Optional: username of the creator who referred this user.
    // Pre-filled from ?ref= in the URL if present.
    referralUsername: referralUsernameFromUrl,
  });
  // Keep referralUsername in sync with ?ref= in the URL on first load / changes,
  // but don't overwrite if the user has already typed something else.
  useEffect(() => {
    if (!referralUsernameFromUrl) return;
    setForm((prev) => {
      if (prev.referralUsername) return prev; // user already filled it
      return { ...prev, referralUsername: referralUsernameFromUrl };
    });
  }, [referralUsernameFromUrl]);


  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: null }));
    setGlobalError(null);
  }


  function validateClientSide() {
    const nextErrors = {};

    const email = form.email.trim();
    const username = form.username.trim().toLowerCase();
    const displayName = form.displayName.trim();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    if (!email) {
      nextErrors.email = "Skriv inn e-postadressen din.";
    } else if (!email.includes("@") || !email.includes(".")) {
      nextErrors.email = "Skriv inn en gyldig e-postadresse.";
    }

    if (!username) {
      nextErrors.username = "Velg et brukernavn.";
    } else if (username.length < 3 || username.length > 32) {
      nextErrors.username = "Brukernavnet må være 3–32 tegn.";
    } else if (!/^[a-z0-9_]+$/.test(username)) {
      nextErrors.username =
        "Bruk bare små bokstaver, tall og understrek.";
    }

    if (!displayName) {
      nextErrors.displayName = "Skriv inn et visningsnavn.";
    }

    if (!password) {
      nextErrors.password = "Velg et passord.";
    } else if (!isStrongPassword(password)) {
      nextErrors.password =
        PASSWORD_ERROR;
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Bekreft passordet.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passordene er ikke like.";
    }

    if (!form.agreeTerms) {
      nextErrors.agreeTerms =
        "Du må bekrefte at du er over 18 år og godta skaperavtalen og vilkårene.";
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
      // Shared event id lets the server-side Lead dedupe against the client one.
      const marketingConsent = hasMarketingConsent();
      const eventId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `lead_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

      const payload = {
        email: form.email.trim(),
        username: form.username.trim().toLowerCase(),
        displayName: form.displayName.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        agreeTerms: form.agreeTerms,
        // Send the optional referrer username to the backend
        referralCode: form.referralUsername.trim() || null,
        // Consent + event id for server-side conversion tracking (Meta/TikTok)
        marketingConsent,
        eventId,
      };

      const data = await registerCreator(payload);

      // Consumed. Without this the code would sit in storage and get credited
      // again if this browser ever registered a second account.
      clearReferral();

      // Fire client-side Lead (consent-gated), deduped with server by eventId.
      if (marketingConsent) {
        try {
          if (window.fbq) {
            window.fbq("track", "Lead", {}, { eventID: eventId });
          }
          if (window.ttq) {
            window.ttq.track("CompleteRegistration", {}, { event_id: eventId });
          }
        } catch {
          // never block signup on tracking
        }
      }

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
        window.dispatchEvent(new Event("kuntips-auth-change"));
      }

      setRegisteredEmail(form.email.trim());
      setRegistered(true);


    } catch (err) {
      console.error("Registration failed:", err);

      const mapped = {};
      const serverFieldErrors = err.data?.fieldErrors || {};
      const message = err.data?.message || "";

      // 1) Map structured fieldErrors if backend ever adds them
      if (serverFieldErrors.email === "invalid_email") {
        mapped.email = "Skriv inn en gyldig e-postadresse.";
      }
      if (serverFieldErrors.username === "invalid_username_length") {
        mapped.username = "Brukernavnet må være 3–32 tegn.";
      }
      if (serverFieldErrors.username === "invalid_username_chars") {
        mapped.username =
          "Bruk bare små bokstaver, tall og understrek.";
      }
      if (serverFieldErrors.password === "password_too_weak") {
        mapped.password =
          PASSWORD_ERROR;
      }
      if (serverFieldErrors.confirmPassword === "password_mismatch") {
        mapped.confirmPassword = "Passordene er ikke like.";
      }
      if (serverFieldErrors.agreeTerms === "terms_required") {
        mapped.agreeTerms =
          "Du må bekrefte at du er over 18 år og godta skaperavtalen og vilkårene.";
      }

      // 2) Map our current backend messages (status + message)
      if (err.status === 409) {
        if (message.toLowerCase().includes("email is already in use")) {
          mapped.email = "Denne e-postadressen er allerede registrert.";
        } else if (message.toLowerCase().includes("username is already taken")) {
          mapped.username = "Dette brukernavnet er opptatt.";
        }
      }

      if (err.status === 400) {
        if (message.toLowerCase().includes("valid email address")) {
          mapped.email = "Skriv inn en gyldig e-postadresse.";
        } else if (message.toLowerCase().includes("username must be 3–32")) {
          mapped.username = "Brukernavnet må være 3–32 tegn.";
        } else if (
          message.toLowerCase().includes("must be at least 8 characters") ||
          message.toLowerCase().includes("must contain at least one letter")
        ) {
          mapped.password =
            PASSWORD_ERROR;
        }
      }

      setErrors(mapped);

      if (!Object.keys(mapped).length) {
        setGlobalError(
          err.data?.message ||
            err.message ||
            "Vi fikk ikke opprettet kontoen. Vennligst prøv igjen.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (registered) {
    return (
      <div className="creators-page">
        <section className="card creators-profile-card">
          <h1>Sjekk e-posten din</h1>
          <p className="creators-subtext">
            Vi har sendt en bekreftelseslink til <strong>{registeredEmail}</strong>.
          </p>
          <p className="creators-small">
            Trykk på linken i e-posten for å bekrefte kontoen. Du kommer inn i oversikten uansett, men e-posten må være bekreftet før du kan koble til Stripe og få utbetalinger.
          </p>
          <div className="creators-profile-actions" style={{ marginTop: "1.5rem" }}>
            <Link
              to={`/creators/dashboard?username=${encodeURIComponent(
                typeof window !== "undefined"
                  ? window.localStorage.getItem("kuntips_creator_username") || ""
                  : ""
              )}`}
              className="btn btn-primary"
            >
              Gå til oversikten
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="creators-page">
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
        <h1>Opprett din KunTips-konto</h1>
        <p className="creators-subtext">
          Registrer deg, koble til Stripe og få din egen side på kuntips.no/«ditt brukernavn» som du kan dele overalt.
        </p>
        <p className="creators-small">
          For skapere i Norge: utbetaling krever norsk bankkonto og
          Stripe-verifisering med norsk adresse.
        </p>

        <form className="creators-profile-form" onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="form-field creators-form-group">
            <label className="creators-label" htmlFor="email">
              E-post
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
              Brukernavn
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
              Dette blir den offentlige linken din: <code>kuntips.no/&lt;brukernavn&gt;</code>.
              Bruk bare små bokstaver, tall og understrek.
            </p>
            {errors.username && (
              <p className="creators-error-inline">{errors.username}</p>
            )}
          </div>

          {/* DISPLAY NAME */}
          <div className="form-field creators-form-group">
            <label className="creators-label" htmlFor="displayName">
              Visningsnavn
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
              Vises på KunTips-siden din og i oversikten.
            </p>
            {errors.displayName && (
              <p className="creators-error-inline">{errors.displayName}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="form-field creators-form-group">
            <label className="creators-label" htmlFor="password">
              Passord
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
            <PasswordChecklist password={form.password} />
            {errors.password && (
              <p className="creators-error-inline">{errors.password}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="form-field creators-form-group">
            <label className="creators-label" htmlFor="confirmPassword">
              Bekreft passord
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

          {/* REFERRAL USERNAME (OPTIONAL) */}
          <div className="form-field creators-form-group">
            <label className="creators-label" htmlFor="referralUsername">
              Vervekode (valgfritt)
            </label>
            <input
              id="referralUsername"
              name="referralUsername"
              type="text"
              className="form-input creators-input"
              value={form.referralUsername}
              onChange={handleChange}
            />
            <p className="creators-small">
              Har en annen skaper vervet deg, skriver du inn brukernavnet deres her, så får de vervekreditt.
            </p>
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
                Jeg bekrefter at jeg er over 18 år, og godtar{" "}
                <Link to="/legal/creator-agreement">
                  skaperavtalen
                </Link>{" "}
                og{" "}
                <Link to="/legal/terms">
                  vilkårene
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
              {submitting ? "Oppretter konto…" : "Opprett konto"}
            </button>
          </div>
        </form>

        <p className="creators-small creators-profile-note">
          Already have a KunTips creator account?{" "}
          <Link to="/creators/login">Logg inn her</Link>.
        </p>
      </section>

      <p className="creators-backlink">
        <Link to="/creators">← Tilbake til informasjon for skapere</Link>
      </p>
    </div>
  );
}

export default CreatorsRegister;
