export default function PrivacyPage() {
  return (
    <main className="page page-legal">
      <h1 className="page-title">Privacy Policy</h1>
      <div className="page-body">
        <p>Last updated: 31 March 2026</p>
        <p>
          This Privacy Policy explains how Eternal AS, organisasjonsnummer
          [ORG.NR.], Norway ("KunTips", "we", "us") collects, uses, stores,
          and protects personal data when you use the KunTips platform
          ("Service"). KunTips acts as a data controller for the personal
          data described in this policy.
        </p>
        <p>
          This policy is written in compliance with the EU General Data
          Protection Regulation (GDPR) as implemented in Norway through the
          Personal Data Act (personopplysningsloven).
        </p>

        <h2>1. Data We Collect and Why</h2>
        <p>
          We collect only the data necessary to operate the Service. Below
          is a description of each category of data, the legal basis under
          GDPR Article 6, and the purpose.
        </p>

        <h3>Fans (non-registered users making tips)</h3>
        <ul>
          <li>
            <strong>Transaction metadata</strong> (tip amount, timestamp,
            currency, payment status) — <em>Legal basis: Legitimate
            interests (Article 6(1)(f))</em> — to operate the tipping
            platform, reconcile payments, and detect fraud.
          </li>
          <li>
            <strong>Optional display name</strong> — if you choose to leave
            your name when tipping — <em>Legal basis: Consent (Article
            6(1)(a))</em> — to display your name to the creator you tipped.
            Leaving a name is entirely optional; leaving it blank keeps you
            anonymous.
          </li>
          <li>
            <strong>IP address and device/browser information</strong> —
            <em>Legal basis: Legitimate interests (Article 6(1)(f))</em> —
            for fraud prevention, abuse detection, and platform security.
            IP addresses are not shared with creators and are not used for
            advertising profiling.
          </li>
        </ul>
        <p>
          KunTips does not collect your name, email address, or payment
          card details as a fan. All payment data is processed directly by
          Stripe. See Section 7 for more on third-party processors.
        </p>

        <h3>Creators (registered accounts)</h3>
        <ul>
          <li>
            <strong>Account information</strong> (email address, username,
            display name, biography) — <em>Legal basis: Contract (Article
            6(1)(b))</em> — necessary to create and operate your creator
            account and tip page.
          </li>
          <li>
            <strong>Earnings and tip statistics</strong> (tip volumes,
            payout records, tier information) — <em>Legal basis: Contract
            (Article 6(1)(b))</em> — to operate the platform fee and payout
            system and provide your dashboard.
          </li>
          <li>
            <strong>Password (hashed)</strong> — <em>Legal basis: Contract
            (Article 6(1)(b))</em> — for account authentication. Passwords
            are stored as one-way cryptographic hashes and cannot be read by
            KunTips staff.
          </li>
          <li>
            <strong>IP address and session data</strong> — <em>Legal basis:
            Legitimate interests (Article 6(1)(f))</em> — for account
            security, fraud prevention, and login session management.
          </li>
        </ul>

        <h2>2. How We Use Your Data</h2>
        <p>We use personal data solely to:</p>
        <ul>
          <li>Operate, maintain, and improve the KunTips platform;</li>
          <li>Process and reconcile tip payments via Stripe;</li>
          <li>Calculate and administer creator payouts and tier assignments;</li>
          <li>Prevent fraud, abuse, and money laundering;</li>
          <li>Provide customer support;</li>
          <li>Comply with legal and regulatory obligations.</li>
        </ul>
        <p>
          We do not sell personal data. We do not use personal data for
          advertising profiling or share it with advertising networks.
        </p>

        <h2>3. Data Retention</h2>
        <ul>
          <li>
            <strong>Creator account data</strong> is retained for the
            duration of the account and for up to 5 years after account
            closure, as required by Norwegian accounting legislation
            (bokføringsloven) for financial transaction records.
          </li>
          <li>
            <strong>Transaction records</strong> (tip amounts, dates,
            payout records) are retained for a minimum of 5 years to comply
            with Norwegian accounting and tax reporting obligations.
          </li>
          <li>
            <strong>Security logs and IP addresses</strong> are retained for
            30–90 days and then deleted.
          </li>
          <li>
            <strong>Optional tipper names</strong> are stored as part of the
            transaction record and retained for the same period as other
            transaction data (5 years).
          </li>
        </ul>

        <h2>4. Automated Decision-Making</h2>
        <p>
          KunTips uses automated processes to assign creators to tiers based
          on tipping volume. This is not a decision with significant legal
          or similarly significant effect; it is a straightforward
          calculation based on your own earnings. No solely automated
          decisions with significant legal consequences are made about
          individual users.
        </p>

        <h2>5. International Data Transfers</h2>
        <p>
          KunTips uses the following third-party services that may process
          personal data outside the European Economic Area (EEA), including
          in the United States:
        </p>
        <ul>
          <li>
            <strong>Stripe, Inc.</strong> (United States) — payment
            processing and creator identity verification (KYC). Stripe
            processes payment data as an independent data controller. Data
            transfers are protected by Standard Contractual Clauses (SCCs)
            approved by the European Commission. See Stripe's privacy
            policy at stripe.com/privacy.
          </li>
          <li>
            <strong>Cloudflare, Inc.</strong> (United States) — our
            infrastructure provider, handling DNS, CDN, and the Cloudflare
            Workers and D1 database services that power the KunTips backend.
            Data transfers are protected by Standard Contractual Clauses.
            See Cloudflare's privacy policy at cloudflare.com/privacypolicy.
          </li>
        </ul>
        <p>
          We take reasonable steps to ensure that these providers maintain
          appropriate data protection standards consistent with GDPR
          requirements.
        </p>

        <h2>6. Cookies and Local Storage</h2>
        <p>
          See our Cookie Policy for full details of the cookies and local
          storage we use.
        </p>

        <h2>7. Third-Party Payment Processing</h2>
        <p>
          All payment card data is collected and processed exclusively by
          Stripe, Inc. KunTips never receives, stores, or has access to
          your card number, CVV, or full billing details. Stripe acts as an
          independent data controller for payment information and is subject
          to its own privacy policy and PCI DSS compliance obligations.
        </p>

        <h2>8. Security</h2>
        <p>
          We use encrypted transport (HTTPS/TLS) for all data in transit.
          Creator passwords are stored as salted one-way hashes. Session
          tokens are stored in browser local storage and expire after
          inactivity. Our backend infrastructure is operated on Cloudflare's
          platform, which provides DDoS protection and physical security at
          the infrastructure level.
        </p>
        <p>
          No method of data storage or transmission is completely secure. In
          the event of a personal data breach that is likely to result in a
          risk to your rights and freedoms, we will notify the relevant
          supervisory authority (Datatilsynet) within 72 hours as required
          by GDPR Article 33, and affected individuals where required.
        </p>

        <h2>9. Your Rights Under GDPR</h2>
        <p>
          If you are in the EU/EEA (including Norway), you have the
          following rights regarding your personal data. To exercise any of
          these rights, contact us at{" "}
          <a href="mailto:support@kuntips.no">support@kuntips.no</a>. We
          will respond within 30 days.
        </p>
        <ul>
          <li>
            <strong>Right of access (Article 15)</strong> — you may request
            a copy of the personal data we hold about you.
          </li>
          <li>
            <strong>Right to rectification (Article 16)</strong> — you may
            ask us to correct inaccurate or incomplete data.
          </li>
          <li>
            <strong>Right to erasure (Article 17)</strong> — you may ask us
            to delete your personal data in certain circumstances, subject
            to legal retention obligations (e.g. financial records that must
            be kept for 5 years).
          </li>
          <li>
            <strong>Right to restriction of processing (Article 18)</strong>
            — you may ask us to restrict how we process your data in certain
            circumstances.
          </li>
          <li>
            <strong>Right to data portability (Article 20)</strong> — for
            data processed on the basis of consent or contract, you may
            request your data in a structured, machine-readable format.
          </li>
          <li>
            <strong>Right to object (Article 21)</strong> — you may object
            to processing based on our legitimate interests. We will stop
            processing unless we have compelling legitimate grounds.
          </li>
          <li>
            <strong>Rights related to automated decision-making (Article
            22)</strong> — you have the right not to be subject to solely
            automated decisions that produce significant legal effects.
          </li>
        </ul>

        <h2>10. Right to Lodge a Complaint</h2>
        <p>
          You have the right to lodge a complaint with the Norwegian data
          protection supervisory authority if you believe we have processed
          your personal data unlawfully:
        </p>
        <p>
          <strong>Datatilsynet</strong><br />
          Postboks 458 Sentrum, 0105 Oslo, Norway<br />
          Website: datatilsynet.no<br />
          Email: postkasse@datatilsynet.no
        </p>
        <p>
          We would, however, appreciate the opportunity to address your
          concerns directly before you contact the supervisory authority.
          Please reach out to us first at{" "}
          <a href="mailto:support@kuntips.no">support@kuntips.no</a>.
        </p>

        <h2>11. Children's Privacy</h2>
        <p>
          KunTips is not directed at persons under 18 years of age. We do
          not knowingly collect personal data from minors. If you believe
          we have inadvertently collected data from a minor, please contact
          us immediately at{" "}
          <a href="mailto:support@kuntips.no">support@kuntips.no</a> and we
          will delete it promptly.
        </p>

        <h2>12. Updates to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Material
          changes will be communicated to registered creators by email.
          The updated policy will be posted on this page with a revised
          date. Continued use of the Service after the effective date
          constitutes acceptance of the updated policy.
        </p>

        <h2>13. Contact</h2>
        <p>
          Eternal AS<br />
          Norway<br />
          Email: <a href="mailto:support@kuntips.no">support@kuntips.no</a>
        </p>
      </div>
    </main>
  );
}
