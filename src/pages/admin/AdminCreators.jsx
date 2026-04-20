import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminCreators } from "../../api/admin.js";
import { usePageTitle } from "../../hooks/usePageTitle.js";

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("nb-NO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function AdminCreators() {
  usePageTitle("Creators");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [hasStripe, setHasStripe] = useState("");
  const [active, setActive] = useState("");
  const [page, setPage] = useState(1);

  // Fetch on filter changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    adminCreators({ search, hasStripe, active, page })
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Failed to load");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [search, hasStripe, active, page]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div className="admin-page">
      <h1>Creators</h1>
      <p className="admin-page-sub">Full list with search and filters.</p>

      <section className="admin-filters">
        <input
          type="text"
          placeholder="Search username or email\u2026"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="admin-filter-input"
        />

        <select
          value={hasStripe}
          onChange={(e) => {
            setHasStripe(e.target.value);
            setPage(1);
          }}
          className="admin-filter-select"
        >
          <option value="">All (Stripe)</option>
          <option value="1">Has Stripe</option>
          <option value="0">No Stripe</option>
        </select>

        <select
          value={active}
          onChange={(e) => {
            setActive(e.target.value);
            setPage(1);
          }}
          className="admin-filter-select"
        >
          <option value="">All (active)</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
      </section>

      {loading && <p className="admin-loading">Loading\u2026</p>}
      {error && <p className="admin-login-error">{error}</p>}

      {data && !loading && (
        <>
          <p className="admin-muted" style={{ marginTop: "1rem" }}>
            {data.total} total
          </p>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Tier</th>
                <th>Stripe</th>
                <th>Verified</th>
                <th>Code</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {data.creators.length === 0 && (
                <tr>
                  <td colSpan={7} className="admin-muted">
                    No creators match.
                  </td>
                </tr>
              )}
              {data.creators.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link to={`/admin/creators/${c.id}`} className="admin-link">
                      <strong>{c.username}</strong>
                    </Link>
                    {c.is_seed ? <span className="admin-chip admin-chip--muted" title="Seed creator"> seed</span> : null}
                    {c.is_active === 0 ? <span className="admin-chip admin-chip--bad"> inactive</span> : null}
                  </td>
                  <td className="admin-mono">{c.email || "—"}</td>
                  <td>T{c.current_tier}</td>
                  <td>{c.has_stripe ? <span className="admin-good">\u2713</span> : <span className="admin-bad">\u2715</span>}</td>
                  <td>{c.email_verified ? <span className="admin-good">\u2713</span> : <span className="admin-muted">\u2715</span>}</td>
                  <td className="admin-mono">{c.signup_code || "—"}</td>
                  <td className="admin-muted">{formatDate(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="admin-pagination">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span className="admin-muted">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
