import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { verifyEmail, createStripeAccountLink, getSessionToken } from "../api";

function VerifyEmailPage() {
  usePageTitle("Bekreft e-post");
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
        "Mangler verifiseringskode. Vennligst sjekk linken i e-posten du fikk.",
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
            "Verifiseringen mislyktes. Linken kan ha utløpt.",
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
      setStripeError("Vi fikk ikke åpnet Stripe. Vennligst prøv igjen.");
    } catch (err) {
      setStripeError(
        err.data?.message || err.message || "Vi fikk ikke åpnet Stripe. Vennligst prøv igjen.",
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
            <h1>Bekrefter e-postadressen din&hellip;</h1>
            <p className="creators-subtext">Vennligst vent…</p>
          </>
        )}

        {status === "success" && (
          <>
            <h1>E-postadressen er bekreftet</h1>
            <p className="creators-subtext">
              Ett steg gjenstår: koble til Stripe, slik at du kan ta imot tips. Det tar rundt fem minutter.
            </p>
            <p className="creators-small" style={{ marginTop: "0.75rem" }}>
              Ha kontonummeret klart.
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
                  {stripeLoading ? "Åpner Stripe…" : "Koble til utbetaling"}
                </button>
              ) : (
                <Link to="/creators/login" className="btn btn-primary">
                  Logg inn for å fullføre oppsettet
                </Link>
              )}
            </div>

            {stripeError && (
              <p className="creators-error" style={{ marginTop: "0.75rem" }}>
                {stripeError}
              </p>
            )}

            <p className="creators-small" style={{ marginTop: "1rem" }}>
              <Link to={dashboardUrl}>Hopp over og gå til oversikten</Link>
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1>Verifisering mislyktes</h1>
            <p className="creators-subtext">{message}</p>
            <p className="creators-small" style={{ marginTop: "1rem" }}>
              Har du allerede bekreftet adressen, virker ikke linken en gang til. Da logger du bare inn som vanlig.
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
