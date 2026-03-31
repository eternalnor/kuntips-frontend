export default function CreatorAgreementPage() {
  return (
    <main className="page page-legal card">
      <h1 className="page-title">Creator Agreement</h1>
      <div className="page-body">
        <p>Last updated: 31 March 2026</p>
        <p>
          This Creator Agreement ("Agreement") applies to all creators who
          register and receive tips through KunTips ("Creator", "you").
          KunTips is a service operated by Eternal AS,
          organisasjonsnummer 926462237, Norway ("KunTips", "we").
          By creating a creator account you agree to this Agreement, the
          KunTips Terms of Service, and the Privacy Policy. This Agreement
          supplements and should be read alongside the Terms of Service.
        </p>

        <h2>1. Eligibility</h2>
        <p>
          To register as a creator you must:
        </p>
        <ul>
          <li>Be at least 18 years of age;</li>
          <li>Be legally permitted to receive income in your country of
          residence;</li>
          <li>Have the legal capacity to enter into a binding contract;</li>
          <li>Successfully complete Stripe's identity verification (KYC)
          process during onboarding.</li>
        </ul>
        <p>
          By registering you represent and warrant that all of the above are
          true. KunTips may ask for additional verification at any time and
          may suspend accounts where eligibility requirements are not met.
        </p>

        <h2>2. Identity Verification</h2>
        <p>
          Creator identity verification is conducted by Stripe, Inc. as
          part of the Stripe Connect onboarding process. Stripe collects and
          verifies identity documents, bank details, and other personal
          information required by financial regulations and Stripe's own
          policies. KunTips does not receive your identity documents or bank
          details directly — these are handled solely by Stripe.
        </p>
        <p>
          Stripe may decline to onboard or may later suspend a connected
          account at its own discretion and for its own reasons, which are
          outside KunTips' control. KunTips cannot override Stripe's
          identity or compliance decisions.
        </p>

        <h2>3. Platform Fees and Tier System</h2>
        <p>
          KunTips charges a platform fee on each tip received. This fee is
          deducted before the creator's payout is calculated. The platform
          fee rate depends on your current tier:
        </p>
        <ul>
          <li><strong>Tier 1</strong> — 5% platform fee (default for new
          creators)</li>
          <li><strong>Tier 2</strong> — 4% platform fee</li>
          <li><strong>Tier 3</strong> — 3% platform fee</li>
          <li><strong>Tier 4</strong> — 2% platform fee</li>
          <li><strong>Tier 5</strong> — 1% platform fee</li>
          <li><strong>Tier 6</strong> — 0% platform fee</li>
        </ul>
        <p>
          Tier assignments are based on your total intended tip volume
          received over a rolling 30-day period. The specific thresholds
          and current tier structure are displayed in your creator
          dashboard. Tiers are recalculated periodically based on your
          recent earnings activity.
        </p>
        <p>
          Additional temporary tier boosts may be granted through referral
          bonuses, platform events, or at KunTips' discretion. These boosts
          are temporary and subject to change.
        </p>
        <p>
          In addition to the KunTips platform fee, Stripe charges a payment
          processing fee. This processing fee is passed on to the fan and
          is included in the total amount charged to them, not deducted from
          your payout separately.
        </p>
        <p>
          KunTips will provide at least 30 days' written notice by email
          before making any changes to the tier thresholds or platform fee
          rates. Changes will not apply retroactively.
        </p>

        <h2>4. Payouts</h2>
        <p>
          Creator payouts are processed through Stripe Connect. Tips are
          subject to a holding period of at least 7 days before they become
          eligible for payout. This holding period exists to allow time for
          refund requests and to reduce chargeback risk.
        </p>
        <p>
          To request a payout, use the Payouts section in your creator
          dashboard. Payouts are transferred to the bank account connected
          to your Stripe account. Stripe's own processing times apply once
          a payout is initiated (typically 2–5 business days depending on
          your country and bank).
        </p>
        <p>
          All payouts are made in Norwegian Krone (NOK). KunTips does not
          support payouts in other currencies at this time.
        </p>
        <p>
          A small fixed payout fee (currently 2.75 NOK) is charged by
          Stripe per payout transfer. This is deducted from your payout
          amount. KunTips does not charge an additional fee for payouts.
        </p>
        <p>
          There is no minimum payout amount enforced by KunTips. Because
          the minimum individual tip on the platform is 100 NOK, any
          eligible balance will always be at least 100 NOK (less platform
          and processing fees) before a payout is requested.
        </p>
        <p>
          KunTips does not guarantee earnings. Tips are voluntary and
          KunTips makes no representation as to the volume of tips you will
          receive.
        </p>

        <h2>5. Taxes</h2>
        <p>
          You are solely responsible for declaring and paying all taxes
          applicable to income received through KunTips in your
          jurisdiction. KunTips does not withhold taxes on your behalf and
          does not issue tax certificates or annual income statements.
        </p>
        <p>
          Norwegian creators: income from tipping is generally taxable
          income in Norway. If your annual income from KunTips exceeds
          relevant reporting thresholds, you must report this to
          Skatteetaten. We strongly recommend consulting a tax adviser if
          you are unsure of your obligations.
        </p>
        <p>
          Non-Norwegian creators are responsible for understanding the tax
          laws in their own country of residence.
        </p>

        <h2>6. Refunds, Chargebacks, and Dispute Deductions</h2>
        <p>
          When a fan requests a refund or initiates a chargeback through
          their bank or card issuer, the following rules apply:
        </p>
        <ul>
          <li>
            <strong>Refunds:</strong> If a tip is refunded, you will be
            charged Stripe's non-refundable processing fee (currently 3.25%
            + 2 NOK of the original charge amount). KunTips does not retain
            any platform fee on refunded transactions.
          </li>
          <li>
            <strong>Chargebacks / Disputes:</strong> If a payment is
            disputed through the fan's bank, you are responsible for
            Stripe's dispute fee (currently 200 NOK) plus the processing
            fee. If the dispute is resolved in your favour by the card
            network, Stripe returns the dispute fee to you.
          </li>
          <li>
            KunTips will never profit from refunds or disputes and does not
            charge a platform fee on transactions where you do not receive
            any income.
          </li>
          <li>
            Refund or dispute deductions that exceed your current payout
            balance will result in a negative creator balance, which will
            be settled automatically from future payouts.
          </li>
        </ul>
        <p>
          Fee amounts stated above are current as of the last updated date
          of this Agreement and are subject to change by Stripe.
        </p>

        <h2>7. Prohibited Uses</h2>
        <p>
          As a creator you agree that KunTips may only be used as a
          voluntary monetary tipping service. You must not use KunTips:
        </p>
        <ul>
          <li>To sell, deliver, or provide access to goods, services, or
          digital content of any kind — including but not limited to
          subscriptions, media files, exclusive content, or
          pay-per-view;</li>
          <li>In connection with any activity involving minors in any
          capacity;</li>
          <li>To distribute, promote, or receive payment in connection with
          non-consensual intimate imagery or any illegal content;</li>
          <li>To commit fraud, money laundering, or any other financial
          crime;</li>
          <li>To promote or facilitate any activity on Stripe's Restricted
          Businesses list;</li>
          <li>To promote or receive payment for any age-restricted or
          regulated activity without the required licences and
          authorisations;</li>
          <li>To manipulate tip volumes, exploit the tier system, or
          generate fraudulent transactions;</li>
          <li>In any way that violates Norwegian law, EU law, or the laws of
          your country of residence.</li>
        </ul>
        <p>
          Violations may result in immediate account suspension, withholding
          of pending payouts pending investigation, and referral to
          relevant authorities.
        </p>

        <h2>8. Intellectual Property and Your Profile</h2>
        <p>
          You retain all intellectual property rights in your creator name,
          display name, biography, and any profile content you submit to
          KunTips. By submitting this content you grant KunTips a
          non-exclusive, royalty-free, worldwide licence to display and
          present this content solely for the purpose of operating your tip
          page and creator dashboard.
        </p>
        <p>
          KunTips will not use your name, username, likeness, or profile
          content in marketing materials without your explicit written
          consent.
        </p>
        <p>
          You are responsible for ensuring that your username, display name,
          and profile content do not infringe the intellectual property
          rights of any third party.
        </p>

        <h2>9. Copyright Infringement and Takedowns</h2>
        <p>
          KunTips does not host creator content. However, if you believe
          that your intellectual property rights have been violated in
          connection with any creator's username, display name, or profile
          information displayed on KunTips, please contact us at{" "}
          <a href="mailto:support@kuntips.no">support@kuntips.no</a> with
          the following information:
        </p>
        <ul>
          <li>Your name and contact details;</li>
          <li>A description of the intellectual property right you claim has
          been infringed;</li>
          <li>The specific content you believe infringes your rights and its
          location on KunTips;</li>
          <li>A statement that you have a good-faith belief the use is not
          authorised;</li>
          <li>A statement that the information you have provided is accurate
          and that you are authorised to act on behalf of the right
          holder.</li>
        </ul>
        <p>
          We will investigate and respond within 10 business days.
        </p>

        <h2>10. Anti-Money Laundering</h2>
        <p>
          By registering as a creator you confirm that you are not using
          KunTips to launder money, to circumvent financial reporting
          obligations, or to process proceeds of criminal activity. KunTips
          is required to comply with Norwegian anti-money laundering
          legislation (hvitvaskingsloven) and may be required to report
          suspicious activity to Finanstilsynet or other authorities without
          prior notice to you.
        </p>

        <h2>11. Account Suspension, Termination, and Appeals</h2>
        <p>
          KunTips may suspend or terminate your creator account at any time
          for violations of this Agreement, the Terms of Service, Stripe's
          requirements, regulatory requirements, or where we have reasonable
          grounds to suspect fraudulent or illegal activity.
        </p>
        <p>
          Where a suspension is not the result of confirmed fraud or illegal
          activity, we will aim to provide notice by email. In cases of
          confirmed or suspected fraud, immediate suspension without notice
          may be necessary.
        </p>
        <p>
          <strong>Appeals:</strong> If you believe your account has been
          suspended in error, you may submit an appeal to{" "}
          <a href="mailto:support@kuntips.no">support@kuntips.no</a> with a
          description of why you believe the suspension was incorrect. We
          will review your appeal and respond within 10 business days.
          KunTips' decision following an appeal is final.
        </p>
        <p>
          <strong>Account closure:</strong> You may request account closure
          at any time by contacting{" "}
          <a href="mailto:support@kuntips.no">support@kuntips.no</a>. Any
          outstanding eligible payout balance will be processed in the
          normal payout cycle. Accounts with outstanding negative balances
          cannot be closed until the balance is settled.
        </p>

        <h2>12. Compliance with Laws</h2>
        <p>
          You agree to comply with all applicable laws and regulations in
          your jurisdiction in connection with your use of KunTips,
          including but not limited to: tax laws, financial services
          regulations, anti-money laundering laws, data protection laws, and
          consumer protection laws.
        </p>

        <h2>13. Liability</h2>
        <p>
          KunTips and Eternal AS are not responsible for: your actions or
          content; loss of earnings due to account suspension, Stripe
          decisions, or technical issues; disputes between you and fans;
          tax liabilities arising from your use of the platform; or changes
          in Stripe's fees, policies, or service availability.
        </p>
        <p>
          Our total liability to you under this Agreement is limited as
          described in Section 13 of the Terms of Service.
        </p>

        <h2>14. Changes to This Agreement</h2>
        <p>
          KunTips may update this Agreement from time to time. We will
          notify you by email at least 14 days before material changes take
          effect. Continued use of the Service after changes take effect
          constitutes acceptance of the updated Agreement.
        </p>

        <h2>15. Contact</h2>
        <p>
          Eternal AS<br />
          Johan Berentsens vei 41, 5160 Laksevåg, Norway<br />
          Org.nr. 926462237<br />
          Email: <a href="mailto:support@kuntips.no">support@kuntips.no</a>
        </p>
      </div>
    </main>
  );
}
