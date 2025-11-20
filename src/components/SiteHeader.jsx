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
          <NavLink
            to="/"
            className={({ isActive }) =>
              'site-nav-link' + (isActive ? ' site-nav-link-active' : '')
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/u/testcreator"
            className={({ isActive }) =>
              'site-nav-link' + (isActive ? ' site-nav-link-active' : '')
            }
          >
            Example tip page
          </NavLink>

          <NavLink
            to="/support"
            className={({ isActive }) =>
              'site-nav-link' + (isActive ? ' site-nav-link-active' : '')
            }
          >
            For creators
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
