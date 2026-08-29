import { Link } from "react-router-dom";
import { openConsentSettings } from "../consent.js";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <img
          src="/KunTips_Full_Logo_Transparent.webp"
          className="site-footer-logo"
          alt="KunTips"
        />
        <nav className="site-footer-nav">
          <Link to="/fans">For tipsere</Link>
          <Link to="/creators">For skapere</Link>
          <Link to="/legal/terms">Vilkår</Link>
          <Link to="/legal/privacy">Personvern</Link>
          <Link to="/legal/cookies">Informasjonskapsler</Link>
          <Link to="/legal/creator-agreement">Skaperavtale</Link>
          <Link to="/support">Support</Link>
          <button
            type="button"
            className="site-footer-link-btn"
            onClick={openConsentSettings}
          >
            Innstillinger for informasjonskapsler
          </button>
        </nav>
        <p className="site-footer-brand">© 2026 KunTips</p>
      </div>
    </footer>
  );
}
