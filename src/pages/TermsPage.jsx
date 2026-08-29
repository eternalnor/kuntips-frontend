import { usePageTitle } from "../hooks/usePageTitle.js";
import { useTipLang } from "../hooks/useTipLang.js";
import LegalLangToggle, { ConvenienceNote } from "../components/LegalLangToggle.jsx";

// Bilingual. The Norwegian version governs on conflict; the English body is a
// convenience translation (see ConvenienceNote, owner decision 26 Aug 2026).
// Language state is shared with the tip page so a flow never switches language
// between the payment form and the terms it links to.

export default function TermsPage() {
  const { lang, toggle } = useTipLang();
  usePageTitle(lang === "no" ? "Vilkår" : "Terms of Service");

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
      {lang === "no" ? <NorwegianTerms /> : <EnglishTerms />}
    </main>
  );
}

function NorwegianTerms() {
  return (
    <>
      <h1 className="page-title">Vilkår for bruk</h1>
      <div className="page-body">
        <p>Sist oppdatert: 26. august 2026</p>
        <p>
          Disse vilkårene («Vilkårene») regulerer din bruk av nettstedet og
          plattformen KunTips («Tjenesten»), som drives av Eternal AS,
          organisasjonsnummer 926 462 237, Norge («KunTips», «vi», «oss»). Ved
          å gå inn på eller bruke KunTips godtar du Vilkårene i sin
          helhet. Hvis du ikke
          godtar dem, skal du ikke bruke Tjenesten.
        </p>

        <h2>1. Hvem kan bruke Tjenesten</h2>
        <p>
          Du må være minst 18 år og ha full rettslig handleevne til å inngå
          en bindende avtale for å bruke KunTips, uansett i hvilken rolle.
          Ved å bruke Tjenesten bekrefter og garanterer du at du oppfyller
          disse kravene. KunTips forbeholder seg retten til å avslutte
          enhver konto der vi har grunn til å tro at kravene ikke er oppfylt.
        </p>
        <p>
          Skapere må i tillegg ha norsk bankkonto (utbetalinger skjer i
          norske kroner), kunne gjennomføre Stripes norske
          identitetskontroll – som blant annet krever norsk adresse –
          lovlig kunne motta inntekt og overholde alle gjeldende regler om
          skatt, økonomi og identifikasjon.
        </p>

        <h2>2. Hva Tjenesten er</h2>
        <p>
          KunTips er en plattform for frivillige digitale tips. Den lar
          tipsere sende engangsbeløp i pengeform til skapere. KunTips verken
          er vert for, selger, leverer eller gir tilgang til skaperes
          betalte innhold i noen form (utover profilinformasjonen
          beskrevet i punkt 11). KunTips er ikke en abonnementstjeneste, en
          markedsplass, en folkefinansieringsplattform eller en
          betalingstjenesteleverandør. Tjenesten kan ikke brukes som
          utsalgssted, betalingsmur eller som betaling for varer, tjenester
          eller innhold.
        </p>
        <p>
          Tips er frivillige gaver fra tipsere til skapere. Å sende et tips
          gir ikke tipseren rett til innhold, kontakt, tjenester eller andre
          fordeler fra skaperen. KunTips garanterer ikke at skapere
          bekrefter eller svarer på tips.
        </p>

        <h2>3. Skapernivåer og plattformgebyr</h2>
        <p>
          KunTips har et nivåsystem som avgjør plattformgebyret på hvert
          tips. Skapere plasseres på et nivå ut fra samlet tipsvolum i de
          senere periodene: opprykk vurderes på et løpende 30-dagersvindu,
          mens det før en eventuell nedjustering gjelder et lengre
          vurderingsvindu og en overgangsperiode. Høyere nivå gir lavere
          plattformgebyr, slik at skaperen beholder en større andel av hvert
          tips.
        </p>
        <p>
          Gjeldende nivåstruktur, med tilhørende gebyrsatser og
          volumgrenser, er beskrevet i skaperoversikten din. KunTips
          forbeholder seg retten til når som helst å endre nivåstrukturen
          eller gebyrsatsene, med minst 30 dagers skriftlig varsel til din
          registrerte e-postadresse før endringen trer i kraft. Endringer
          gjelder ikke med tilbakevirkende kraft for tips som allerede er
          mottatt.
        </p>
        <p>
          I tillegg til tipsbeløpet belastes tipseren et servicegebyr på
          betalingstidspunktet. Servicegebyret dekker KunTips' gebyr på
          tipsersiden og Stripes betalingsbehandlingskostnader. Skapere
          betaler ikke dette servicegebyret; det nivåbaserte
          plattformgebyret beskrevet ovenfor trekkes fra selve tipsbeløpet.
        </p>

        <h2>4. Betaling og refusjon</h2>
        <p>
          Alle betalinger behandles sikkert av Stripe, Inc., vår
          tredjeparts betalingsbehandler. KunTips lagrer eller behandler
          ikke kortopplysninger. Ved å gjennomføre en betaling godtar du
          også Stripes vilkår, tilgjengelig på stripe.com/legal.
        </p>
        <p>
          Tips refunderes som hovedregel ikke etter at de er behandlet.
          Dette følger av at et tips er frivillig. Refusjon kan gis etter
          KunTips' eget skjønn i særlige tilfeller, eller der gjeldende
          norsk rett eller Stripes retningslinjer krever det.
        </p>
        <p>
          Hvis en tipser starter en tilbakeføring (chargeback) eller
          betalingstvist gjennom banken eller kortutstederen sin, behandles
          tvisten etter Stripes retningslinjer og gjeldende regler fra
          kortnettverkene. Skapere kan holdes økonomisk ansvarlige for
          tvistegebyrer og behandlingskostnader, som beskrevet i
          Skaperavtalen.
        </p>

        <h2>5. Angrerett</h2>
        <p>
          Etter norsk rett (angrerettloven) har forbrukere som hovedregel
          14 dagers angrerett ved kjøp av digitale tjenester på nett. Fordi
          tips på KunTips er frivillige pengegaver – ikke kjøp av varer,
          digitalt innhold eller tjenester – gjelder angreretten etter
          angrerettloven ikke for tipstransaksjoner. Ved å sende et tips
          bekrefter du at du gir en frivillig gave som ikke refunderes.
        </p>
        <p>
          For skaperkontoer (tilgang til selve KunTips-tjenesten, ikke
          tipstransaksjoner) gjelder den ordinære angreretten på 14 dager
          fra kontoen opprettes. Siden en skaperkonto er gratis, innebærer
          bruk av angreretten i praksis bare å avslutte kontoen – kontakt
          support@kuntips.no, eller avslutt kontoen selv.
        </p>

        <h2>6. Forbudt bruk</h2>
        <p>Du kan ikke bruke KunTips til å:</p>
        <ul>
          <li>bryte gjeldende norsk lov eller forskrift, EU-rett eller internasjonal rett;</li>
          <li>ta betalt for varer, digitalt innhold, tjenester eller abonnementer av noe slag;</li>
          <li>delta i eller legge til rette for aktivitet som involverer mindreårige, i noen form;</li>
          <li>spre, fremme eller finansiere intime bilder delt uten samtykke, eller annet ulovlig innhold;</li>
          <li>begå bedrageri, hvitvasking eller annen økonomisk kriminalitet;</li>
          <li>drive virksomhet som er forbudt eller begrenset etter <a href="https://stripe.com/legal/restricted-businesses" target="_blank" rel="noopener noreferrer">Stripes liste over begrensede virksomheter («Restricted Businesses»)</a>;</li>
          <li>bruke plattformen til aldersbegrensede eller regulerte tjenester uten nødvendige tillatelser;</li>
          <li>forsøke å omgå gebyrsystemet eller manipulere tipsvolumer;</li>
          <li>bruke automatiserte verktøy, roboter eller skript til å generere falske tips eller falsk aktivitet;</li>
          <li>trakassere, utgi deg for å være, eller true en skaper, tipser eller ansatt i KunTips;</li>
          <li>forsøke å skaffe deg uautorisert tilgang til plattformen, andres kontoer eller bakenforliggende systemer.</li>
        </ul>
        <p>
          Brudd kan føre til umiddelbar suspensjon av kontoen,
          tilbakeholdelse av ventende utbetalinger og rapportering til
          relevante myndigheter.
        </p>

        <h2>7. Hvitvasking</h2>
        <p>
          KunTips er forpliktet til å etterleve norsk
          hvitvaskingslovgivning (hvitvaskingsloven). Identitetskontroll av
          skapere og kundetiltak (KYC) utføres av Stripe som del av
          Connect-registreringen. KunTips forbeholder seg retten til å
          begrense eller suspendere tilgangen til kontoer ved begrunnet
          mistanke om økonomisk kriminalitet, og kan være rettslig
          forpliktet til å rapportere mistenkelig aktivitet til relevante
          myndigheter uten å varsle kontoinnehaveren.
        </p>

        <h2>8. Opptreden på plattformen</h2>
        <p>
          Du forplikter deg til å bruke Tjenesten i god tro og i samsvar
          med dens formål. Du skal ikke forstyrre driften av plattformen,
          foreta omvendt utvikling («reverse engineering») av noen del av
          den, eller forsøke å få tilgang til systemer eller data utover din
          egen konto.
        </p>

        <h2>9. Suspensjon og avslutning av konto</h2>
        <p>
          KunTips kan når som helst suspendere eller avslutte skaperkontoer
          ved brudd på Vilkårene, ved bedragerisiko, av regulatoriske
          grunner eller ved misbruk av plattformen. Der det er mulig, og
          det ikke strider mot rettslige forpliktelser eller
          sikkerhetshensyn, gir vi rimelig varsel før kontoen avsluttes.
        </p>
        <p>
          Skapere som mener kontoen er suspendert ved en feil, kan kontakte
          support@kuntips.no og be om en ny vurdering. Vi tar sikte på å
          svare innen 10 virkedager. KunTips' avgjørelse avslutter vår
          interne klagebehandling; den begrenser ikke lovbestemte
          rettigheter du måtte ha til å forfølge saken for domstolene eller
          relevante myndigheter.
        </p>
        <p>
          Skapere kan når som helst avslutte kontoen sin ved å kontakte
          support@kuntips.no. Utestående tilgjengelig saldo på
          avslutningstidspunktet utbetales gjennom den ordinære
          prosessen for utbetalingsforespørsler, med forbehold om den ordinære
          sperreperioden, Stripes krav og eventuelle beløp du skylder
          KunTips (for eksempel tvistegebyrer) som ikke er dekket inn.
        </p>

        <h2>10. Tilgjengelighet</h2>
        <p>
          KunTips tilstreber en stabil tjeneste, men garanterer ikke
          uavbrutt tilgjengelighet. Vi kan endre, midlertidig stanse eller
          avvikle enhver del av Tjenesten når som helst, med eller uten
          varsel, av hensyn til vedlikehold, rettslige forhold eller andre
          grunner. KunTips er ikke ansvarlig for tap som følge av avbrudd
          eller nedetid.
        </p>
        <p>
          Hvis KunTips avvikler Tjenesten permanent, vil vi så langt det er
          rimelig varsle registrerte skapere på e-post minst 30 dager i
          forveien. Utestående skapersaldoer på det tidspunktet
          utbetales gjennom den ordinære Stripe-prosessen, med forbehold om
          Stripes krav, inkludert eventuelle minstegrenser Stripe
          praktiserer.
        </p>

        <h2>11. Immaterielle rettigheter</h2>
        <p>
          KunTips med tilhørende design, merkevare og programvare tilhører
          Eternal AS. Du kan ikke kopiere, reprodusere eller bruke KunTips'
          merkevare eller design uten skriftlig tillatelse.
        </p>
        <p>
          Skapere beholder alle immaterielle rettigheter til eget navn,
          brukernavn og profilinnhold. Ved å registrere et brukernavn på
          KunTips gir du KunTips en ikke-eksklusiv, vederlagsfri lisens til
          å vise brukernavnet og profilinformasjonen du oppgir, utelukkende
          for å drive Tjenesten. KunTips bruker ikke brukernavnet ditt
          eller avbildninger av deg (bilde, video eller lignende) i
          markedsføring uten ditt samtykke.
        </p>

        <h2>12. Personvern</h2>
        <p>
          Vår innsamling og bruk av personopplysninger er regulert av
          personvernerklæringen vår, som beskriver hva vi behandler, på
          hvilket rettslig grunnlag, og hvilke rettigheter du har. Den er
          tilgjengelig når som helst via bunnteksten på nettstedet.
        </p>

        <h2>13. Ansvarsbegrensning</h2>
        <p>
          Så langt norsk rett tillater, er KunTips og Eternal AS ikke
          ansvarlige for: indirekte tap eller følgetap; tapt
          inntjening eller inntekt; skaperes opptreden eller innhold;
          handlinger fra tredjeparts betalingsbehandlere; eller betalinger
          som avvises, bestrides eller tilbakeføres av banker eller
          kortnettverk.
        </p>
        <p>
          Der ansvar ikke kan fraskrives etter loven, er vårt samlede
          ansvar overfor deg begrenset til det totale beløpet du har betalt
          til eller gjennom KunTips i de siste 6 månedene før hendelsen som
          utløste kravet.
        </p>
        <p>
          Ingenting i disse Vilkårene begrenser ansvar for død eller
          personskade forårsaket av vår uaktsomhet, for bedrageri eller
          svik, eller annet ansvar som ikke kan begrenses
          etter norsk rett.
        </p>

        <h2>14. Force majeure</h2>
        <p>
          KunTips er ikke ansvarlig for manglende eller forsinket oppfyllelse
          som skyldes forhold utenfor vår rimelige kontroll, herunder blant
          annet naturkatastrofer, myndighetshandlinger, strømbrudd,
          internettbrudd, dataangrep eller svikt i tredjepartstjenester,
          inkludert Stripe og Cloudflare.
        </p>

        <h2>15. Lovvalg og tvisteløsning</h2>
        <p>
          Vilkårene er underlagt norsk rett. Tvister som springer ut av
          eller har sammenheng med Vilkårene eller bruken av KunTips, og som
          ikke løses i minnelighet, hører inn under Oslo tingrett som
          eksklusivt verneting, med mindre ufravikelige forbrukervernregler
          i landet du bor i krever noe annet. For forbrukere gjelder
          tvistelovens ufravikelige vernetingsregler; en forbruker kan
          alltid reise sak ved sitt alminnelige verneting.
        </p>
        <p>
          Norske forbrukere kan også klage til Forbrukertilsynet og
          Forbrukerklageutvalget i samsvar med gjeldende
          forbrukervernlovgivning.
        </p>

        <h2>16. Endringer i Vilkårene</h2>
        <p>
          Vi kan oppdatere Vilkårene fra tid til annen. Ved vesentlige
          endringer varsler vi registrerte skapere på e-post minst 14 dager
          før endringene trer i kraft. For tipsere publiseres oppdaterte
          vilkår på denne siden med ny dato. Fortsatt bruk av Tjenesten
          etter at endringene har trådt i kraft, regnes som aksept av de
          oppdaterte Vilkårene. Endringer i plattformgebyrer eller
          nivågrenser følger alltid 30-dagersfristen i punkt 3.
        </p>

        <h2>17. Delvis ugyldighet</h2>
        <p>
          Hvis en bestemmelse i Vilkårene kjennes ugyldig, ulovlig eller
          uten virkning av en kompetent domstol, skal bestemmelsen
          endres i minst mulig grad slik at den blir gyldig, eller – hvis
          det ikke er mulig – tas ut av Vilkårene. De øvrige bestemmelsene
          gjelder fullt ut.
        </p>

        <h2>18. Hele avtalen</h2>
        <p>
          Vilkårene utgjør, sammen med personvernerklæringen, erklæringen
          om informasjonskapsler og (for skapere) Skaperavtalen, hele
          avtalen mellom deg og KunTips om Tjenesten, og erstatter alle
          tidligere avtaler, utsagn og forståelser. Den norske versjonen
          av Vilkårene er den gjeldende; den engelske versjonen er en
          oversettelse, og ved motstrid gjelder den norske versjonen.
        </p>

        <h2>19. Kontakt</h2>
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

function EnglishTerms() {
  return (
    <>
      <h1 className="page-title">Terms of Service</h1>
      <div className="page-body">
        <p>Last updated: 26 August 2026</p>
        <ConvenienceNote />
        <p>
          These Terms of Service ("Terms") govern your use of the KunTips
          website and platform ("Service") operated by Eternal AS,
          Norwegian organisation number (org.nr.) 926 462 237, Norway ("KunTips", "we", "us").
          By accessing or using KunTips you agree to these Terms in full.
          If you do not agree, do not use the Service.
        </p>

        <h2>1. Eligibility</h2>
        <p>
          You must be at least 18 years old and have full legal capacity to
          enter into a binding agreement to use KunTips in any capacity. By
          using the Service you represent and warrant that you meet these
          requirements. KunTips reserves the right to terminate any account
          where we have reason to believe this requirement has not been met.
        </p>
        <p>
          Creators must additionally have a Norwegian bank account
          (payouts are made in Norwegian kroner), be able to complete
          Stripe's Norwegian identity verification — which requires among
          other things a Norwegian address — be legally permitted to
          receive income, and comply with all applicable tax, financial,
          and identity laws.
        </p>

        <h2>2. Nature of the Service</h2>
        <p>
          KunTips is a voluntary digital tipping platform. It allows fans to
          send one-time monetary tips to creators. KunTips does not host,
          sell, deliver, or provide access to creators' monetised content
          of any kind (beyond the profile information described in Section
          11).
          KunTips is not a subscription service, a marketplace, a
          crowdfunding platform, or a payment service provider. It may not
          be used as a storefront, paywall, or in exchange for any goods,
          services, or content.
        </p>
        <p>
          Tips are voluntary gifts from fans to creators. Sending a tip does
          not entitle the fan to any content, interaction, service, or
          benefit from the creator. KunTips does not guarantee that creators
          will acknowledge or respond to tips.
        </p>

        <h2>3. Creator Tiers and Platform Fees</h2>
        <p>
          KunTips operates a tier system that determines the platform fee
          charged on each tip. Creators are assigned to a tier based on
          their cumulative tip volume over recent periods: advancement is
          assessed on a rolling 30-day window, while before any downgrade a
          longer look-back window and a grace period apply. Higher tiers
          result in a lower platform fee, meaning creators keep a larger
          share of each tip.
        </p>
        <p>
          The current tier structure, including the applicable platform fee
          percentages and volume thresholds, is described in your creator
          dashboard. KunTips reserves the right to modify the tier structure
          or fee rates at any time, with at least 30 days' written notice
          sent to your registered email address before any change takes
          effect. Changes will not apply retroactively to tips already
          received.
        </p>
        <p>
          In addition to the tip amount, the fan is charged a service fee
          at the time of payment. The service fee covers KunTips' fan-side
          fee and Stripe's payment-processing costs. Creators do
          not pay this service fee; the tier-based platform fee described
          above is deducted from the tip amount itself.
        </p>

        <h2>4. Payments and Refunds</h2>
        <p>
          All payments are processed securely by Stripe, Inc., our
          third-party payment processor. KunTips does not store or process
          credit or debit card details. By submitting a payment you also
          agree to Stripe's terms of service, available at
          stripe.com/legal.
        </p>
        <p>
          Tips are generally non-refundable once processed. This is
          consistent with the voluntary nature of a tip. Refunds may be
          issued at KunTips' sole discretion in exceptional circumstances,
          or where required by applicable Norwegian law or Stripe's policies.
        </p>
        <p>
          If a fan initiates a chargeback or payment dispute through their
          bank or card issuer, the dispute will be handled in accordance
          with Stripe's policies and applicable card network rules. Creators
          may bear financial responsibility for dispute fees and processing
          costs as described in the Creator Agreement.
        </p>

        <h2>5. Right of Withdrawal</h2>
        <p>
          Under Norwegian law (angrerettloven), consumers generally have a
          14-day right of withdrawal for online purchases of digital
          services. However, because tips on KunTips are voluntary monetary
          gifts — not purchases of goods, digital content, or services — the
          right of withdrawal under angrerettloven does not apply to tip
          transactions. By submitting a tip you acknowledge that you are
          making a voluntary, non-refundable gift.
        </p>
        <p>
          For creator accounts (access to the KunTips service itself
          rather than tip transactions), the standard 14-day right of
          withdrawal applies from the date of account creation. Because a
          creator account is free of charge, exercising the right of
          withdrawal simply means closing the account — contact
          support@kuntips.no, or close the account yourself.
        </p>

        <h2>6. Prohibited Uses</h2>
        <p>You may not use KunTips to:</p>
        <ul>
          <li>Violate any applicable Norwegian, EU, or international law or regulation;</li>
          <li>Process payments for goods, digital content, services, or subscriptions of any kind;</li>
          <li>Engage in or facilitate any activity involving minors in any capacity;</li>
          <li>Distribute, promote, or fund non-consensual intimate imagery or any illegal content;</li>
          <li>Commit fraud, money laundering, or any other financial crime;</li>
          <li>Engage in activities prohibited under <a href="https://stripe.com/legal/restricted-businesses" target="_blank" rel="noopener noreferrer">Stripe's Restricted Businesses list</a>;</li>
          <li>Use the platform for any age-restricted or regulated services without the required authorisations;</li>
          <li>Attempt to circumvent the platform fee system or manipulate tip volumes;</li>
          <li>Use automated tools, bots, or scripts to generate fraudulent tips or activity;</li>
          <li>Harass, impersonate, or threaten any creator, fan, or KunTips staff member;</li>
          <li>Attempt to gain unauthorised access to the platform, other accounts, or backend systems.</li>
        </ul>
        <p>
          Violations may result in immediate account suspension, withholding
          of pending payouts, and reporting to relevant authorities.
        </p>

        <h2>7. Anti-Money Laundering</h2>
        <p>
          KunTips is committed to compliance with Norwegian anti-money
          laundering legislation (hvitvaskingsloven). Creator identity
          verification and Know Your Customer (KYC) checks are conducted by
          Stripe as part of the Connect onboarding process. KunTips reserves
          the right to restrict or suspend access to accounts where we have
          reasonable suspicion of financial crime, and may be required by
          law to report suspicious activity to relevant authorities without
          notifying the account holder.
        </p>

        <h2>8. User Conduct</h2>
        <p>
          You agree to use the Service in good faith and in a manner
          consistent with its intended purpose. You agree not to interfere
          with the platform's operation, reverse-engineer any component, or
          attempt to access systems or data beyond your own account.
        </p>

        <h2>9. Account Suspension and Termination</h2>
        <p>
          KunTips may suspend or terminate creator accounts at any time for
          violations of these Terms, fraud risk, regulatory requirements, or
          platform abuse. Where possible and where it does not conflict with
          legal obligations or security concerns, we will give reasonable
          notice before termination.
        </p>
        <p>
          Creators who believe their account has been suspended in error may
          contact support@kuntips.no to request a review. We will aim to
          respond within 10 business days. KunTips' decision concludes our
          internal review process; it does not limit any statutory rights
          you may have to pursue the matter before the courts or relevant
          authorities.
        </p>
        <p>
          Creators may close their account at any time by contacting
          support@kuntips.no. Any outstanding eligible balance at the time
          of closure will be paid out through the normal payout request
          process, subject to the standard holding period, Stripe's
          requirements, and any amounts you owe KunTips (for example
          dispute fees) that remain unrecovered.
        </p>

        <h2>10. Platform Availability</h2>
        <p>
          KunTips aims to provide a reliable service but does not guarantee
          uninterrupted availability. We may modify, suspend, or discontinue
          any part of the Service at any time, with or without notice, for
          maintenance, legal reasons, or any other reason. KunTips is not
          liable for losses resulting from service interruptions or
          downtime.
        </p>
        <p>
          In the event that KunTips permanently discontinues the Service,
          we will make reasonable efforts to notify registered creators at
          least 30 days in advance by email. Any outstanding creator
          balances at that time will be paid out through the normal Stripe
          process, subject to Stripe's requirements, including any minimums
          Stripe applies.
        </p>

        <h2>11. Intellectual Property</h2>
        <p>
          KunTips and its design, branding, and software are the property
          of Eternal AS. You may not copy, reproduce, or use KunTips'
          branding or design without written permission.
        </p>
        <p>
          Creators retain all intellectual property rights in their own
          names, usernames, and profile content. By registering a username
          on KunTips you grant KunTips a non-exclusive, royalty-free licence
          to display that username and any profile information you provide
          solely for the purpose of operating the Service. KunTips will not
          use your username or likeness in marketing materials without your
          consent.
        </p>

        <h2>12. Privacy</h2>
        <p>
          Our collection and use of personal data is governed by our
          Privacy Policy, which describes what we process, on which legal
          bases, and your rights. It is available at any time via the
          footer of this site.
        </p>

        <h2>13. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by Norwegian law, KunTips and
          Eternal AS are not liable for: indirect, consequential, or
          incidental losses; loss of earnings or income; creator behaviour
          or content; actions of third-party payment processors; or payments
          declined, disputed, or reversed by banks or card networks.
        </p>
        <p>
          Where liability cannot be excluded by law, our total aggregate
          liability to you is limited to the total amount you paid to or
          through KunTips in the 6 months immediately preceding the event
          giving rise to the claim.
        </p>
        <p>
          Nothing in these Terms limits liability for death or personal
          injury caused by our negligence, fraud or fraudulent
          misrepresentation, or any other liability that cannot be limited
          under Norwegian law.
        </p>

        <h2>14. Force Majeure</h2>
        <p>
          KunTips is not liable for any failure or delay in performance
          resulting from circumstances beyond our reasonable control,
          including but not limited to natural disasters, acts of government,
          power failures, internet outages, cyberattacks, or failures of
          third-party services including Stripe and Cloudflare.
        </p>

        <h2>15. Governing Law and Dispute Resolution</h2>
        <p>
          These Terms are governed by the laws of Norway. Any dispute
          arising from or in connection with these Terms or the use of
          KunTips that cannot be resolved informally shall be subject to
          the exclusive jurisdiction of the Oslo District Court (Oslo
          tingrett), unless mandatory consumer protection laws in your
          country of residence require otherwise. For consumers, the
          mandatory venue rules of the Norwegian Dispute Act (tvisteloven)
          apply; a consumer may always bring proceedings before their
          ordinary venue.
        </p>
        <p>
          Norwegian consumers also have the right to bring complaints to
          Forbrukertilsynet (the Norwegian Consumer Authority) and
          Forbrukerklageutvalget (the Norwegian Consumer Complaints Board)
          in
          accordance with applicable consumer protection legislation.
        </p>

        <h2>16. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. Where changes are
          material, we will notify registered creators by email at least 14
          days before the changes take effect. For fans, updated Terms will
          be posted on this page with an updated date. Continued use of the
          Service after changes take effect constitutes acceptance of the
          updated Terms. Changes to platform fees or tier thresholds are
          always subject to the 30-day notice period in Section 3.
        </p>

        <h2>17. Severability</h2>
        <p>
          If any provision of these Terms is found by a court of competent
          jurisdiction to be invalid, unlawful, or unenforceable, that
          provision shall be modified to the minimum extent necessary to
          make it enforceable, or if that is not possible, severed from
          these Terms. The remaining provisions shall continue in full force
          and effect.
        </p>

        <h2>18. Entire Agreement</h2>
        <p>
          These Terms, together with the Privacy Policy, Cookie Policy, and
          (for creators) the Creator Agreement, constitute the entire
          agreement between you and KunTips regarding the Service and
          supersede all prior agreements, representations, and
          understandings. The Norwegian version of these Terms governs; the
          English version is a convenience translation, and in case of
          conflict the Norwegian version prevails.
        </p>

        <h2>19. Contact</h2>
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
