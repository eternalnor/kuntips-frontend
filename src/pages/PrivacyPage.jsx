export default function PrivacyPage() {
  return (
    <main className="page page-legal">
      <h1 className="page-title">Privacy Policy</h1>
      <div className="page-body">
        <p>Last updated: 2025</p>

        <p>
          KunTips (“we”, “our”) respects your privacy. This policy explains how
          we collect, use, and protect your personal data. KunTips is a service
          operated by Eternal AS, Norway.
        </p>

        <h2>1. What We Collect</h2>
        <p>We collect the minimum data necessary:</p>
        <ul>
          <li>
            <strong>Fans:</strong> transaction metadata from CCBill
            (timestamp, amount, non-identifying payment info), browser/device
            info, IP address for security and fraud prevention.
          </li>
          <li>
            <strong>Creators:</strong> email address, display name and profile
            information, earnings and tipping statistics.
          </li>
        </ul>
        <p>
          KunTips does not collect or store credit card information. All payment
          data is processed by CCBill.
        </p>

        <h2>2. How We Use Data</h2>
        <p>
          We use your data to operate the tipping platform, process payments via
          CCBill, prevent fraud and abuse, maintain security, and provide
          support. We do not sell personal data.
        </p>

        <h2>3. Cookies & Analytics</h2>
        <p>
          KunTips uses essential cookies and minimal analytics for functionality
          and security. No advertising tracking is used.
        </p>

        <h2>4. Data Retention</h2>
        <p>
          Logs and security records are kept for about 30–90 days. Creator
          account data is retained while the account remains active. Transaction
          records are stored as required for financial compliance.
        </p>

        <h2>5. Your Rights</h2>
        <p>
          If you are in the EU/EEA, you may request access, correction, or
          deletion of your data where applicable. Contact{' '}
          <a href="mailto:support@kuntips.no">support@kuntips.no</a>.
        </p>

        <h2>6. Third-Party Processing</h2>
        <p>
          Payments are processed exclusively by CCBill, who acts as a separate
          data controller for payment information. KunTips never stores credit
          card numbers, bank details, or full billing details.
        </p>

        <h2>7. Security</h2>
        <p>
          We use encrypted transport (HTTPS) and modern security practices. No
          method is 100% secure, but we take reasonable steps to protect your
          data.
        </p>

        <h2>8. Updates</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes take
          effect when posted on this page.
        </p>

        <h2>9. Contact</h2>
        <p>
          Email: <a href="mailto:support@kuntips.no">support@kuntips.no</a>
        </p>
        <p>KunTips is operated by Eternal AS, Norway.</p>
      </div>
    </main>
  );
}
