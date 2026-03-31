import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle.js';

export default function SupportPage() {
  usePageTitle('Support');
  return (
    <main className="page page-legal card">
      <h1 className="page-title">Support</h1>
      <div className="page-body">

        <p>
          Need help? You can reach us at{' '}
          <a href="mailto:support@kuntips.no">support@kuntips.no</a>.
          We aim to respond within 48 hours.
        </p>

        <h2>For fans</h2>
        <p>
          You do not need a KunTips account to send a tip. If you have a
          question about a payment you made, contact us with the approximate
          date and amount and we will look into it.
        </p>
        <ul>
          <li>
            <strong>I was charged but something went wrong</strong> — contact
            us with the date, amount, and creator username. We will investigate
            and issue a refund if appropriate.
          </li>
          <li>
            <strong>I want to find a creator</strong> — you need their exact
            KunTips username. Creators share their link directly. You can also
            enter a username on the{' '}
            <Link to="/">home page</Link>.
          </li>
          <li>
            <strong>I want to report a creator</strong> — email us with the
            creator username and a description of the issue. We take all
            reports seriously.
          </li>
        </ul>

        <h2>For creators</h2>
        <ul>
          <li>
            <strong>Getting started</strong> — visit the{' '}
            <Link to="/creators">For creators</Link> page or go straight to{' '}
            <Link to="/creators/register">create your account</Link>.
          </li>
          <li>
            <strong>Stripe onboarding issues</strong> — Stripe handles identity
            verification independently. If Stripe declines your onboarding,
            contact Stripe support directly. KunTips cannot override Stripe's
            decisions.
          </li>
          <li>
            <strong>Payout questions</strong> — payout requests are made from
            your dashboard. Tips are held for at least 7 days before becoming
            eligible. Check your dashboard for your current balance.
          </li>
          <li>
            <strong>Account suspension or appeal</strong> — if your account has
            been suspended and you believe this is an error, email us at{' '}
            <a href="mailto:support@kuntips.no">support@kuntips.no</a> with a
            description of your situation. We will respond within 10 business
            days.
          </li>
          <li>
            <strong>Closing your account</strong> — contact us by email.
            Outstanding eligible balances will be paid out before closure.
          </li>
        </ul>

        <h2>Legal and policies</h2>
        <p>
          For information about how KunTips works, your rights, and our
          policies:
        </p>
        <ul>
          <li><Link to="/legal/terms">Terms of Service</Link></li>
          <li><Link to="/legal/privacy">Privacy Policy</Link></li>
          <li><Link to="/legal/cookies">Cookie Policy</Link></li>
          <li><Link to="/legal/creator-agreement">Creator Agreement</Link></li>
        </ul>

        <h2>Contact</h2>
        <p>
          Eternal AS · Org.nr. 926 462 237<br />
          Johan Berentsens vei 41, 5160 Laksevåg, Norway<br />
          Email: <a href="mailto:support@kuntips.no">support@kuntips.no</a><br />
          Response time: within 48 hours on business days
        </p>

      </div>
    </main>
  );
}
