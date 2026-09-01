import { usePageTitle } from "../hooks/usePageTitle.js";
import { useTipLang } from "../hooks/useTipLang.js";
import LegalLangToggle, { ConvenienceNote } from "../components/LegalLangToggle.jsx";

// Bilingual. The Norwegian version governs on conflict; English is a
// convenience translation (owner decision 26 Aug 2026).

export default function CookiesPage() {
  const { lang } = useTipLang();
  usePageTitle(lang === "no" ? "Informasjonskapsler" : "Cookie Policy");

  return (
    <main className="page page-legal card">
      <LegalLangToggle />
      {lang === "no" ? <NorwegianCookies /> : <EnglishCookies />}
    </main>
  );
}

function NorwegianCookies() {
  return (
    <>
      <h1 className="page-title">Informasjonskapsler</h1>
      <div className="page-body">
        <p>Sist oppdatert: 26. august 2026</p>
        <p>
          Denne erklæringen forklarer hvilke informasjonskapsler og
          lignende teknologier KunTips bruker, hvorfor vi bruker dem, og
          hvordan du kan styre dem. KunTips drives av Eternal AS, Norge.
        </p>
        <p>
          KunTips bruker nødvendige informasjonskapsler som alltid er
          aktive, samt valgfrie markedsføringskapsler (Meta og TikTok) som
          bare lastes hvis du samtykker. Vi laster aldri markedsførings-
          eller annonseteknologi før du har samtykket i banneret, og du kan
          endre eller trekke tilbake valget ditt når som helst via lenken
          «Innstillinger for informasjonskapsler» nederst på siden.
        </p>

        <h2>Hva er informasjonskapsler?</h2>
        <p>
          Informasjonskapsler (cookies) er små tekstfiler som et nettsted
          lagrer på enheten din. De brukes for at nettsteder skal fungere
          riktig og effektivt, og for å gi informasjon til den som driver
          nettstedet. I noen tilfeller bruker vi også nettleserens lokale
          lagring (som ligner informasjonskapsler); dette beskrives
          nedenfor.
        </p>

        <h2>Informasjonskapslene vi bruker</h2>

        <h3>Nødvendige – Cloudflare (tredjepart, infrastruktur)</h3>
        <p>
          Plattformen vår leveres gjennom Cloudflares infrastruktur.
          Cloudflare kan sette informasjonskapsler av sikkerhets- og
          ytelseshensyn.
        </p>
        <table>
          <thead>
            <tr>
              <th>Navn</th>
              <th>Formål</th>
              <th>Varighet</th>
              <th>Part</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>cf_clearance</code></td>
              <td>
                Cloudflares sikkerhetstoken. Settes etter at en bruker har
                bestått en bot-/DDoS-kontroll, slik at kontrollen ikke
                gjentas i samme økt.
              </td>
              <td>30 minutter – 24 timer</td>
              <td>Tredjepart (Cloudflare)</td>
            </tr>
            <tr>
              <td><code>__cf_bm</code></td>
              <td>
                Cloudflare Bot Management. Skiller mennesker fra
                automatisert trafikk av sikkerhets- og ytelseshensyn.
              </td>
              <td>30 minutter</td>
              <td>Tredjepart (Cloudflare)</td>
            </tr>
          </tbody>
        </table>

        <h3>Nødvendige – Stripe (tredjepart, betalingsbehandling)</h3>
        <p>
          Når du bruker Stripes betalingsskjema på en skapers tipsside,
          setter Stripe informasjonskapsler på enheten din for
          svindelforebygging og sikkerhet. Disse settes av Stripe, Inc. som
          selvstendig tjeneste. KunTips styrer ikke disse kapslene og har
          ikke tilgang til dataene de inneholder.
        </p>
        <table>
          <thead>
            <tr>
              <th>Navn</th>
              <th>Formål</th>
              <th>Varighet</th>
              <th>Part</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>__stripe_mid</code></td>
              <td>
                Stripes maskin-ID. Brukes til å avdekke og forebygge
                svindel ved å identifisere enheten som brukes til en
                betaling.
              </td>
              <td>1 år</td>
              <td>Tredjepart (Stripe)</td>
            </tr>
            <tr>
              <td><code>__stripe_sid</code></td>
              <td>
                Stripes økt-ID. Brukes til å avdekke og forebygge svindel
                under en betalingsøkt.
              </td>
              <td>30 minutter</td>
              <td>Tredjepart (Stripe)</td>
            </tr>
            <tr>
              <td><code>__stripe_ml</code></td>
              <td>
                Stripes maskinlæringsmodell. Vurderer betalingsrisiko ved
                hjelp av signaler fra enhetsfingeravtrykk for å avdekke
                svindelforsøk.
              </td>
              <td>1 år</td>
              <td>Tredjepart (Stripe)</td>
            </tr>
            <tr>
              <td><code>m</code></td>
              <td>
                Stripes enhets-ID. Skiller enheter fra hverandre for
                svindelforebygging på tvers av betalingsøkter.
              </td>
              <td>2 år</td>
              <td>Tredjepart (Stripe)</td>
            </tr>
          </tbody>
        </table>
        <p>
          Stripes bruk av disse kapslene reguleres av Stripes egen
          personvernerklæring på stripe.com/privacy. Stripes skript
          lastes bare når en skapers tipsside vises – kapslene settes ikke
          hvis du ikke besøker en tipsside.
        </p>

        <h3>Lokal lagring – KunTips skaperøkter</h3>
        <p>
          KunTips bruker nettleserens lokale lagring (ikke en
          informasjonskapsel) til å holde skapere innlogget. Dette er
          førstepart, lagres bare på din egen enhet og sendes aldri av
          KunTips til noen tredjepart.
        </p>
        <table>
          <thead>
            <tr>
              <th>Nøkkel</th>
              <th>Formål</th>
              <th>Varighet</th>
              <th>Part</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>kuntips_creator_session</code></td>
              <td>
                Lagrer et økttoken som holder en skaper innlogget i
                oversikten uten gjentatte pålogginger. Tokenet ugyldiggjøres
                ved utlogging, og økten på serversiden utløper senest 30
                dager etter innlogging.
              </td>
              <td>Til utlogging (maks 30 dager)</td>
              <td>Førstepart (KunTips)</td>
            </tr>
            <tr>
              <td><code>kuntips_creator_username</code></td>
              <td>
                Lagrer skaperens brukernavn lokalt for å fylle ut
                oversiktsadressen. Ingen sensitive data.
              </td>
              <td>Til utlogging</td>
              <td>Førstepart (KunTips)</td>
            </tr>
            <tr>
              <td><code>kuntips_creator_email</code></td>
              <td>
                Lagrer skaperens e-postadresse lokalt for visning. Sendes
                ikke til tredjeparter.
              </td>
              <td>Til utlogging</td>
              <td>Førstepart (KunTips)</td>
            </tr>
          </tbody>
        </table>
        <p>
          I tillegg setter KunTips noen få førsteparts-oppføringer for
          alle besøkende:
        </p>
        <table>
          <thead>
            <tr>
              <th>Nøkkel</th>
              <th>Formål</th>
              <th>Varighet</th>
              <th>Part</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>kuntips_cookie_consent</code></td>
              <td>
                Husker samtykkevalget ditt (godta eller avslå markedsføring)
                og når du tok det, slik at banneret ikke vises på nytt og
                valget ditt kan respekteres.
              </td>
              <td>Til du endrer eller sletter det</td>
              <td>Førstepart (KunTips)</td>
            </tr>
            <tr>
              <td><code>kuntips_tip_lang</code></td>
              <td>
                Husker språkvalget ditt (norsk/engelsk) for tips- og
                juridiske sider.
              </td>
              <td>Til det slettes</td>
              <td>Førstepart (KunTips)</td>
            </tr>
            <tr>
              <td><code>kuntips_referral</code></td>
              <td>
                Kommer du inn via en skapers vervelenke, lagres vervekoden
                slik at skaperen som vervet deg blir kreditert hvis du
                registrerer deg. Funksjonell, førstepart; brukes ikke til
                annonsering.
              </td>
              <td>30 dager</td>
              <td>Førstepart (KunTips)</td>
            </tr>
            <tr>
              <td><code>kuntips_ref_pinged_*</code></td>
              <td>
                Øktmarkør som hindrer at samme vervebesøk telles to ganger.
              </td>
              <td>Til fanen lukkes</td>
              <td>Førstepart (KunTips)</td>
            </tr>
          </tbody>
        </table>

        <h2>Markedsføring og analyse (krever samtykke)</h2>
        <p>
          Med ditt samtykke laster KunTips markedsføringspiksler fra Meta
          (Facebook/Instagram) og TikTok. Disse hjelper oss å måle effekten
          av annonseringen vår og nå relevante målgrupper. De lastes{" "}
          <strong>bare</strong> etter at du har trykket «Godta alle» i
          banneret. Velger du «Kun nødvendige», lastes ingen av dem, og
          ingen data sendes til Meta eller TikTok. Du kan trekke tilbake
          samtykket når som helst via lenken «Innstillinger for
          informasjonskapsler» nederst på siden.
        </p>

        <h3>Meta-piksel (tredjepart, markedsføring – krever samtykke)</h3>
        <table>
          <thead>
            <tr>
              <th>Navn</th>
              <th>Formål</th>
              <th>Varighet</th>
              <th>Part</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>_fbp</code></td>
              <td>
                Settes av Meta for å måle annonseeffekt og knytte
                konverteringer til annonser. Lastes bare etter samtykke.
              </td>
              <td>Inntil 90 dager</td>
              <td>Tredjepart (Meta)</td>
            </tr>
            <tr>
              <td><code>_fbc</code></td>
              <td>
                Lagrer klikk-ID-en fra en Meta-annonse for å knytte en
                senere konvertering til annonsen. Lastes bare etter
                samtykke.
              </td>
              <td>Inntil 90 dager</td>
              <td>Tredjepart (Meta)</td>
            </tr>
          </tbody>
        </table>

        <h3>TikTok-piksel (tredjepart, markedsføring – krever samtykke)</h3>
        <table>
          <thead>
            <tr>
              <th>Navn</th>
              <th>Formål</th>
              <th>Varighet</th>
              <th>Part</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>_ttp</code></td>
              <td>
                Settes av TikTok for å måle annonseeffekt og knytte
                konverteringer til annonser. Lastes bare etter samtykke.
              </td>
              <td>Inntil 13 måneder</td>
              <td>Tredjepart (TikTok)</td>
            </tr>
          </tbody>
        </table>
        <p>
          For å bedre nøyaktigheten sender KunTips også tilsvarende
          konverteringshendelser til Meta og TikTok direkte fra serverne
          våre. Disse sendes bare når du har gitt markedsføringssamtykke.
          E-postadressen din hashes (SHA-256) før overføring; ved
          registreringshendelsen overføres også IP-adressen din og
          nettleserens user-agent for å bedre treffsikkerheten.
        </p>

        <h3>Cloudflare Web Analytics (personvernvennlig, uten kapsler)</h3>
        <p>
          KunTips bruker Cloudflare Web Analytics for å forstå samlet
          trafikk (sidevisninger, henvisninger, land). Verktøyet er
          personvernvennlig: det setter ingen informasjonskapsler, bruker
          ikke fingeravtrykk og sporer ikke enkeltpersoner på tvers av
          nettsteder. Fordi det ikke samler inn personopplysninger og ikke
          lagrer noe på enheten din, brukes det uten samtykke som et
          nødvendig, personvernbevarende måleverktøy.
        </p>

        <h2>Rettslig grunnlag for nødvendige kapsler</h2>
        <p>
          Nødvendige informasjonskapsler (Cloudflares sikkerhet, Stripes
          svindelforebygging) brukes på grunnlag av vår berettigede
          interesse (GDPR artikkel 6 nr. 1 bokstav f) i å opprettholde
          plattformsikkerheten, forebygge svindel og sikre at tjenesten
          fungerer. Disse kan ikke slås av uten at plattformens
          funksjonalitet svekkes. Skaperes lokale lagringsoppføringer
          brukes på grunnlag av avtale (GDPR artikkel 6 nr. 1 bokstav b),
          siden de er nødvendige for å levere skaperoversikten.
        </p>
        <p>
          Markedsføringskapsler og serverside-konverteringshendelser (Meta,
          TikTok) brukes utelukkende på grunnlag av ditt samtykke (GDPR
          artikkel 6 nr. 1 bokstav a). De lastes eller sendes aldri før du
          har samtykket, og du kan når som helst trekke samtykket tilbake
          via lenken «Innstillinger for informasjonskapsler» nederst på
          siden; da slutter vi å sende flere hendelser. Skript som allerede
          er lastet, blir værende til du laster siden på nytt, og kapsler
          som allerede er satt, blir liggende til de utløper eller du
          sletter dem.
        </p>

        <h2>Slik styrer du informasjonskapsler</h2>
        <p>
          Du kan styre og slette informasjonskapsler i innstillingene i
          nettleseren din. Merk at deaktivering kan påvirke
          funksjonaliteten på KunTips, særlig Stripes betalingsskjema, som
          er avhengig av sine svindelforebyggende kapsler for å fungere.
        </p>
        <p>Veiledning for de vanligste nettleserne:</p>
        <ul>
          <li>Chrome: support.google.com/chrome/answer/95647</li>
          <li>Firefox: support.mozilla.org/kb/cookies-information-websites-store-on-your-computer</li>
          <li>Safari: support.apple.com/guide/safari/manage-cookies</li>
          <li>Edge: support.microsoft.com/microsoft-edge/cookies</li>
        </ul>

        <h2>Oppdateringer</h2>
        <p>
          Vi kan oppdatere denne erklæringen fra tid til annen for å
          gjenspeile endringer i kapslene vi bruker, eller av driftsmessige,
          rettslige eller regulatoriske grunner. Endringer publiseres på
          denne siden med ny dato.
        </p>

        <h2>Kontakt</h2>
        <p>
          Eternal AS<br />
          Johan Berentsens vei 41, 5160 Laksevåg, Norge<br />
          Org.nr. 926 462 237<br />
          E-post: <a href="mailto:support@kuntips.no">support@kuntips.no</a>
        </p>
      </div>
    </>
  );
}

function EnglishCookies() {
  return (
    <>
      <h1 className="page-title">Cookie Policy</h1>
      <div className="page-body">
        <p>Last updated: 26 August 2026</p>
        <ConvenienceNote />
        <p>
          This Cookie Policy explains what cookies and similar technologies
          KunTips uses, why we use them, and how you can control them.
          KunTips is operated by Eternal AS, Norway.
        </p>
        <p>
          KunTips uses essential cookies that are always active, plus optional
          marketing cookies (Meta and TikTok) that only load if you give your
          consent. We never load marketing or advertising technologies before
          you opt in via the cookie banner, and you can change or withdraw your
          choice at any time using the cookie settings link in the footer (labelled "Innstillinger for informasjonskapsler").
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
          Policy, available at stripe.com/privacy. Stripe's script is
          only loaded when a creator's tip page is shown — these cookies
          are not set if you do not visit a tip page.
        </p>

        <h3>Local storage — KunTips creator sessions</h3>
        <p>
          KunTips uses browser local storage (not a cookie) to maintain
          creator login sessions. This is first-party, stored only on your
          own device, and is never transmitted by KunTips to any third
          party.
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
                invalidated on logout, and the server-side session expires
                at the latest 30 days after login.
              </td>
              <td>Until logout (max 30 days)</td>
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
          In addition, KunTips sets a small number of first-party entries
          for all visitors:
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
              <td><code>kuntips_cookie_consent</code></td>
              <td>
                Remembers your cookie-consent choice (accept or decline
                marketing) and when you made it, so the banner is not shown
                again and your choice can be honoured.
              </td>
              <td>Until you change or clear it</td>
              <td>First-party (KunTips)</td>
            </tr>
            <tr>
              <td><code>kuntips_tip_lang</code></td>
              <td>
                Remembers your chosen language (Norwegian/English) for the
                tip and legal pages.
              </td>
              <td>Until cleared</td>
              <td>First-party (KunTips)</td>
            </tr>
            <tr>
              <td><code>kuntips_referral</code></td>
              <td>
                If you arrive via a creator's referral link, stores the
                referral code so the referring creator is credited if you
                sign up. Functional, first-party; not used for advertising.
              </td>
              <td>30 days</td>
              <td>First-party (KunTips)</td>
            </tr>
            <tr>
              <td><code>kuntips_ref_pinged_*</code></td>
              <td>
                Session-only marker that prevents the same referral visit
                from being counted twice.
              </td>
              <td>Until the tab is closed</td>
              <td>First-party (KunTips)</td>
            </tr>
          </tbody>
        </table>

        <h2>Marketing &amp; analytics (consent required)</h2>
        <p>
          With your consent, KunTips loads marketing pixels from Meta
          (Facebook/Instagram) and TikTok. These help us measure the
          effectiveness of our advertising and reach relevant audiences. They
          are <strong>only</strong> loaded after you click "Accept all" in the
          cookie banner. If you choose "Necessary only", none of these are
          loaded and no data is sent to Meta or TikTok. You can withdraw consent
          at any time via the cookie settings link in the footer (labelled "Innstillinger for informasjonskapsler").
        </p>

        <h3>Meta Pixel (third-party, marketing — consent required)</h3>
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
              <td><code>_fbp</code></td>
              <td>
                Set by Meta to measure ad performance and attribute
                conversions. Loaded only after marketing consent is given.
              </td>
              <td>Up to 90 days</td>
              <td>Third-party (Meta)</td>
            </tr>
            <tr>
              <td><code>_fbc</code></td>
              <td>
                Stores the click identifier from a Meta ad to attribute a later
                conversion. Loaded only after marketing consent is given.
              </td>
              <td>Up to 90 days</td>
              <td>Third-party (Meta)</td>
            </tr>
          </tbody>
        </table>

        <h3>TikTok Pixel (third-party, marketing — consent required)</h3>
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
              <td><code>_ttp</code></td>
              <td>
                Set by TikTok to measure ad performance and attribute
                conversions. Loaded only after marketing consent is given.
              </td>
              <td>Up to 13 months</td>
              <td>Third-party (TikTok)</td>
            </tr>
          </tbody>
        </table>
        <p>
          To improve accuracy, KunTips also sends corresponding conversion
          events to Meta and TikTok directly from our servers. These
          server-side events are only sent when you have given marketing
          consent. Your email address is hashed (SHA-256) before
          transmission; for the signup event, your IP address and browser
          user agent are also transmitted to improve match accuracy.
        </p>

        <h3>Cloudflare Web Analytics (privacy-first, no cookies)</h3>
        <p>
          KunTips uses Cloudflare Web Analytics to understand aggregate traffic
          (page views, referrers, countries). It is privacy-first: it sets no
          cookies, does not use fingerprinting, and does not track individuals
          across sites. Because it collects no personal data and stores nothing
          on your device, it operates without consent as an essential,
          privacy-preserving measurement tool.
        </p>

        <h2>Legal basis for essential cookies</h2>
        <p>
          Essential cookies (Cloudflare security, Stripe fraud prevention)
          are used on the basis of our legitimate interests (GDPR Article
          6(1)(f)) in maintaining platform security, preventing fraud, and
          ensuring the service functions correctly. These cookies cannot be
          disabled without impairing the functionality of the platform.
          Creator local storage entries are used on the basis of contract
          (GDPR Article 6(1)(b)) as they are necessary to provide the
          creator dashboard service.
        </p>
        <p>
          Marketing cookies and server-side conversion events (Meta, TikTok)
          are used only on the basis of your consent (GDPR Article 6(1)(a)).
          They are never loaded or sent before you opt in, and you may withdraw
          consent at any time via the cookie settings link in the footer
          (labelled "Innstillinger for informasjonskapsler"); we then stop
          sending any further events. Already-loaded scripts remain until
          you reload the page, and previously set cookies remain until they
          expire or you delete them.
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
          Org.nr. 926 462 237<br />
          Email: <a href="mailto:support@kuntips.no">support@kuntips.no</a>
        </p>
      </div>
    </>
  );
}
