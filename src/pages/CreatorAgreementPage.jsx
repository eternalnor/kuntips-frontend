import { usePageTitle } from "../hooks/usePageTitle.js";
import { useTipLang } from "../hooks/useTipLang.js";
import LegalLangToggle, { ConvenienceNote } from "../components/LegalLangToggle.jsx";

// Bilingual. The Norwegian version governs on conflict; English is a
// convenience translation (owner decision 26 Aug 2026).
// NOTE: §4 previously claimed a 100 NOK minimum tip; the platform minimum is
// 50 NOK. Corrected in both languages.

export default function CreatorAgreementPage() {
  const { lang } = useTipLang();
  usePageTitle(lang === "no" ? "Skaperavtale" : "Creator Agreement");

  return (
    <main className="page page-legal card">
      <LegalLangToggle />
      {lang === "no" ? <NorwegianAgreement /> : <EnglishAgreement />}
    </main>
  );
}

function NorwegianAgreement() {
  return (
    <>
      <h1 className="page-title">Skaperavtale</h1>
      <div className="page-body">
        <p>Sist oppdatert: 26. august 2026</p>
        <p>
          Denne skaperavtalen («Avtalen») gjelder for alle skapere som
          registrerer seg og mottar tips gjennom KunTips («Skaperen»,
          «du»). KunTips er en tjeneste («Tjenesten») som drives av
          Eternal AS, organisasjonsnummer 926 462 237, Norge («KunTips»,
          «vi»). Ved å opprette en skaperkonto godtar du denne Avtalen,
          vilkårene for bruk («Vilkårene»), personvernerklæringen og
          erklæringen om informasjonskapsler. Avtalen utfyller Vilkårene og
          skal leses sammen med dem.
        </p>

        <h2>1. Hvem kan registrere seg</h2>
        <p>For å registrere deg som skaper må du:</p>
        <ul>
          <li>være minst 18 år;</li>
          <li>ha norsk bankkonto og kunne gjennomføre Stripes norske
          identitetskontroll, som blant annet krever norsk adresse
          (utbetalinger skjer i norske kroner);</li>
          <li>lovlig kunne motta inntekt;</li>
          <li>ha rettslig handleevne til å inngå en bindende avtale;</li>
          <li>gjennomføre og bestå Stripes identitetskontroll (KYC) under
          registreringen.</li>
        </ul>
        <p>
          Ved å registrere deg bekrefter og garanterer du at alt det
          ovennevnte er riktig. KunTips kan når som helst be om ytterligere
          verifisering og kan suspendere kontoer der vilkårene ikke er
          oppfylt.
        </p>

        <h2>2. Identitetskontroll</h2>
        <p>
          Identitetskontroll av skapere utføres av Stripe, Inc. som del av
          Stripe Connect-registreringen. Stripe samler inn og verifiserer
          identitetsdokumenter, bankopplysninger og annen personinformasjon
          som kreves av finansreguleringen og Stripes egne retningslinjer.
          KunTips mottar ikke identitetsdokumentene eller
          bankopplysningene dine direkte – disse håndteres utelukkende av
          Stripe.
        </p>
        <p>
          Stripe kan avslå registrering eller senere suspendere en
          tilknyttet konto etter eget skjønn og av egne grunner, utenfor
          KunTips' kontroll. KunTips kan ikke overprøve Stripes
          identitets- eller etterlevelsesavgjørelser.
        </p>

        <h2>3. Plattformgebyr og nivåsystem</h2>
        <p>
          KunTips tar et plattformgebyr av hvert mottatte tips. Gebyret
          trekkes fra før utbetalingen din beregnes. Gebyrsatsen avhenger
          av nivået ditt:
        </p>
        <ul>
          <li><strong>Nivå 1</strong> – 5 % plattformgebyr (standard for nye
          skapere)</li>
          <li><strong>Nivå 2</strong> – 4 % plattformgebyr</li>
          <li><strong>Nivå 3</strong> – 3 % plattformgebyr</li>
          <li><strong>Nivå 4</strong> – 2 % plattformgebyr</li>
          <li><strong>Nivå 5</strong> – 1 % plattformgebyr</li>
          <li><strong>Nivå 6</strong> – 0 % plattformgebyr</li>
        </ul>
        <p>
          Nivåplasseringen baseres på samlet tipsvolum i de senere
          periodene. De konkrete grensene og gjeldende nivåstruktur vises i
          skaperoversikten din. Opprykk skjer umiddelbart basert på
          tipsvolumet de siste 30 dagene; nedjusteringer vurderes daglig ut
          fra et lengre vurderingsvindu, og ingen nedjustering skjer i en
          overgangsperiode etter siste opprykk.
        </p>
        <p>
          Midlertidige nivåløft kan i tillegg gis gjennom vervebonuser,
          plattformarrangementer eller etter KunTips' skjønn. Slike løft er
          midlertidige og kan endres.
        </p>
        <p>
          I tillegg til KunTips' plattformgebyr tar Stripe et
          betalingsbehandlingsgebyr. Dette legges på tipseren og inngår i
          totalbeløpet tipseren belastes – det trekkes ikke separat fra din
          utbetaling.
        </p>
        <p>
          KunTips gir minst 30 dagers skriftlig varsel på e-post før
          endringer i nivågrenser eller gebyrsatser. Endringer gjelder ikke
          med tilbakevirkende kraft.
        </p>

        <h2>4. Utbetalinger</h2>
        <p>
          Utbetalinger til skapere skjer gjennom Stripe Connect. Tips
          holdes tilbake i minst 7 dager før de blir tilgjengelige for
          utbetaling (sperreperiode). Perioden gir rom for
          refusjonshenvendelser og reduserer risikoen for tilbakeføringer.
        </p>
        <p>
          Utbetaling bestilles fra utbetalingsdelen i skaperoversikten din.
          Utbetalinger overføres til bankkontoen som er knyttet til
          Stripe-kontoen din. Stripes egne behandlingstider gjelder etter
          at en utbetaling er igangsatt (normalt 2–5 virkedager, avhengig
          av bank).
        </p>
        <p>
          Alle utbetalinger skjer i norske kroner (NOK). KunTips støtter
          foreløpig ikke utbetaling i andre valutaer.
        </p>
        <p>
          Stripe tar sitt eget gebyr per bankoverføring etter Stripes
          prisliste (omtrent 2,75 kr i skrivende stund); dette trekkes av
          Stripe fra saldoen på den tilknyttede kontoen din. KunTips tar
          ikke eget gebyr for utbetalinger.
        </p>
        <p>
          KunTips håndhever ingen minstegrense for utbetaling. Gjeldende
          minstebeløp for enkelttips (50 kr i skrivende stund) vises på
          hver tipsside og kan justeres, slik at en tilgjengelig saldo
          (fratrukket plattformgebyret) alltid vil tilsvare minst ett slikt
          tips før en utbetaling bestilles.
        </p>
        <p>
          KunTips garanterer ingen inntjening. Tips er frivillige, og
          KunTips gir ingen løfter om hvor mange tips du vil motta.
        </p>

        <h2>5. Skatt</h2>
        <p>
          Du er selv ansvarlig for å oppgi og betale all skatt som gjelder
          inntekt mottatt gjennom KunTips i din jurisdiksjon. KunTips
          trekker ikke skatt på dine vegne og utsteder ikke
          sammenstillinger, årsoppgaver eller annen skattedokumentasjon.
        </p>
        <p>
          For norske skapere: tips er unntatt merverdiavgift (MVA), men er
          skattepliktig inntekt og skal oppgis i skattemeldingen. Mener du
          at inntekten din ikke er skattepliktig, avklar det med
          Skatteetaten før du legger det til grunn.
        </p>

        <h2>6. Refusjoner, tilbakeføringer og tvistetrekk</h2>
        <p>
          Når en tipser ber om refusjon eller starter en tilbakeføring
          (chargeback) gjennom banken eller kortutstederen sin, gjelder
          følgende:
        </p>
        <ul>
          <li>
            <strong>Refusjoner:</strong> Refunderes et tips, holdes
            tipset utenfor utbetalingssaldoen din. KunTips belaster deg
            ikke gebyr for refusjoner og har ikke til hensikt å beholde
            plattformgebyr på refunderte transaksjoner.
          </li>
          <li>
            <strong>Tilbakeføringer / tvister:</strong> Bestrides en
            betaling gjennom tipserens bank, trekkes et tvistegebyr (for
            tiden 200 kr) fra saldoen din uavhengig av utfallet. Tapes
            tvisten, trekkes også det omtvistede tipsbeløpet.
          </li>
          <li>
            KunTips tjener aldri på refusjoner eller tvister, og tar ikke
            plattformgebyr på transaksjoner der du ikke mottar inntekt.
          </li>
          <li>
            Tvistetrekk som overstiger gjeldende utbetalingssaldo, gir en
            negativ skapersaldo. KunTips dekker inn denne saldoen
            automatisk ved å trekke en andel av fremtidige tips du mottar
            (begrenset slik at trekket aldri overstiger halvparten av et
            enkelt tips) til saldoen er gjort opp.
          </li>
        </ul>
        <p>
          Gebyrbeløpene over gjelder per siste oppdateringsdato for denne
          Avtalen og kan endres av Stripe.
        </p>

        <h2>7. Forbudt bruk</h2>
        <p>
          Som skaper godtar du at KunTips utelukkende kan brukes som en
          tjeneste for frivillige pengetips. Du kan ikke bruke KunTips:
        </p>
        <ul>
          <li>til å selge, levere eller gi tilgang til varer, tjenester
          eller digitalt innhold av noe slag – herunder abonnementer,
          mediefiler, eksklusivt innhold eller betaling per visning;</li>
          <li>i forbindelse med aktivitet som involverer mindreårige, i
          noen form;</li>
          <li>til å spre, fremme eller motta betaling i forbindelse med
          intime bilder delt uten samtykke, eller annet ulovlig
          innhold;</li>
          <li>til å begå bedrageri, hvitvasking eller annen økonomisk
          kriminalitet;</li>
          <li>til å fremme eller legge til rette for virksomhet på Stripes
          liste over begrensede virksomheter («Restricted Businesses»);</li>
          <li>til å fremme eller motta betaling for aldersbegrenset eller
          regulert virksomhet uten nødvendige lisenser og tillatelser;</li>
          <li>til å manipulere tipsvolumer, utnytte nivåsystemet eller
          generere falske transaksjoner;</li>
          <li>på noen måte som bryter norsk rett, EU-rett eller lovene i
          landet du bor i.</li>
        </ul>
        <p>
          Brudd kan føre til umiddelbar suspensjon av kontoen,
          tilbakeholdelse av ventende utbetalinger under etterforskning, og
          oversendelse til relevante myndigheter.
        </p>

        <h2>8. Immaterielle rettigheter og profilen din</h2>
        <p>
          Du beholder alle immaterielle rettigheter til skapernavnet,
          visningsnavnet, bioen og annet profilinnhold du legger inn på
          KunTips. Ved å legge inn dette innholdet gir du KunTips en
          ikke-eksklusiv, vederlagsfri, verdensomspennende lisens til å
          vise og presentere innholdet, utelukkende for å drive tipssiden
          og skaperoversikten din.
        </p>
        <p>
          KunTips bruker ikke navnet, brukernavnet, din avbildning eller
          profilinnholdet ditt i markedsføring uten ditt uttrykkelige
          skriftlige samtykke.
        </p>
        <p>
          Du er ansvarlig for at brukernavnet, visningsnavnet og
          profilinnholdet ditt ikke krenker tredjeparters immaterielle
          rettigheter.
        </p>

        <h2>9. Opphavsrettskrenkelser og fjerning</h2>
        <p>
          KunTips er ikke en vertstjeneste for skaperinnhold som filer
          eller medier. Mener du likevel at dine
          immaterielle rettigheter er krenket gjennom en skapers
          brukernavn, visningsnavn eller profilinformasjon på KunTips,
          kontakt oss på{" "}
          <a href="mailto:support@kuntips.no">support@kuntips.no</a> med
          følgende informasjon:
        </p>
        <ul>
          <li>navn og kontaktinformasjon;</li>
          <li>en beskrivelse av rettigheten du mener er krenket;</li>
          <li>det konkrete innholdet du mener krenker rettighetene dine, og
          hvor på KunTips det finnes;</li>
          <li>en erklæring om at du i god tro mener bruken ikke er
          tillatt;</li>
          <li>en erklæring om at opplysningene du har gitt er riktige, og
          at du har fullmakt til å opptre på rettighetshaverens vegne.</li>
        </ul>
        <p>Vi undersøker saken og svarer innen 10 virkedager.</p>

        <h2>10. Hvitvasking</h2>
        <p>
          Ved å registrere deg som skaper bekrefter du at du ikke bruker
          KunTips til å hvitvaske penger, omgå finansielle
          rapporteringsplikter eller behandle utbytte fra straffbare
          handlinger. KunTips er forpliktet til å etterleve norsk
          hvitvaskingslovgivning (hvitvaskingsloven) og kan være forpliktet
          til å rapportere mistenkelig aktivitet til Økokrim eller andre
          relevante myndigheter uten forhåndsvarsel til deg.
        </p>

        <h2>11. Suspensjon, avslutning og klage</h2>
        <p>
          KunTips kan når som helst suspendere eller avslutte
          skaperkontoen din ved brudd på denne Avtalen, bruksvilkårene,
          Stripes krav eller regulatoriske krav, eller der vi har rimelig
          grunn til å mistenke bedrageri eller ulovlig aktivitet.
        </p>
        <p>
          Skyldes suspensjonen ikke bekreftet bedrageri eller ulovlig
          aktivitet, tar vi sikte på å varsle deg på e-post. Ved bekreftet
          eller mistenkt bedrageri kan umiddelbar suspensjon uten varsel
          være nødvendig.
        </p>
        <p>
          <strong>Klage:</strong> Mener du kontoen din er suspendert ved en
          feil, kan du klage til{" "}
          <a href="mailto:support@kuntips.no">support@kuntips.no</a> med en
          begrunnelse for hvorfor du mener suspensjonen var uriktig. Vi
          behandler klagen og svarer innen 10 virkedager. KunTips'
          avgjørelse avslutter vår interne klagebehandling; den begrenser
          ikke lovbestemte rettigheter du måtte ha til å forfølge saken for
          domstolene eller relevante myndigheter.
        </p>
        <p>
          <strong>Avslutning av konto:</strong> Du kan når som helst be om
          å avslutte kontoen ved å kontakte{" "}
          <a href="mailto:support@kuntips.no">support@kuntips.no</a>.
          Be om utbetaling av gjenstående tilgjengelig saldo fra
          oversikten din før avslutning; vi gjennomfører en siste
          utbetaling av tilgjengelig saldo som del av avslutningen. Kontoer
          med negativ saldo kan ikke avsluttes før saldoen er gjort opp.
        </p>

        <h2>12. Etterlevelse av lover</h2>
        <p>
          Du forplikter deg til å overholde alle gjeldende lover og regler
          i din jurisdiksjon i forbindelse med bruken av KunTips, herunder
          blant annet skatteregler, finansregulering,
          hvitvaskingslovgivning, personvernregler og forbrukervernregler.
        </p>

        <h2>13. Ansvar</h2>
        <p>
          KunTips og Eternal AS er ikke ansvarlige for: dine handlinger
          eller ditt innhold; tapt inntjening som følge av
          kontosuspensjon, Stripes avgjørelser eller tekniske problemer;
          tvister mellom deg og tipsere; skatteforpliktelser som følger av
          din bruk av plattformen; eller endringer i Stripes gebyrer,
          retningslinjer eller tilgjengelighet.
        </p>
        <p>
          Vårt samlede ansvar overfor deg etter denne Avtalen er begrenset
          som beskrevet i punkt 13 i Vilkårene.
        </p>

        <h2>14. Endringer i Avtalen</h2>
        <p>
          KunTips kan oppdatere denne Avtalen fra tid til annen. Vi varsler
          deg på e-post minst 14 dager før vesentlige endringer trer i
          kraft, med unntak av endringer i nivågrenser eller
          plattformgebyrsatser, som alltid følger 30-dagersfristen i punkt
          3. Fortsatt bruk av Tjenesten etter at endringene har trådt i
          kraft, regnes som aksept av den oppdaterte Avtalen.
        </p>

        <h2>15. Kontakt</h2>
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

function EnglishAgreement() {
  return (
    <>
      <h1 className="page-title">Creator Agreement</h1>
      <div className="page-body">
        <p>Last updated: 26 August 2026</p>
        <ConvenienceNote />
        <p>
          This Creator Agreement ("Agreement") applies to all creators who
          register and receive tips through KunTips ("Creator", "you").
          KunTips is a service (the "Service") operated by Eternal AS,
          Norwegian organisation number (org.nr.) 926 462 237, Norway
          ("KunTips", "we"). By creating a creator account you agree to
          this Agreement, the KunTips Terms of Service, the Privacy Policy,
          and the Cookie Policy. This Agreement supplements and should be
          read alongside the Terms of Service.
        </p>

        <h2>1. Eligibility</h2>
        <p>
          To register as a creator you must:
        </p>
        <ul>
          <li>Be at least 18 years of age;</li>
          <li>Have a Norwegian bank account and be able to complete
          Stripe's Norwegian identity verification, which requires among
          other things a Norwegian address (payouts are made in Norwegian
          kroner);</li>
          <li>Be legally permitted to receive income;</li>
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
          Tier assignments are based on your total tip volume received
          over recent periods. The specific thresholds
          and current tier structure are displayed in your creator
          dashboard. Tier upgrades take effect immediately based on tip
          volume over the preceding 30 days; downgrades are assessed daily
          based on volume over a longer look-back window, and no downgrade
          occurs during a grace period following your most recent
          promotion.
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
          your bank).
        </p>
        <p>
          All payouts are made in Norwegian Krone (NOK). KunTips does not
          support payouts in other currencies at this time.
        </p>
        <p>
          Stripe charges its own fee per bank transfer under Stripe's
          pricing (approximately 2.75 NOK at the time of writing); this is
          deducted by Stripe from your connected account balance. KunTips
          does not charge any fee for payouts.
        </p>
        <p>
          There is no minimum payout amount enforced by KunTips. The
          current minimum individual tip (50 NOK at the time of writing) is
          shown on every tip page and may be adjusted, so any eligible
          balance (less the platform fee) will always reflect at least one
          such tip before a payout is requested.
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
          Norwegian creators: tips are exempt from VAT (MVA) but are
          taxable income and must be declared in your tax return. If you
          believe your income is not taxable, clarify this with the
          Norwegian Tax Administration (Skatteetaten) before relying on
          that assumption.
        </p>

        <h2>6. Refunds, Chargebacks, and Dispute Deductions</h2>
        <p>
          When a fan requests a refund or initiates a chargeback through
          their bank or card issuer, the following rules apply:
        </p>
        <ul>
          <li>
            <strong>Refunds:</strong> If a tip is refunded, the tip is
            excluded from your payout balance. KunTips does not charge you
            a fee for refunds and does not intend to retain any platform
            fee on refunded transactions.
          </li>
          <li>
            <strong>Chargebacks / Disputes:</strong> If a payment is
            disputed through the fan's bank, a dispute fee (currently 200
            NOK) is deducted from your balance regardless of the outcome.
            If the dispute is lost, the disputed tip amount is also
            deducted.
          </li>
          <li>
            KunTips will never profit from refunds or disputes and does not
            charge a platform fee on transactions where you do not receive
            any income.
          </li>
          <li>
            Dispute deductions that exceed your current payout balance
            result in a negative creator balance. KunTips recovers this
            balance automatically by deducting a portion of future tips you
            receive (capped so that deductions never exceed half of any
            single tip) until the balance is settled.
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
          is committed to compliance with Norwegian anti-money laundering
          legislation (hvitvaskingsloven) and may be required to report
          suspicious activity to Økokrim or other relevant authorities
          without prior notice to you.
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
          KunTips' decision concludes our internal appeal process; it does
          not limit any statutory rights you may have to pursue the matter
          before the courts or relevant authorities.
        </p>
        <p>
          <strong>Account closure:</strong> You may request account closure
          at any time by contacting{" "}
          <a href="mailto:support@kuntips.no">support@kuntips.no</a>. Before
          closure, request a payout of any remaining eligible balance from
          your dashboard; we will process a final payout of any eligible
          balance as part of closure. Accounts with outstanding negative
          balances cannot be closed until the balance is settled.
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
          effect, except that changes to tier thresholds or platform fee
          rates are always subject to the 30-day notice period in Section
          3. Continued use of the Service after changes take effect
          constitutes acceptance of the updated Agreement.
        </p>

        <h2>15. Contact</h2>
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
