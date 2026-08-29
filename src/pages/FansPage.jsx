import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CreatorSearch from "../components/CreatorSearch.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

export default function FansPage() {
  usePageTitle('Send et tips til din favoritt-skaper!', "Støtt skapere med et privat engangstips. Ingen konto, ingen registrering, ingen MVA. Betal trygt med Stripe – skaperen beholder 95–100 %.");
  const [tipRange, setTipRange] = useState({ min: 50, max: 2000 });
  useEffect(() => {
    fetch(`${API_BASE_URL}/settings/tips`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setTipRange({ min: Number(d.min_nok), max: Number(d.max_nok) }))
      .catch(() => {});
  }, []);
  return (
    <main className="home-page">
      <section className="card home-hero">
        <div className="home-hero-main">
          <div className="home-hero-text">
            <h1>Send tips – uten konto, uten styr.</h1>
            <p className="home-hero-sub">
              Med KunTips kan du støtte favorittene dine med tips. Ingen registrering, ingen abonnementer, og skaperen får aldri se opplysningene dine – bare en enkel og privat betaling gjennom Stripe. Du trenger ingen konto, og 95–100 % av tipset går rett til skaperen.
            </p>
            <div className="fans-search-wrap">
              <CreatorSearch
                label="Vet du hvem du vil tipse? Skriv inn brukernavnet."
                placeholder="username"
                buttonText="Gå til tipssiden →"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="card home-section">
        <h2>Derfor bruker følgere KunTips</h2>
        <div className="home-grid">
          <div className="home-tile">
            <h3>Privat som utgangspunkt</h3>
            <p>
              Skaperen ser aldri betalingsopplysningene dine. Du kan legge igjen navnet ditt hvis du vil – eller tipse helt anonymt.
            </p>
          </div>
          <div className="home-tile">
            <h3>Du trenger ingen konto</h3>
            <p>
              Ingen registrering, ingen innlogging. Du velger et beløp og betaler med kort gjennom Stripe.
            </p>
          </div>
          <div className="home-tile">
            <h3>Ingen MVA på tips</h3>
            <p>
              Et tips er ikke regnet som et kjøp, så det kommer ingen 25 % MVA i tillegg. Mer av pengene går rett til skaperen.
            </p>
          </div>
        </div>
      </section>

      <section className="card home-section">
        <h2>Slik sender du tips</h2>
        <div className="home-grid">
          <div className="home-tile">
            <h3>1. Åpne linken til en skaper</h3>
            <p>
              Skapere deler en egen KunTips-link, for eksempel kuntips.no/«brukernavn». Trykker du på den, havner du rett på tipssiden.
            </p>
          </div>
          <div className="home-tile">
            <h3>2. Velg beløp</h3>
            <p>
              Velg et eksisterende beløp, eller skriv inn ditt eget mellom {tipRange.min} og {tipRange.max.toLocaleString("nb-NO")}
              {" "}kr. Du ser nøyaktig hva skaperen sitter igjen med før du
              bekrefter.
            </p>
          </div>
          <div className="home-tile">
            <h3>3. Betal sikkert med Stripe</h3>
            <p>
              Du fyller inn kortopplysningene i Stripes betalingsløsning. Verken KunTips eller skaperen ser kortinformasjonen din.
            </p>
          </div>
        </div>
      </section>

      <section className="card home-section home-section-last">
        <h2>Er du selv en skaper?</h2>
        <p>
          Sett opp din egen KunTips-side på få minutter. Koble til Stripe, del linken din, og la følgerne dine støtte deg.
        </p>
        <div className="home-hero-actions">
          <Link to="/creators/register" className="btn btn-primary">
            Opprett din KunTips-konto
          </Link>
          <Link to="/creators" className="btn btn-ghost">
            Les mer →
          </Link>
        </div>
      </section>

    </main>
  );
}
