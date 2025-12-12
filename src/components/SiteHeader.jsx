import { Link, NavLink } from 'react-router-dom';

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-logo">
          <span className="site-logo-mark" />
          <span className="site-logo-text">KunTips</span>
        </Link>
        <nav className="site-nav">
          <NavLink to="/home" className={({ isActive }) => "site-nav-link" + (isActive ? " site-nav-link-active" : "")}>
            Home
          </NavLink>

          <NavLink to="/fans" className={({ isActive }) => "site-nav-link" + (isActive ? " site-nav-link-active" : "")}>
            For fans
          </NavLink>

          <NavLink to="/creators" className={({ isActive }) => "site-nav-link" + (isActive ? " site-nav-link-active" : "")}>
            For creators
          </NavLink>

          <NavLink to="/support" className={({ isActive }) => "site-nav-link" + (isActive ? " site-nav-link-active" : "")}>
            Support
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
