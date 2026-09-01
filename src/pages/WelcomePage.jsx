import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import CreatorSearch from "../components/CreatorSearch.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { getActiveReferral } from "../referral.js";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

// Effort, risk, discretion — in that order. Deliberately NOT a fee/payout
// explainer: the numbers live in the fact line under the steps, and repeating
// them here in sentence form is what made this page read as padded.
const OBJECTIONS = [
  {
    q: "Må følgere lage egen konto for å tipse?",
    a: "Nei. De trykker på linken, velger beløp og betaler med kort – og kan tipse anonymt hvis de vil.",
  },
  {
    q: "Kan jeg bruke det ved siden av det jeg har?",
    a: "Ja. Du får en link – den kan ligge side om side med alt annet du allerede deler.",
  },
  {
    q: "Ser følgerne det ekte navnet mitt?",
    a: "Nei. De ser bare brukernavnet du velger selv.",
  },
];

const STEPS = [
  {
    t: "Opprett kontoen din",
    d: "Du velger brukernavn og får din egen side på kuntips.no.",
  },
  {
    t: "Koble til Stripe",
    d: "Én verifisering, så er utbetalingene klare. Rundt fem minutter.",
  },
  {
    t: "Del linken din",
    d: "I bio, i beskrivelsen, i en fastpinnet post – hvor du enn har dine følgere.",
  },
];

export default function WelcomePage() {
  usePageTitle(
    null,
    "Ta imot tips fra følgerne dine. Du beholder 95–100 % av hvert tips. Ingen månedsavgift, ingen binding, og tipsere trenger ingen konto. Utbetaling i kroner til norsk bankkonto.",
  );
  const [stats, setStats] = useState(null);
  const location = useLocation();

  // An invited visitor gets a 30-day boost on signup. Until now that was
  // invisible — the code silently pre-filled a field on the register form — so
  // people were being given an offer nobody told them about.
  const referral = getActiveReferral(location.search);
  const registerTo = referral
    ? `/creators/register?ref=${encodeURIComponent(referral)}`
    : "/creators/register";

  useEffect(() => {
    fetch(`${API_BASE_URL}/stats`)
      .then((r) => (r.ok ? r.json() : null))
      // Only show real traction once there is enough of it to be worth showing.
      // The backend sets `displayable`; until then we show trust signals instead.
      .then((d) => d && d.displayable && setStats(d))
      .catch(() => {});
  }, []);

  return (
    <main className="welcome-stage">
      {/* HERO — creator-first, single primary action, all above the fold */}
      <section className="welcome-hero welcome-hero-animate">
        <img
          src="/KunTips_Full_Logo_Transparent.webp"
          className="welcome-logo welcome-logo--sm"
          alt="KunTips"
        />
        {referral && (
          <p className="welcome-invite">
            Du er invitert! <strong>30 dager med økt andel</strong> når du
            oppretter siden din.
          </p>
        )}
        <h1 className="welcome-title">
          Ta imot tips fra følgerne dine.<br />Behold 95–100 % av beløpet selv!
        </h1>
        <p className="welcome-sub">
          Du får din egen side på kuntips.no. Del linken der du allerede
          har følgerne dine.
        </p>

        <div className="welcome-cta">
          <Link to={registerTo} className="btn btn-primary welcome-cta__btn">
            Lag din KunTips-side
          </Link>
          <p className="welcome-cta__sub">
            Gratis, ingen binding, klar på 10 minutter.
          </p>
        </div>

      </section>

      {stats && (
        <div className="welcome-stats-card welcome-choices-animate">
          <div className="welcome-stat">
            <span className="welcome-stat__number">{stats.creators}+</span>
            <span className="welcome-stat__label">innholdsskapere</span>
          </div>
          <div className="welcome-stats-divider" />
          <div className="welcome-stat">
            <span className="welcome-stat__number">{stats.tipsSent}+</span>
            <span className="welcome-stat__label">tips</span>
          </div>
          <div className="welcome-stats-divider" />
          <div className="welcome-stat">
            <span className="welcome-stat__number">
              {stats.totalEarnedNok >= 1000
                ? Math.floor(stats.totalEarnedNok / 1000) + "k"
                : stats.totalEarnedNok}
            </span>
            <span className="welcome-stat__label">kroner til skaperne</span>
          </div>
        </div>
      )}

      {/* SLIK FUNGERER DET */}
      <section className="welcome-steps welcome-choices-animate">
        <h2 className="welcome-h2">Slik fungerer det</h2>
        <ol className="welcome-steps__list">
          {STEPS.map((s, i) => (
            <li key={s.t} className="welcome-step">
              <span className="welcome-step__n">{i + 1}</span>
              <div>
                <strong className="welcome-step__t">{s.t}</strong>
                <span className="welcome-step__d">{s.d}</span>
              </div>
            </li>
          ))}
        </ol>
        {/* The two facts not already stated elsewhere on the page (the h1 has
            the 95–100 %, the CTA small print has the 0 kr) — as one quiet
            line, not a section of its own. */}
        <p className="welcome-steps__facts">
          50–2 000 kr per tips · utbetaling i kroner til norsk bankkonto
        </p>
      </section>

      {/* OBJECTION BLOCK — the section that has to rescue the Stripe drop-off */}
      <section className="welcome-faq welcome-choices-animate">
        <h2 className="welcome-h2">Godt å vite</h2>
        <div className="welcome-faq__list">
          {OBJECTIONS.map((o) => (
            <div className="welcome-faq__item" key={o.q}>
              <h3 className="welcome-faq__q">{o.q}</h3>
              <p className="welcome-faq__a">{o.a}</p>
            </div>
          ))}
        </div>

        <div className="welcome-cta welcome-cta--repeat">
          <Link to={registerTo} className="btn btn-primary welcome-cta__btn">
            Lag din KunTips-side
          </Link>
          <p className="welcome-cta__sub">
            Gratis, ingen binding, klar på 10 minutter.
          </p>
        </div>
      </section>

      {/* FAN PATH — demoted, but still reachable */}
      <section className="welcome-fanpath welcome-choices-animate">
        <CreatorSearch
          label="Vil du sende et tips? Søk opp brukernavnet."
          placeholder="brukernavn"
          buttonText="Gå til tipssiden →"
        />
        <p className="welcome-fanpath__more">
          <Link to="/fans">Slik fungerer det for følgere</Link>
          <span aria-hidden="true"> · </span>
          <Link to="/creators">Mer om utbetaling og nivåer</Link>
        </p>
      </section>
    </main>
  );
}
