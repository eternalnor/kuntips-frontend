import { usePageTitle } from "../hooks/usePageTitle.js";

export default function CookiesPage() {
  usePageTitle("Cookie Policy");
  return (
    <main className="page page-legal card">
      <h1 className="page-title">Cookie Policy</h1>
      <div className="page-body">
        <p>Last updated: 31 March 2026</p>
        <p>
          This Cookie Policy explains what cookies and similar technologies
          KunTips uses, why we use them, and how you can control them.
          KunTips is operated by Eternal AS, Norway.
        </p>
        <p>
          KunTips uses a minimal number of cookies. We do not use
          advertising cookies, behavioural tracking cookies, or any
          third-party marketing or profiling technologies.
        </p>

        <h2>What are cookies?</h2>
        <p>
          Cookies are small text files placed on your device by a website.
          They are widely used to make websites work correctly and
          efficiently, and to provide information to site operators. We also
          use browser local storage (similar to cookies) in certain cases,
          which is described below.
        </p>

        <h2>Cookies we use</h2>

        <h3>Essential — Cloudflare (third-party, infrastructure)</h3>
        <p>
          Our platform is served through Cloudflare's infrastructure.
          Cloudflare may set cookies for security and performance purposes.
        </p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Purpose</th>
              <th>Duration</th>
              <th>Party</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>cf_clearance</code></td>
              <td>
                Cloudflare security challenge token. Set after a user passes
                a bot/DDoS challenge. Prevents repeated security challenges
                within the same session.
              </td>
              <td>30 minutes – 24 hours</td>
              <td>Third-party (Cloudflare)</td>
            </tr>
            <tr>
              <td><code>__cf_bm</code></td>
              <td>
                Cloudflare Bot Management. Used to distinguish human users
                from automated traffic for security and performance.
              </td>
              <td>30 minutes</td>
              <td>Third-party (Cloudflare)</td>
            </tr>
          </tbody>
        </table>

        <h3>Essential — Stripe (third-party, payment processing)</h3>
        <p>
          When you interact with the Stripe payment form on a creator's tip
          page, Stripe sets cookies on your device for fraud prevention and
          security purposes. These are set by Stripe, Inc. as an independent
          service. KunTips does not control these cookies or have access to
          the data they contain.
        </p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Purpose</th>
              <th>Duration</th>
              <th>Party</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>__stripe_mid</code></td>
              <td>
                Stripe machine identifier. Used for fraud detection and
                prevention by identifying the device used for a payment.
              </td>
              <td>1 year</td>
              <td>Third-party (Stripe)</td>
            </tr>
            <tr>
              <td><code>__stripe_sid</code></td>
              <td>
                Stripe session identifier. Used for fraud detection and
                prevention during a payment session.
              </td>
              <td>30 minutes</td>
              <td>Third-party (Stripe)</td>
            </tr>
            <tr>
              <td><code>__stripe_ml</code></td>
              <td>
                Stripe machine learning model. Used to assess payment risk
                using device fingerprinting signals to detect fraudulent
                transactions.
              </td>
              <td>1 year</td>
              <td>Third-party (Stripe)</td>
            </tr>
            <tr>
              <td><code>m</code></td>
              <td>
                Stripe device identifier. Used to distinguish devices for
                fraud prevention across payment sessions.
              </td>
              <td>2 years</td>
              <td>Third-party (Stripe)</td>
            </tr>
          </tbody>
        </table>
        <p>
          Stripe's use of these cookies is governed by Stripe's own Privacy
          Policy, available at stripe.com/privacy. The Stripe payment
          element only loads on tip pages — these cookies are not set if
          you do not visit a creator's tip page.
        </p>

        <h3>Local storage — KunTips creator sessions</h3>
        <p>
          KunTips uses browser local storage (not a cookie) to maintain
          creator login sessions. This is first-party, stored only on your
          own device, and is not accessible to any third party.
        </p>
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Purpose</th>
              <th>Duration</th>
              <th>Party</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>kuntips_creator_session</code></td>
              <td>
                Stores a session token to keep a creator logged in to their
                dashboard without requiring repeated logins. The token is
                invalidated on logout.
              </td>
              <td>Until logout</td>
              <td>First-party (KunTips)</td>
            </tr>
            <tr>
              <td><code>kuntips_creator_username</code></td>
              <td>
                Stores the creator's username locally to pre-fill the
                dashboard URL. No sensitive data.
              </td>
              <td>Until logout</td>
              <td>First-party (KunTips)</td>
            </tr>
            <tr>
              <td><code>kuntips_creator_email</code></td>
              <td>
                Stores the creator's email locally for display convenience.
                Not transmitted to third parties.
              </td>
              <td>Until logout</td>
              <td>First-party (KunTips)</td>
            </tr>
          </tbody>
        </table>
        <p>
          These local storage entries are only ever created if you log in
          as a creator. Fans who do not create an account will have no
          KunTips local storage entries set.
        </p>

        <h2>Analytics</h2>
        <p>
          KunTips does not currently use any analytics, tracking, or
          performance monitoring tools beyond those already described above
          (Cloudflare infrastructure). No personal data is shared with
          analytics providers. If this changes in the future, this policy
          will be updated before any analytics are enabled.
        </p>

        <h2>Legal basis for essential cookies</h2>
        <p>
          Essential cookies (Cloudflare security, Stripe fraud prevention)
          are used on the basis of our legitimate interests (GDPR Article
          6(1)(f)) in maintaining platform security, preventing fraud, and
          ensuring the Service functions correctly. These cookies cannot be
          disabled without impairing the functionality of the platform.
          Creator local storage entries are used on the basis of contract
          (GDPR Article 6(1)(b)) as they are necessary to provide the
          creator dashboard service.
        </p>

        <h2>Managing cookies</h2>
        <p>
          You can control and delete cookies through your browser settings.
          Please note that disabling cookies may affect the functionality
          of KunTips, particularly the Stripe payment form, which requires
          its fraud-prevention cookies to function correctly.
        </p>
        <p>
          For guidance on managing cookies in your browser, visit:
        </p>
        <ul>
          <li>Chrome: support.google.com/chrome/answer/95647</li>
          <li>Firefox: support.mozilla.org/kb/cookies-information-websites-store-on-your-computer</li>
          <li>Safari: support.apple.com/guide/safari/manage-cookies</li>
          <li>Edge: support.microsoft.com/microsoft-edge/cookies</li>
        </ul>

        <h2>Updates</h2>
        <p>
          We may update this Cookie Policy from time to time to reflect
          changes to the cookies we use or for operational, legal, or
          regulatory reasons. Changes will be posted on this page with an
          updated date.
        </p>

        <h2>Contact</h2>
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
