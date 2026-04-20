import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  adminLogout,
  adminMe,
  getAdminSessionToken,
  getAdminUsername,
} from "../../api/admin.js";
import { usePageTitle } from "../../hooks/usePageTitle.js";

export default function AdminLayout() {
  usePageTitle("Admin");
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState(getAdminUsername() || "");

  // Gate: verify session on mount. If invalid, redirect to login.
  useEffect(() => {
    const token = getAdminSessionToken();
    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }
    adminMe()
      .then((data) => {
        setUsername(data?.username || "");
        setChecking(false);
      })
      .catch(() => {
        navigate("/admin/login", { replace: true });
      });
  }, [navigate]);

  async function handleLogout() {
    await adminLogout();
    navigate("/admin/login", { replace: true });
  }

  if (checking) {
    return (
      <main className="admin-login-stage">
        <p className="admin-loading">Checking session\u2026</p>
      </main>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <img
            src="/KunTips_Icon_Only_Transparent.webp"
            alt=""
            className="admin-sidebar__logo"
          />
          <span>Admin</span>
        </div>

        <nav className="admin-sidebar__nav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              "admin-sidebar__link" + (isActive ? " admin-sidebar__link--active" : "")
            }
          >
            Overview
          </NavLink>
          <NavLink
            to="/admin/creators"
            className={({ isActive }) =>
              "admin-sidebar__link" + (isActive ? " admin-sidebar__link--active" : "")
            }
          >
            Creators
          </NavLink>
          <NavLink
            to="/admin/platform-events"
            className={({ isActive }) =>
              "admin-sidebar__link" + (isActive ? " admin-sidebar__link--active" : "")
            }
          >
            Platform events
          </NavLink>
          <NavLink
            to="/admin/referral-codes"
            className={({ isActive }) =>
              "admin-sidebar__link" + (isActive ? " admin-sidebar__link--active" : "")
            }
          >
            Referral codes
          </NavLink>
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <span className="admin-sidebar__user-label">Signed in as</span>
            <span className="admin-sidebar__user-name">{username}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="admin-sidebar__logout"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
