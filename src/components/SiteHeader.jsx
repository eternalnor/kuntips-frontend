import { useState, useEffect, useCallback } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { getSessionToken, fetchCurrentCreator, logoutCreator } from "../api";

export default function SiteHeader() {
  const [loggedInUsername, setLoggedInUsername] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const readUsername = useCallback(() => {
    try {
      const username = window.localStorage.getItem("kuntips_creator_username");
      setLoggedInUsername(username || null);
    } catch {
      setLoggedInUsername(null);
    }
  }, []);

  useEffect(() => {
    readUsername();
    window.addEventListener("kuntips-auth-change", readUsername);
    window.addEventListener("storage", readUsername);
    return () => {
      window.removeEventListener("kuntips-auth-change", readUsername);
      window.removeEventListener("storage", readUsername);
    };
  }, [readUsername]);

  // Validate session on mount — if the token is revoked, the 401 handler
  // in api.js clears localStorage and fires kuntips-auth-change automatically.
  useEffect(() => {
    if (getSessionToken()) {
      fetchCurrentCreator().catch(() => {});
    }
  }, []);

  function handleLogout() {
    // Invalidate the server-side session first — after localStorage is cleared
    // the token is gone and can no longer authenticate its own deletion.
    logoutCreator();
    try {
      window.localStorage.removeItem("kuntips_creator_session");
      window.localStorage.removeItem("kuntips_creator_username");
      window.localStorage.removeItem("kuntips_creator_email");
    } catch {}
    setLoggedInUsername(null);
    window.dispatchEvent(new Event("kuntips-auth-change"));
    navigate("/");
  }

  const close = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-logo" onClick={close}>
          <img src="/KunTips_Icon_Only_Transparent.webp" className="site-logo-icon" alt="" />
          <img src="/KunTips_Wordmark_Only_Transparent.webp" className="site-logo-wordmark" alt="KunTips" />
        </Link>

        {/* Desktop nav */}
        <nav className="site-nav">
          <NavLink
            to="/fans"
            className={({ isActive }) =>
              "site-nav-link site-nav-link--hide-mobile" + (isActive ? " site-nav-link-active" : "")
            }
          >
            For tipsere
          </NavLink>

          <NavLink
            to="/creators"
            className={({ isActive }) =>
              "site-nav-link site-nav-link--hide-mobile" + (isActive ? " site-nav-link-active" : "")
            }
          >
            For skapere
          </NavLink>

          <NavLink
            to="/support"
            className={({ isActive }) =>
              "site-nav-link site-nav-link--hide-mobile" + (isActive ? " site-nav-link-active" : "")
            }
          >
            Support
          </NavLink>

          {loggedInUsername ? (
            <>
              <NavLink
                to={`/creators/dashboard?username=${encodeURIComponent(loggedInUsername)}`}
                className={({ isActive }) =>
                  "site-nav-link site-nav-link--dashboard site-nav-link--hide-mobile" +
                  (isActive ? " site-nav-link-active" : "")
                }
              >
                Oversikt
              </NavLink>
              <button
                onClick={handleLogout}
                className="site-nav-link site-nav-link--logout site-nav-link--hide-mobile"
              >
                Logg ut
              </button>
            </>
          ) : (
            <NavLink
              to="/creators/login"
              className={({ isActive }) =>
                "site-nav-link site-nav-link--login site-nav-link--hide-mobile" +
                (isActive ? " site-nav-link-active" : "")
              }
            >
              Logg inn
            </NavLink>
          )}

          {/* Hamburger — only visible on mobile */}
          <button
            className={"site-nav-menu-btn" + (menuOpen ? " site-nav-menu-btn--open" : "")}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Lukk meny" : "Åpne meny"}
            aria-expanded={menuOpen}
          >
            <span className="site-nav-menu-btn__bar" />
            <span className="site-nav-menu-btn__bar" />
            <span className="site-nav-menu-btn__bar" />
          </button>
        </nav>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <>
          {/* Backdrop — tap anywhere outside to close */}
          <div className="site-nav-backdrop" onClick={close} aria-hidden="true" />

          <div className="site-nav-mobile-menu" role="dialog" aria-label="Meny">
            <NavLink
              to="/fans"
              className={({ isActive }) =>
                "site-nav-mobile-link" + (isActive ? " site-nav-mobile-link--active" : "")
              }
              onClick={close}
            >
              For tipsere
            </NavLink>

            <NavLink
              to="/creators"
              className={({ isActive }) =>
                "site-nav-mobile-link" + (isActive ? " site-nav-mobile-link--active" : "")
              }
              onClick={close}
            >
              For skapere
            </NavLink>

            <NavLink
              to="/support"
              className={({ isActive }) =>
                "site-nav-mobile-link" + (isActive ? " site-nav-mobile-link--active" : "")
              }
              onClick={close}
            >
              Support
            </NavLink>

            <div className="site-nav-mobile-divider" />

            {loggedInUsername ? (
              <>
                <NavLink
                  to={`/creators/dashboard?username=${encodeURIComponent(loggedInUsername)}`}
                  className={({ isActive }) =>
                    "site-nav-mobile-link site-nav-mobile-link--accent" +
                    (isActive ? " site-nav-mobile-link--active" : "")
                  }
                  onClick={close}
                >
                  Oversikt
                </NavLink>
                <button
                  onClick={() => { handleLogout(); close(); }}
                  className="site-nav-mobile-link site-nav-mobile-link--muted"
                >
                  Logg ut
                </button>
              </>
            ) : (
              <NavLink
                to="/creators/login"
                className={({ isActive }) =>
                  "site-nav-mobile-link site-nav-mobile-link--accent" +
                  (isActive ? " site-nav-mobile-link--active" : "")
                }
                onClick={close}
              >
                Logg inn
              </NavLink>
            )}
          </div>
        </>
      )}
    </header>
  );
}
