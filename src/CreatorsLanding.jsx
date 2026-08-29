import { Link } from "react-router-dom";
import { usePageTitle } from "./hooks/usePageTitle.js";

function CreatorsLanding() {
  usePageTitle('Ta imot tips fra følgerne dine', "Ta imot tips fra følgerne dine med KunTips. Du beholder 95–100 % av hvert tips. Ingen abonnement, ingen MVA, og følgerne trenger ingen konto. Koble til Stripe og kom i gang i dag.");
  let loggedInUsername = null;
  if (typeof window !== "undefined" && window.localStorage) {
    loggedInUsername = window.localStorage.getItem("kuntips_creator_username");
  }
  return (
    <div className="creators-page">
      {loggedInUsername && (
        <section className="card creators-status">
          <p>
            Du er logget inn som{" "}
            <span className="creators-username-tag">{loggedInUsername}</span>.
          </p>
          <p className="creators-small">
            Gå rett til{" "}
            <Link
              to={`/creators/dashboard?username=${encodeURIComponent(
                loggedInUsername,
              )}`}
            >
              oversikten din
            </Link>
            .
          </p>
        </section>
      )}

      {/* HERO */}
      <section className="card creators-hero">
        <div className="creators-hero-text">
          <h1>Enkel og diskré tipping for dine følgere</h1>
          <ul className="creators-hero-points">
            <li>Du beholder 95–100 % av hvert tips</li>
            <li>Tipsere trenger ingen konto</li>
            <li>Ingen abonnement, ingen månedsavgift</li>
            <li>Ingen MVA for følgerne – et tips koster derfor mindre enn et kjøp</li>
          </ul>

          <div className="creators-hero-actions">
            <Link to="/creators/register" className="btn btn-primary">
              Opprett din KunTips-konto
            </Link>
            <Link to="/creators/login" className="btn btn-ghost">
              Logg inn
            </Link>
          </div>
        </div>
      </section>

      {/* FEE COMPARISON */}
      <section className="creators-compare-section">
        <h2 className="creators-compare-heading">Derfor velger skapere KunTips</h2>
        <div className="creators-compare-cards">
          <div className="card creators-compare-card creators-compare-card--kuntips">
            <h3>KunTips</h3>
            <ul>
              <li><span className="creators-compare-check">&#10003;</span> Du beholder 95–100 % av hvert tips</li>
              <li><span className="creators-compare-check">&#10003;</span> Tipsere trenger ingen konto</li>
              <li><span className="creators-compare-check">&#10003;</span> Gratis – ingen månedsavgift</li>
              <li><span className="creators-compare-check">&#10003;</span> Ingen MVA på tips</li>
            </ul>
          </div>
          <div className="card creators-compare-card creators-compare-card--others">
            <h3>Andre plattformer</h3>
            <ul>
              <li><span className="creators-compare-x">&#10005;</span> Skaperen beholder 70–95 %</li>
              <li><span className="creators-compare-x">&#10005;</span> Tipsere må som regel lage konto</li>
              <li><span className="creators-compare-x">&#10005;</span> Ofte betalt abonnement</li>
              <li><span className="creators-compare-x">&#10005;</span> 25 % MVA i tillegg</li>
            </ul>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="creators-grid">
        <div className="card creators-step">
          <h2>1. Koble til Stripe</h2>
          <p>
            Koble deg til Stripe. De verifiserer deg og håndterer betalinger til bankkontoen din. Oppsettet tar ca. fem minutter.
          </p>
        </div>
        <div className="card creators-step">
          <h2>2. Del KunTips-linken din</h2>
          <p>
            Du får din egen side på kuntips.no/«ditt brukernavn». Legg den i bioen din, på profilene dine, eller der du ellers snakker med dine følgere.
          </p>
        </div>
        <div className="card creators-step">
          <h2>3. Motta utbetalinger</h2>
          <p>
            Følgerne velger beløp og betaler på sekunder. Du ber om utbetaling fra oversikten din når saldoen er klar.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="card home-section home-section-last">
        <h2>Klar til å sette i gang?</h2>
        <p>
          Opprett kontoen din. Koble til Stripe. Motta tips samme dag.
        </p>
        <div className="home-hero-actions">
          <Link to="/creators/register" className="btn btn-primary">
            Opprett din KunTips-konto
          </Link>
          <Link to="/creators/login" className="btn btn-ghost">
            Logg inn
          </Link>
        </div>
      </section>
    </div>
  );
}

export default CreatorsLanding;
