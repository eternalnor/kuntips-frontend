import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CreatorSearch from "../components/CreatorSearch.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

// The questions that actually stop a Norwegian creator from completing Stripe's
// KYC form. This content previously lived only on an orphaned page reachable
// from the login screen, so no visitor ever saw it.
const OBJECTIONS = [
  {
    q: "Hvor mye sitter jeg igjen med?",
    a: "95 % fra første tips, og mer etter hvert som du tjener. Ingen månedsavgift og ingen bindingstid – vi tjener bare når du tjener.",
  },
  {
    q: "Hva må jeg faktisk gjøre?",
    a: "Lage siden din og lime lenken inn i bioen. Fansen trenger ingen konto – de trykker, velger beløp og betaler med kort.",
  },
  {
    q: "Ser fansen det juridiske navnet mitt?",
    a: "Nei. De ser bare artistnavnet og brukernavnet du velger selv.",
  },
];

const STEPS = [
  {
    t: "Opprett kontoen din",
    d: "Du velger brukernavn og får siden kuntips.no/brukernavnet ditt.",
  },
  {
    t: "Koble til Stripe",
    d: "Én verifisering, så er utbetalingene klare. Rundt fem minutter.",
  },
  {
    t: "Del lenken din",
    d: "I bio, i beskrivelsen, i en fastpinnet post – hvor du enn har fansen.",
  },
];

const FACTS = [
  ["95–100 %", "går til deg"],
  ["50–2000 kr", "per tips"],
  ["0 kr", "i månedsavgift"],
  ["NOK", "til norsk bankkonto"],
];

export default function WelcomePage() {
  usePageTitle(
    null,
    "Ta imot tips fra fans. Du beholder 95–100 % av hvert tips. Ingen månedsavgift, ingen binding, og fansen trenger ingen konto. Utbetaling i kroner til norsk bankkonto.",
  );
  const [stats, setStats] = useState(null);

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
        <h1 className="welcome-title">
          Ta imot tips fra fans.<br />Du beholder 95–100 %.
        </h1>
        <p className="welcome-sub">
          Du får din egen side på kuntips.no/brukernavn. Fansen betaler med kort
          uten å opprette konto, og Stripe betaler ut i kroner til din norske
          bankkonto.
        </p>

        <div className="welcome-cta">
          <Link to="/creators/register" className="btn btn-primary welcome-cta__btn">
            Lag din KunTips-side
          </Link>
          <p className="welcome-cta__sub">
            Gratis, ingen månedsavgift, ingen binding. Du er klar på rundt fem
            minutter.
          </p>
        </div>

        <ul className="welcome-chips">
          <li>Fansen trenger ingen konto</li>
          <li>Stripe håndterer betaling og utbetaling</li>
          <li>Utbetaling i kroner til norsk bankkonto</li>
        </ul>
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
      </section>

      {/* FAKTASTRIPE */}
      <section className="welcome-facts welcome-choices-animate">
        {FACTS.map(([big, small]) => (
          <div className="welcome-fact" key={big}>
            <span className="welcome-fact__big">{big}</span>
            <span className="welcome-fact__small">{small}</span>
          </div>
        ))}
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
          <Link to="/creators/register" className="btn btn-primary welcome-cta__btn">
            Lag din KunTips-side
          </Link>
          <p className="welcome-cta__sub">
            Gratis, ingen binding. Rundt fem minutter.
          </p>
        </div>
      </section>

      {/* FAN PATH — demoted, but still reachable */}
      <section className="welcome-fanpath welcome-choices-animate">
        <CreatorSearch
          label="Er du fan og vil sende et tips? Søk opp brukernavnet."
          placeholder="brukernavn"
          buttonText="Gå til tipssiden →"
        />
        <p className="welcome-fanpath__more">
          <Link to="/fans">Slik fungerer det for fans</Link>
          <span aria-hidden="true"> · </span>
          <Link to="/creators">Mer om utbetaling og nivåer</Link>
        </p>
      </section>
    </main>
  );
}
