export default function CreatorAgreementPage() {
  return (
    <main className="page page-legal">
      <h1 className="page-title">Creator Agreement</h1>
      <div className="page-body">
        <p>Last updated: 2025</p>

        <p>
          This agreement applies to creators who receive tips through KunTips
          (“Creator”, “you”). By using KunTips as a creator, you agree to these
          terms. KunTips is a service operated by Eternal AS, Norway.
        </p>

        <h2>1. Eligibility</h2>
        <p>
          You must be at least 18 years old and legally allowed to receive
          income in your jurisdiction.
        </p>

        <h2>2. Payouts & Fees</h2>
        <p>
          Creators receive a percentage of each tip after KunTips’ platform fee
          and payment processing costs. The exact percentage depends on your
          activity tier and may change over time. KunTips does not guarantee
          earnings. Creators are solely responsible for reporting and paying any
          taxes.
        </p>

        <h2>3. Prohibited Uses</h2>
        <p>
          KunTips is a tipping-only service. You may not use KunTips to sell,
          deliver, or provide access to goods, services, or digital content of
          any kind. You may not use KunTips in connection with any illegal,
          harmful, misleading, or high-risk activities, including activities
          prohibited under Stripe’s Restricted Businesses list. This includes,
          without limitation: activities involving minors; non-consensual
          material; unlawful content; fraudulent practices; or any
          age-restricted or regulated services.
          KunTips does not host any creator content and may not be used as a
          storefront or paywall.
        </p>

        <h2>4. Compliance</h2>
        <p>
          You agree to follow KunTips&apos; Terms of Service, Stripe&apos;s
          acceptable use standards, and all applicable local laws and
          regulations.
        </p>

        <h2>5. Liability</h2>
        <p>
          KunTips and Eternal AS are not responsible for your actions, loss of
          income due to account suspension or technical issues, or disputes
          between you and fans. Chargebacks and disputes are handled according
          to Stripe&apos;s policies and the applicable card network rules.
        </p>

        <h2>6. Refunds, Disputes & Fee Deductions</h2>
        <p>
          When a fan requests a refund or a payment is disputed through their bank,
          Stripe requires that the full amount the fan paid is returned. Because
          creators are the merchants of record under Stripe Connect, creators are
          financially responsible for the payment processor&apos;s non-refundable
          costs.
        </p>

        <p>The following rules apply:</p>
        <ul>
          <li>
            <strong>Refunds:</strong> If a tip is refunded, the creator will be
            charged only Stripe&apos;s non-refundable processing fee (currently
            3.25% + 2 NOK of the original charge). KunTips does not take or keep
            any platform fee on refunded transactions.
          </li>
          <li>
            <strong>Chargebacks / Disputes:</strong> If a payment is disputed
            through the fan&apos;s bank, the creator is responsible for Stripe&apos;s
            dispute fee (currently 200 NOK) in addition to the processing fee. If
            the dispute is resolved in the creator&apos;s favor, Stripe returns the
            dispute fee.
          </li>
          <li>
            KunTips will never earn money from refunds or disputes and will not
            charge any platform fee when the creator does not earn money.
          </li>
          <li>
            Refund and dispute deductions may create a negative creator balance,
            which will automatically be settled from future payouts.
          </li>
        </ul>

        <h2>7. Termination</h2>
        <p>
          KunTips may suspend or terminate your creator access at any time for
          violations, fraud risk, or platform abuse. You may close your account
          at any time.
        </p>

        <h2>8. Contact</h2>
        <p>
          Email: <a href="mailto:support@kuntips.no">support@kuntips.no</a>
        </p>
      </div>
    </main>
  );
}
