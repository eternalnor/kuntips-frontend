import { usePageTitle } from "../hooks/usePageTitle.js";
import { useTipLang } from "../hooks/useTipLang.js";
import LegalLangToggle, { ConvenienceNote } from "../components/LegalLangToggle.jsx";

// Bilingual. The Norwegian version governs on conflict; English is a
// convenience translation (owner decision 26 Aug 2026).

export default function PrivacyPage() {
  const { lang, toggle } = useTipLang();
  usePageTitle(lang === "no" ? "Personvern" : "Privacy Policy");

  return (
    <main className="page page-legal card">
      <LegalLangToggle
        lang={lang}
        toggle={toggle}
        labels={
          lang === "no"
            ? { switchTo: "English", ariaLabel: "Switch to English" }
            : { switchTo: "Norsk", ariaLabel: "Bytt til norsk" }
        }
      />
      {lang === "no" ? <NorwegianPrivacy /> : <EnglishPrivacy />}
    </main>
  );
}

function NorwegianPrivacy() {
  return (
    <>
      <h1 className="page-title">Personvernerklæring</h1>
      <div className="page-body">
        <p>Sist oppdatert: 26. august 2026</p>
        <p>
          Denne personvernerklæringen forklarer hvordan Eternal AS,
          organisasjonsnummer 926 462 237, Norge («KunTips», «vi», «oss»)
          samler inn, bruker, lagrer og beskytter personopplysninger når du
          bruker KunTips-plattformen («Tjenesten»). KunTips er
          behandlingsansvarlig for personopplysningene som beskrives her.
        </p>
        <p>
          Erklæringen er utformet i samsvar med EUs personvernforordning
          (GDPR), slik den er gjennomført i Norge gjennom
          personopplysningsloven.
        </p>

        <h2>1. Hvilke opplysninger vi samler inn, og hvorfor</h2>
        <p>
          Vi samler bare inn opplysningene som trengs for å drive Tjenesten.
          Nedenfor beskrives hver kategori, det rettslige grunnlaget etter
          GDPR artikkel 6, og formålet.
        </p>

        <h3>Tipsere (brukere uten konto som sender tips)</h3>
        <ul>
          <li>
            <strong>Transaksjonsdata</strong> (tipsbeløp, tidspunkt, valuta,
            betalingsstatus) – <em>Rettslig grunnlag: berettiget interesse
            (artikkel 6 nr. 1 bokstav f)</em> – for å drive
            tipsplattformen, avstemme betalinger og avdekke svindel.
          </li>
          <li>
            <strong>Valgfritt visningsnavn</strong> – hvis du velger å legge
            igjen navnet ditt når du tipser – <em>Rettslig grunnlag:
            samtykke (artikkel 6 nr. 1 bokstav a)</em> – for å vise navnet
            ditt til skaperen du tipset. Å legge igjen navn er helt
            frivillig; lar du feltet stå tomt, forblir du anonym.
          </li>
          <li>
            <strong>IP-adresse og informasjon om enhet/nettleser</strong> –
            <em> Rettslig grunnlag: berettiget interesse (artikkel 6 nr. 1
            bokstav f)</em> – for svindelforebygging, misbruksdeteksjon og
            plattformsikkerhet. IP-adresser deles ikke med skapere. De
            brukes ikke til annonseprofilering og deles ikke med
            annonsenettverk, med mindre du har gitt markedsføringssamtykke
            – da kan IP-adressen din og nettleserinformasjon overføres til
            Meta og TikTok for konverteringsmåling.
          </li>
        </ul>
        <p>
          KunTips samler ikke inn navn eller kortopplysninger fra tipsere.
          Oppgir du frivillig en e-postadresse for å få kvittering, sender
          vi den videre til Stripe for utsending av kvitteringen og lagrer
          den ikke selv; har du gitt markedsføringssamtykke, deles en
          hashet versjon av den med Meta og TikTok for konverteringsmåling.
          Alle betalingsdata behandles direkte av Stripe. Se punkt 7 om
          tredjeparts betalingsbehandling.
        </p>

        <h3>Skapere (registrerte kontoer)</h3>
        <ul>
          <li>
            <strong>Kontoinformasjon</strong> (e-postadresse, brukernavn,
            visningsnavn, bio) – <em>Rettslig grunnlag: avtale (artikkel 6
            nr. 1 bokstav b)</em> – nødvendig for å opprette og drive
            skaperkontoen og tipssiden din.
          </li>
          <li>
            <strong>Inntjenings- og tipsstatistikk</strong> (tipsvolumer,
            utbetalingshistorikk, nivåinformasjon) – <em>Rettslig grunnlag:
            avtale (artikkel 6 nr. 1 bokstav b)</em> – for å drive gebyr- og
            utbetalingssystemet og vise oversikten din.
          </li>
          <li>
            <strong>Passord (hashet)</strong> – <em>Rettslig grunnlag:
            avtale (artikkel 6 nr. 1 bokstav b)</em> – for pålogging.
            Passord lagres som kryptografiske enveishasher og kan ikke
            leses av KunTips' ansatte.
          </li>
          <li>
            <strong>IP-adresse og øktdata</strong> – <em>Rettslig grunnlag:
            berettiget interesse (artikkel 6 nr. 1 bokstav f)</em> – for
            kontosikkerhet, svindelforebygging og håndtering av
            innloggingsøkter. Har du gitt markedsføringssamtykke, overføres
            IP-adressen din og nettleserinformasjon også til Meta og TikTok
            sammen med konverteringshendelsen ved registrering.
          </li>
          <li>
            <strong>Registrering av markedsføringssamtykke</strong> (valget
            ditt og tidspunktet for det) – <em>Rettslig grunnlag: samtykke
            (artikkel 6 nr. 1 bokstav a)</em> – lagres for å respektere og
            dokumentere valget ditt om konverteringsmålingen beskrevet i
            punkt 2 og i erklæringen om informasjonskapsler.
          </li>
        </ul>

        <h3>Vervelenker (alle besøkende)</h3>
        <p>
          Kommer du inn via en skapers vervelenke (en nettadresse med en
          vervekode), logger vi vervekoden, siden du besøkte, et tidspunkt
          og en avkortet, irreversibel hash avledet av IP-adressen din og
          nettleserinformasjon – <em>Rettslig grunnlag: berettiget
          interesse (artikkel 6 nr. 1 bokstav f)</em> – for å knytte
          skaperregistreringer til vervelenker og lage aggregert
          vervestatistikk. Hashen kan ikke brukes til å identifisere deg.
          Selve vervekoden lagres i nettleseren din i inntil 30 dager; se
          erklæringen om informasjonskapsler.
        </p>

        <h2>2. Hva vi bruker opplysningene til</h2>
        <p>Vi bruker personopplysninger utelukkende til å:</p>
        <ul>
          <li>Drive, vedlikeholde og forbedre KunTips-plattformen;</li>
          <li>Behandle og avstemme tipsbetalinger via Stripe;</li>
          <li>Beregne og administrere utbetalinger til skapere og nivåplasseringer;</li>
          <li>Forebygge svindel, misbruk og hvitvasking;</li>
          <li>Yte brukerstøtte;</li>
          <li>Måle annonsekonverteringer – bare med ditt uttrykkelige
          markedsføringssamtykke;</li>
          <li>Oppfylle rettslige og regulatoriske forpliktelser.</li>
        </ul>
        <p>
          Vi selger ikke personopplysninger. Med ditt uttrykkelige
          markedsføringssamtykke (og bare da) deler vi en hashet versjon av
          e-postadressen din, og ved enkelte hendelser IP-adressen din og
          nettleserinformasjon, med Meta Platforms og TikTok for å måle
          annonsekonverteringer – se erklæringen om informasjonskapsler for
          detaljer. Utover dette deler vi ikke personopplysninger med
          annonsenettverk, og vi bruker ikke personopplysninger til
          annonseprofilering.
        </p>

        <h2>3. Lagringstid</h2>
        <ul>
          <li>
            <strong>Kontoopplysninger for skapere</strong> oppbevares så
            lenge kontoen består. Opplysninger som inngår i
            regnskapsmateriale, oppbevares deretter i fem år etter utløpet
            av regnskapsåret, i samsvar med bokføringsloven.
          </li>
          <li>
            <strong>Transaksjonsdata</strong> (tipsbeløp, datoer,
            utbetalingshistorikk) oppbevares i minst 5 år for å oppfylle
            norske bokførings- og skatterapporteringsplikter.
          </li>
          <li>
            <strong>Rå IP-adresser</strong> som brukes til
            trafikkbegrensning, lagres kortvarig (høyst noen timer).
            Pseudonymiserte verve- og sikkerhetsdata (en avkortet hash
            avledet av IP og nettleserinformasjon, som ikke kan
            tilbakeføres til deg) inngår i aggregert statistikk.
          </li>
          <li>
            <strong>Valgfrie tipsernavn</strong> lagres som en del av
            transaksjonsdataene og oppbevares like lenge som disse (5 år).
          </li>
        </ul>

        <h2>4. Automatiserte avgjørelser</h2>
        <p>
          KunTips bruker automatiserte prosesser til å plassere skapere på
          nivåer basert på tipsvolum. Dette er ikke en avgjørelse med
          rettsvirkning eller tilsvarende betydelig virkning; det er en
          enkel beregning basert på din egen inntjening. Det treffes ingen
          helautomatiserte avgjørelser med betydelige rettslige
          konsekvenser for enkeltbrukere.
        </p>

        <h2>5. Overføring til land utenfor EØS</h2>
        <p>
          KunTips bruker følgende tredjepartstjenester som kan behandle
          personopplysninger utenfor EØS, blant annet i USA:
        </p>
        <ul>
          <li>
            <strong>Stripe, Inc.</strong> (USA) – betalingsbehandling og
            identitetskontroll av skapere (KYC). Stripe behandler
            betalingsdata som selvstendig behandlingsansvarlig.
            Overføringene er beskyttet av EU-kommisjonens godkjente standard personvernbestemmelser
            (Standard Contractual Clauses, SCC). Se Stripes personvernerklæring
            på stripe.com/privacy.
          </li>
          <li>
            <strong>Cloudflare, Inc.</strong> (USA) – vår
            infrastrukturleverandør, som håndterer DNS, CDN og Cloudflare Workers- og
            D1-databasetjenestene som driver KunTips-backenden. Overføringene er
            beskyttet av standardkontraktsklausuler. Se Cloudflares
            personvernerklæring på cloudflare.com/privacypolicy.
          </li>
          <li>
            <strong>Resend, Inc.</strong> (USA) – utsending av
            transaksjonse-post. Resend behandler skaperes e-postadresser og
            innholdet i kontorelaterte e-poster (for eksempel
            utbetalingsbekreftelser, som inneholder utbetalingsbeløp og
            tipsernavn), herunder e-postbekreftelse, tilbakestilling av
            passord og utbetalingsbekreftelser. Overføringene er beskyttet av
            standardkontraktsklausuler. Se Resends personvernerklæring på
            resend.com/legal/privacy-policy.
          </li>
          <li>
            <strong>Meta Platforms, Inc.</strong> (USA) – bare med ditt
            markedsføringssamtykke: mottar hashede e-postadresser og, ved
            enkelte hendelser, IP-adresse og nettleserinformasjon, for
            måling av annonsekonverteringer. Overføringene bygger på
            EU–USA-rammeverket for personvern (Data Privacy Framework)
            og/eller standardkontraktsklausuler. Se
            facebook.com/privacy/policy.
          </li>
          <li>
            <strong>TikTok</strong> (konsernselskaper i Singapore, USA og
            andre land) – bare med ditt markedsføringssamtykke: mottar
            hashede e-postadresser og, ved enkelte hendelser, IP-adresse og
            nettleserinformasjon, for måling av annonsekonverteringer.
            Overføringene bygger på standardkontraktsklausuler. Se
            tiktok.com/legal/privacy-policy.
          </li>
        </ul>
        <p>
          Vi tar rimelige skritt for å sikre at disse leverandørene holder
          et personvernnivå i samsvar med kravene i GDPR.
        </p>

        <h2>6. Informasjonskapsler og lokal lagring</h2>
        <p>
          Se erklæringen om informasjonskapsler for fullstendige detaljer om
          hvilke informasjonskapsler og hvilken lokal lagring vi bruker.
        </p>

        <h2>7. Tredjeparts betalingsbehandling</h2>
        <p>
          Alle kortdata samles inn og behandles utelukkende av Stripe, Inc.
          KunTips verken mottar, lagrer eller har tilgang til kortnummeret
          ditt, CVV-koden eller fullstendige faktureringsopplysninger. Stripe er
          selvstendig behandlingsansvarlig for betalingsinformasjon og er
          underlagt egen personvernerklæring og PCI DSS-krav.
        </p>

        <h2>8. Sikkerhet</h2>
        <p>
          All datatrafikk krypteres (HTTPS/TLS). Skaperes passord lagres som
          saltede enveishasher. Økttokener lagres i nettleserens lokale
          lagring; økten på serversiden ugyldiggjøres når du logger ut, og
          utløper automatisk 30 dager etter innlogging. Infrastrukturen vår kjører på
          Cloudflares plattform, som gir DDoS-beskyttelse og fysisk
          sikkerhet på infrastrukturnivå.
        </p>
        <p>
          Ingen lagrings- eller overføringsmetode er fullstendig sikker.
          Ved brudd på personopplysningssikkerheten som sannsynligvis
          medfører risiko for dine rettigheter og friheter, varsler vi
          Datatilsynet innen 72 timer i tråd med GDPR artikkel 33, og
          berørte personer der det kreves.
        </p>

        <h2>9. Dine rettigheter etter GDPR</h2>
        <p>
          Er du i EU/EØS (inkludert Norge), har du følgende rettigheter
          knyttet til personopplysningene dine. For å bruke en rettighet,
          kontakt oss på{" "}
          <a href="mailto:support@kuntips.no">support@kuntips.no</a>. Vi
          svarer innen 30 dager.
        </p>
        <ul>
          <li>
            <strong>Rett til innsyn (artikkel 15)</strong> – du kan be om en
            kopi av personopplysningene vi har om deg.
          </li>
          <li>
            <strong>Rett til retting (artikkel 16)</strong> – du kan be oss
            rette uriktige eller ufullstendige opplysninger.
          </li>
          <li>
            <strong>Rett til sletting (artikkel 17)</strong> – du kan be oss
            slette personopplysningene dine i visse tilfeller, med forbehold
            om lovpålagt oppbevaring (f.eks. regnskapsmateriale som må
            oppbevares i 5 år).
          </li>
          <li>
            <strong>Rett til begrensning av behandling (artikkel 18)</strong>
            – du kan be oss begrense behandlingen av opplysningene dine i
            visse tilfeller.
          </li>
          <li>
            <strong>Rett til dataportabilitet (artikkel 20)</strong> – for
            opplysninger som behandles på grunnlag av samtykke eller avtale,
            kan du be om å få dem utlevert i et strukturert, maskinlesbart
            format.
          </li>
          <li>
            <strong>Rett til å protestere (artikkel 21)</strong> – du kan
            protestere mot behandling basert på vår berettigede interesse.
            Vi stanser behandlingen med mindre vi har tvingende berettigede
            grunner.
          </li>
          <li>
            <strong>Rettigheter ved automatiserte avgjørelser (artikkel
            22)</strong> – du har rett til ikke å være gjenstand for
            helautomatiserte avgjørelser med betydelig rettsvirkning.
          </li>
        </ul>

        <h2>10. Rett til å klage</h2>
        <p>
          Du har rett til å klage til tilsynsmyndigheten for personvern i
          Norge hvis du mener vi har behandlet personopplysningene dine
          ulovlig:
        </p>
        <p>
          <strong>Datatilsynet</strong><br />
          Postboks 458 Sentrum, 0105 Oslo, Norge<br />
          Nettsted: datatilsynet.no<br />
          E-post: postkasse@datatilsynet.no
        </p>
        <p>
          Vi setter likevel pris på muligheten til å løse saken direkte før
          du kontakter tilsynsmyndigheten. Ta gjerne kontakt med oss først
          på <a href="mailto:support@kuntips.no">support@kuntips.no</a>.
        </p>

        <h2>11. Mindreårige</h2>
        <p>
          KunTips retter seg ikke mot personer under 18 år. Vi samler ikke
          bevisst inn personopplysninger fra mindreårige. Hvis du tror vi
          utilsiktet har samlet inn opplysninger fra en mindreårig, kontakt
          oss umiddelbart på{" "}
          <a href="mailto:support@kuntips.no">support@kuntips.no</a>, så
          sletter vi dem uten opphold.
        </p>

        <h2>12. Endringer i erklæringen</h2>
        <p>
          Vi kan oppdatere denne personvernerklæringen fra tid til annen.
          Registrerte skapere varsles på e-post om vesentlige endringer. Den
          oppdaterte erklæringen publiseres på denne siden med ny dato.
          Fortsatt bruk av Tjenesten etter ikrafttredelsen regnes som aksept
          av den oppdaterte erklæringen.
        </p>

        <h2>13. Kontakt</h2>
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

function EnglishPrivacy() {
  return (
    <>
      <h1 className="page-title">Privacy Policy</h1>
      <div className="page-body">
        <p>Last updated: 26 August 2026</p>
        <ConvenienceNote />
        <p>
          This Privacy Policy explains how Eternal AS, organisasjonsnummer
          926 462 237, Norway ("KunTips", "we", "us") collects, uses, stores,
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
            <strong>IP address and device/browser information</strong> —{" "}
            <em>Legal basis: Legitimate interests (Article 6(1)(f))</em> —
            for fraud prevention, abuse detection, and platform security.
            IP addresses are not shared with creators. They are not used
            for advertising profiling and are not shared with advertising
            networks, unless you have given marketing consent — in which
            case your IP address and browser information may be transmitted
            to Meta and TikTok for conversion measurement.
          </li>
        </ul>
        <p>
          KunTips does not collect your name or payment card details as a
          fan. If you optionally enter an email address to receive a
          receipt, we pass it to Stripe to send the receipt and do not
          store it ourselves; if you have given marketing consent, a hashed
          version of it is shared with Meta and TikTok for conversion
          measurement. All payment data is processed directly by Stripe.
          See Section 7 for more on third-party processors.
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
            security, fraud prevention, and login session management. If
            you have given marketing consent, your IP address and browser
            information are also transmitted to Meta and TikTok with the
            signup conversion event.
          </li>
          <li>
            <strong>Marketing consent record</strong> (your choice and its
            timestamp) — <em>Legal basis: Consent (Article 6(1)(a))</em> —
            kept to honour and demonstrate your choice regarding the
            conversion measurement described in Section 2 and in the Cookie
            Policy.
          </li>
        </ul>

        <h3>Referral links (all visitors)</h3>
        <p>
          When you arrive via a creator's referral link (a web address
          containing a referral code), we log the referral code, the page
          visited, a timestamp, and a truncated, irreversible hash derived
          from your IP address and browser information —{" "}
          <em>Legal basis: Legitimate interests (Article 6(1)(f))</em> — to
          attribute creator sign-ups to referral links and compute
          aggregate referral statistics. The hash cannot be used to
          identify you. The referral code itself is kept in your browser
          for up to 30 days; see the Cookie Policy.
        </p>

        <h2>2. How We Use Your Data</h2>
        <p>We use personal data solely to:</p>
        <ul>
          <li>Operate, maintain, and improve the KunTips platform;</li>
          <li>Process and reconcile tip payments via Stripe;</li>
          <li>Calculate and administer creator payouts and tier assignments;</li>
          <li>Prevent fraud, abuse, and money laundering;</li>
          <li>Provide customer support;</li>
          <li>Measure advertising conversions — only with your explicit
          marketing consent;</li>
          <li>Comply with legal and regulatory obligations.</li>
        </ul>
        <p>
          We do not sell personal data. With your explicit marketing
          consent (and only then), we share a hashed version of your email
          address, and in some events your IP address and browser
          information, with Meta Platforms and TikTok to measure
          advertising conversions — see the Cookie Policy for details. We
          do not otherwise share personal data with advertising networks,
          and we do not use personal data for advertising profiling beyond
          this consent-based conversion measurement.
        </p>

        <h2>3. Data Retention</h2>
        <ul>
          <li>
            <strong>Creator account data</strong> is retained for the
            duration of the account. Data forming part of accounting
            records is then retained for five years after the end of the
            accounting year, as required by Norwegian accounting
            legislation (bokføringsloven).
          </li>
          <li>
            <strong>Transaction records</strong> (tip amounts, dates,
            payout records) are retained for a minimum of 5 years to comply
            with Norwegian accounting and tax reporting obligations.
          </li>
          <li>
            <strong>Raw IP addresses</strong> used for rate limiting are
            kept transiently (at most a few hours). Pseudonymised referral
            and security records (a truncated hash derived from IP and
            browser information, which cannot be reversed to identify you)
            are kept as part of aggregate statistics.
          </li>
          <li>
            <strong>Optional fan display names</strong> are stored as part of the
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
          <li>
            <strong>Resend, Inc.</strong> (United States) — transactional
            email delivery. Resend processes creator email addresses and
            the content of account-related emails (for example payout
            confirmations, which include payout amounts and tipper display
            names), including email verification, password reset, and
            payout confirmation messages. Data transfers
            are protected by Standard Contractual Clauses. See Resend's
            privacy policy at resend.com/legal/privacy-policy.
          </li>
          <li>
            <strong>Meta Platforms, Inc.</strong> (United States) — only
            with your marketing consent: receives hashed email addresses
            and, for some events, IP address and browser information, for
            advertising conversion measurement. Transfers rely on the
            EU–US Data Privacy Framework and/or Standard Contractual
            Clauses. See facebook.com/privacy/policy.
          </li>
          <li>
            <strong>TikTok</strong> (group companies in Singapore, the
            United States and elsewhere) — only with your marketing
            consent: receives hashed email addresses and, for some events,
            IP address and browser information, for advertising conversion
            measurement. Transfers rely on Standard Contractual Clauses.
            See tiktok.com/legal/privacy-policy.
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
          tokens are stored in browser local storage; the server-side
          session is invalidated when you log out and expires automatically
          30 days after login. Our backend infrastructure is operated on Cloudflare's
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
          Johan Berentsens vei 41, 5160 Laksevåg, Norway<br />
          Org.nr. 926 462 237<br />
          Email: <a href="mailto:support@kuntips.no">support@kuntips.no</a>
        </p>
      </div>
    </>
  );
}
