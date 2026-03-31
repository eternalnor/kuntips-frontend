import { useState, useEffect, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function SiteHeader() {
  const [loggedInUsername, setLoggedInUsername] = useState(null);
  const navigate = useNavigate();

  const readUsername = useCallback(() => {
    try {
      const username = window.localStorage.getItem("kuntips_creator_username");
      setLoggedInUsername(username || null);
    } catch {
      setLoggedInUsername(null);
    }
  }, []);

  useEffect(() => {
    // Read on mount
    readUsername();

    // Re-read when login/logout happens in the same tab
    window.addEventListener("kuntips-auth-change", readUsername);
    // Re-read when localStorage changes in another tab
    window.addEventListener("storage", readUsername);

    return () => {
      window.removeEventListener("kuntips-auth-change", readUsername);
      window.removeEventListener("storage", readUsername);
    };
  }, [readUsername]);

  function handleLogout() {
    try {
      window.localStorage.removeItem("kuntips_creator_session");
      window.localStorage.removeItem("kuntips_creator_username");
      window.localStorage.removeItem("kuntips_creator_email");
    } catch {}
    setLoggedInUsername(null);
    window.dispatchEvent(new Event("kuntips-auth-change"));
    navigate("/");
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-logo">
          <span className="site-logo-mark" />
          <span className="site-logo-text">KunTips</span>
        </Link>

        <nav className="site-nav">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              "site-nav-link" + (isActive ? " site-nav-link-active" : "")
            }
          >
            How it works
          </NavLink>

          <NavLink
            to="/fans"
            className={({ isActive }) =>
              "site-nav-link" + (isActive ? " site-nav-link-active" : "")
            }
          >
            For fans
          </NavLink>

          <NavLink
            to="/creators"
            className={({ isActive }) =>
              "site-nav-link" + (isActive ? " site-nav-link-active" : "")
            }
          >
            For creators
          </NavLink>

          <NavLink
            to="/support"
            className={({ isActive }) =>
              "site-nav-link" + (isActive ? " site-nav-link-active" : "")
            }
          >
            Support
          </NavLink>

          {loggedInUsername ? (
            <>
              <NavLink
                to={`/creators/dashboard?username=${encodeURIComponent(loggedInUsername)}`}
                className={({ isActive }) =>
                  "site-nav-link site-nav-link--dashboard" +
                  (isActive ? " site-nav-link-active" : "")
                }
              >
                Dashboard
              </NavLink>
              <button
                onClick={handleLogout}
                className="site-nav-link site-nav-link--logout"
              >
                Log out
              </button>
            </>
          ) : (
            <NavLink
              to="/creators/login"
              className={({ isActive }) =>
                "site-nav-link site-nav-link--login" +
                (isActive ? " site-nav-link-active" : "")
              }
            >
              Log in
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
