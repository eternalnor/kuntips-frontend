import { Link } from "react-router-dom";

export default function FansPage() {
  return (
    <main className="page-legal">
      <h1 className="page-title">For fans</h1>

      <div className="card">
        <p className="text-muted">
          To send a tip, you normally open a creator’s KunTips link and choose
          an amount. No fan accounts, no feed — just a simple one-time tip.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link to="/u/testcreator1" className="btn btn-primary">
            Try the example tip page
          </Link>
          <Link to="/home" className="btn btn-secondary">
            How it works
          </Link>
        </div>
      </div>
    </main>
  );
}
