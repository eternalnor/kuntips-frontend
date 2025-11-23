// CreatorsDashboard.jsx
function CreatorsDashboard() {
  // Static example data for now – later this will come from the backend
  const exampleStats = {
    monthNok: 3200,
    monthTips: 17,
    allTimeNok: 12850,
    avgTipNok: 188,
    keptPercent: '97%',
    currentTier: 'Tier 2',
    nextTierHint: 'Tier 1 at 20 000 NOK / 60 days',
  };

  const exampleTips = [
    { id: 1, date: '2025-11-20', amount: '150 NOK', source: 'Tip page', status: 'Succeeded' },
    { id: 2, date: '2025-11-19', amount: '500 NOK', source: 'Tip page', status: 'Succeeded' },
    { id: 3, date: '2025-11-18', amount: '75 NOK', source: 'Tip page', status: 'Succeeded' },
  ];

  return (
    <div className="creators-page">
      <section className="card creators-dashboard-header">
        <h1>Creator dashboard (preview)</h1>
        <p className="creators-small">
          This is a simple example dashboard using test data. When KunTips goes live,
          this page will show your real tips, payouts and tier progress.
        </p>
      </section>

      <section className="card creators-dashboard-grid">
        <div className="creators-dashboard-tile">
          <div className="creators-stat-label">Tips last 30 days</div>
          <div className="creators-stat-value">
            {exampleStats.monthNok.toLocaleString('nb-NO')} NOK
          </div>
          <div className="creators-stat-sub">
            {exampleStats.monthTips} tips · avg {exampleStats.avgTipNok} NOK
          </div>
        </div>

        <div className="creators-dashboard-tile">
          <div className="creators-stat-label">All-time tips</div>
          <div className="creators-stat-value">
            {exampleStats.allTimeNok.toLocaleString('nb-NO')} NOK
          </div>
          <div className="creators-stat-sub">
            Net amounts after Stripe fees & KunTips service fee.
          </div>
        </div>

        <div className="creators-dashboard-tile">
          <div className="creators-stat-label">Your KunTips tier</div>
          <div className="creators-stat-value">
            {exampleStats.currentTier} · you keep {exampleStats.keptPercent}
          </div>
          <div className="creators-stat-sub">
            {exampleStats.nextTierHint}
          </div>
        </div>
      </section>

      <section className="card creators-dashboard-activity">
        <div className="creators-dashboard-activity-header">
          <h2>Recent tips (example data)</h2>
          <p className="creators-small">
            In live mode, this list will show your latest successful tips. Fans stay
            anonymous – you only see amounts, dates and which page the tip came from.
          </p>
        </div>

        <div className="creators-dashboard-table-wrapper">
          <table className="creators-dashboard-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Source</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {exampleTips.map((tip) => (
                <tr key={tip.id}>
                  <td>{tip.date}</td>
                  <td>{tip.amount}</td>
                  <td>{tip.source}</td>
                  <td>{tip.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="creators-small">
          Payouts themselves are handled by Stripe. KunTips will show you aggregated
          stats here, while Stripe provides detailed payout reports for your accounting.
        </p>
      </section>
    </div>
  );
}

export default CreatorsDashboard;
