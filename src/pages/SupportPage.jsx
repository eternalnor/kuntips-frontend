import { Link } from 'react-router-dom';

export default function SupportPage() {
  return (
    <main className="page page-legal">
      <h1 className="page-title">Support</h1>
      <div className="page-body">
        <p>
          If you need help with your account, have questions about KunTips, or
          want to report an issue, you can contact us at:
        </p>

        <p>
          For creator onboarding, click the link below.
        </p>
        <Link to="/creators/start" className="btn btn-primary">
          Start creator onboarding
        </Link>

        <p>
          📧{' '}
          <a href="mailto:support@kuntips.no">
            support@kuntips.no
          </a>
        </p>

        <p>We aim to respond within 48 hours.</p>


      </div>
    </main>
  );
}
