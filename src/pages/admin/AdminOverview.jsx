import { usePageTitle } from "../../hooks/usePageTitle.js";

export default function AdminOverview() {
  usePageTitle("Overview");
  return (
    <div className="admin-page">
      <h1>Overview</h1>
      <p className="admin-page-sub">Dashboard stats coming next.</p>
    </div>
  );
}
