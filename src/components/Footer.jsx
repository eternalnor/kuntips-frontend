import { Link } from "react-router-dom";

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
          <Link to="/fans">For fans</Link>
          <Link to="/creators">For creators</Link>
          <Link to="/legal/terms">Terms</Link>
          <Link to="/legal/privacy">Privacy</Link>
          <Link to="/legal/cookies">Cookies</Link>
          <Link to="/legal/creator-agreement">Creator Agreement</Link>
          <Link to="/support">Support</Link>
        </nav>
        <p className="site-footer-brand">© 2026 KunTips</p>
      </div>
    </footer>
  );
}
