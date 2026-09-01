// src/dashStrings.js
//
// Bilingual reference for the creator dashboard and onboarding-refresh page.
//
// The dashboard currently renders the Norwegian strings inline (it is a
// Norwegian-only surface today). This table preserves BOTH languages so a
// future language toggle is a wiring job, not a re-translation job — per
// owner decision: "keep the english ones as backups in case we want a
// language toggle for this at some point".
//
// NOTE: the English here is the *corrected* English. Two factual claims from
// the original copy were removed in both languages, because they are false:
// "you don't need an organisation number" and "have your ID (passport or
// driving licence) ready" — Stripe's Norwegian onboarding asks for neither
// at the opening stage (verified against real account requirement lists).

export const DASH_STRINGS = {
  no: {
    verifyBannerTail: "for en bekreftelseslink fra KunTips.",
    verifyBannerSub:
      "E-postadressen må være bekreftet før du kan koble til Stripe og motta utbetalinger.",
    errorHint:
      "Mener du dette er feil, sjekk at du er logget inn med riktig e-postadresse, og at brukernavnet i adressen stemmer med KunTips-brukernavnet ditt.",
    pillUnfinished: "⚠ Stripe-oppsettet er ikke fullført",
    pillNotConnected: "⚠ Stripe er ikke koblet til",
    stalledShort:
      "Du begynte å koble til Stripe, men fullførte ikke – så tipssiden din kan ikke ta imot betalinger ennå. Det tar vanligvis rundt fem minutter. Ha kontonummeret klart.",
    connectShort:
      "Koble til Stripe for å begynne å ta imot tips. Det tar rundt fem minutter. Ha kontonummeret klart.",
    tipLinkShare:
      "Del denne linken med følgerne dine, så kan de sende deg tips – de er private som standard, og kan velge å legge igjen navnet sitt.",
    tipLinkInactive:
      "Dette er linken din, men den kan ikke ta imot betalinger før Stripe-oppsettet er fullført. Ikke del den ennå – tips som sendes dit, vil feile.",
    recentSub: "De siste 20 tipsene dine.",
    noTips: "Ingen tips ennå. Når følgerne begynner å tipse, ser du dem her.",
    payoutsNote:
      "Selve utbetalingene håndteres av Stripe. KunTips viser samlet statistikk her, mens Stripe gir detaljerte utbetalingsrapporter til regnskapet.",
    profileSubPre: "Dette ser følgerne på KunTips-siden din (",
    labelDisplayName: "Visningsnavn",
    displayNameHelp: "Vises på KunTips-siden din og i oversikten.",
    bioHelp: "En kort tekst som vises på tipssiden din.",
    profileSaved: "Profilen er lagret. Den offentlige siden din oppdateres straks.",
    profileNote:
      "Foreløpig kan du endre visningsnavn og profiltekst. Avatar og flere merkevarevalg kommer senere.",
    referralSub:
      "Del denne linken med andre skapere. Når de registrerer seg og begynner å motta tips, får du en varig vervebonus på nivået ditt (opptil nivå 6).",
    referralCount:
      "Nye skapere som registrerer seg via den, teller mot vervebonusene dine.",
    referred365: "Skapere vervet siste 365 dager:",
    boostReferralPre: "Vervebonus: ",
    boostReferralPost: " på det effektive nivået ditt akkurat nå.",
    boostJoinPre: "Velkomstbonus: ",
    boostJoinPost:
      " fordi du nylig ble med i KunTips. Midlertidig, legges oppå basisnivået ditt.",
    boostTempPre: "Midlertidig kampanjebonus: ",
    boostTempPost: " aktiv nå.",
    boostEventPre: "🎉 Arrangementsbonus: ",
    boostEventPost:
      " – en KunTips-kampanje er aktiv for alle skapere akkurat nå!",
    noBoosts:
      "Du har ingen ekstra bonuser ennå. Når du når 10 vervede skapere i løpet av 12 måneder, får du +1 nivå. Ved 35: +2 nivåer; og 100 gir +3 nivåer – alltid begrenset til nivå 6.",
    referralUnavailable:
      "Vervedetaljer vises her når brukernavnet ditt er tilgjengelig.",
    securitySub: "Bytt passord og logg ut av denne nettleseren.",
    labelCurrentPassword: "Nåværende passord",
    labelNewPassword: "Nytt passord",
    labelConfirmPassword: "Bekreft nytt passord",
    logoutBtn: "Logg ut av denne nettleseren",
    connectedSubPre: "Stripe-kontoen din er koblet til. KunTips bruker Stripe til alle utbetalinger. Du beholder ",
    connectedSubPost:
      " av hvert tips; tipserne dekker Stripe-gebyrene og KunTips-plattformgebyret.",
    stalledPayout1:
      "Du begynte å koble til Stripe, men fullførte ikke – så utbetalinger er ikke aktive ennå, og tipssiden din kan ikke ta imot betalinger.",
    stalledPayout2:
      "Alt du la inn er lagret hos Stripe – du fortsetter der du slapp. Ha kontonummeret klart.",
    stripeStillNeeds: "Stripe mangler fortsatt: ",
    opensNewSession:
      "Dette åpner Stripe i en ny økt. Når du er ferdig, kommer du tilbake hit og ser oppdatert status.",
    balanceSub:
      "Tips holdes tilbake i 7 dager før de blir tilgjengelige for utbetaling. Når du ber om utbetaling, sendes tilgjengelige tips til den tilknyttede Stripe-kontoen din.",
    loadingPayout: "Laster utbetalingsinfo…",
    eligibleSuffix: " tips tilgjengelig",
    pendingHold: "tips i 7-dagers sperre",
    nextClearsPre: "Neste tips blir tilgjengelig ",
    debtPre: "Merk: du har en utestående gjeld på ",
    debtPost: " som trekkes inn fra fremtidige tips.",
    noEligible:
      "Ingen tilgjengelige tips ennå. Tips blir tilgjengelige 7 dager etter at betalingen er gjennomført.",
    historySubPre: "Dine siste ",
    historySubPost: " utbetalinger. Klikk på en rad for å se tipsene som inngår.",
    loadingStatement: "Laster oppgjør…",
    couldNotLoadStatement: "Fikk ikke lastet oppgjøret.",
    noTipsInPayout: "Ingen tips i denne utbetalingen.",
    statusPaid: "✅ Utbetalt",
    statusProcessing: "⏳ Behandles",
    statusFailed: "❌ Feilet",
    statusCancelled: "— Avbrutt",
    // Onboarding refresh page
    refreshTitle: "Sender deg tilbake til Stripe…",
    refreshLead: "Et øyeblikk – vi fortsetter oppsettet der du slapp.",
    refreshFinishTitle: "La oss fullføre oppsettet",
    refreshNoSession:
      "Du er logget ut, så vi fikk ikke åpnet Stripe automatisk. Logg inn igjen, så fortsetter du der du slapp – ingenting du la inn er tapt.",
    refreshLoginBtn: "Logg inn for å fortsette",
    refreshDashBtn: "Gå til oversikten",
    refreshFailed:
      "Vi fikk ikke åpnet Stripe akkurat nå. Fremdriften din er lagret – prøv igjen, eller gå til oversikten og fortsett derfra.",
    refreshRetry: "Prøv igjen",
    refreshOpening: "Åpner Stripe…",
    overviewFor: "Oversikt for",
    tabOverview: "Oversikt",
    tabProfile: "Profil",
    tabPayouts: "Utbetalinger",
    totalTipsSuffix: " tips totalt",
    earnedSuffix: " kr opptjent",
    topPercentPre: "Topp ",
    topPercentPost: " % av skaperne",
    vsPrev30: "% mot forrige 30 dager",
    streakSuffix: " dager på rad",
    onPacePre: "📈 Ligger an til ~",
    onPacePost: " kr denne måneden",
    bestDayPre: "🏆 Beste dag: ",
    bestMonthPre: "📅 Beste måned: ",
    krSuffix: " kr",
    pillConnected: "● Stripe tilkoblet",
    connectedPre: "Utbetalingskontoen din er aktiv. Administrer den i ",
    connectedTab: "Utbetalinger-fanen",
    previewPage: "Forhåndsvis siden din →",
    last30Suffix: " tips siste 30 dager",
    eventAllPre: "Alle skapere får ",
    eventTierOne: "nivå",
    eventTierMany: "nivåer",
    eventAllPost: " så lenge bonusen varer.",
    endingSoon: "Slutter snart…",
    debtDeductedPre: "Trukket gjeld: −",
    tierFeeText:
      "Tipserne dekker gebyrene. Stripe tar et fast gebyr på kr 2,75 hver gang du overfører saldoen til banken din.",
    tierKeepPre: "Du beholder nå ",
    tierKeepPost: " av hvert tips. ",
    backToCreators: "← Tilbake til informasjon for skapere",
    tipStatus: {
      succeeded: "Gjennomført",
      failed: "Feilet",
      pending: "Venter",
      processing: "Behandles",
      refunded: "Refundert",
      disputed: "Bestridt",
    },
  },

  en: {
    verifyBannerTail: "for a verification link from KunTips.",
    verifyBannerSub:
      "You need a verified email before you can connect Stripe and receive payouts.",
    errorHint:
      "If you believe this is a mistake, make sure you're logged in with the correct creator email and that the username in the URL matches your KunTips creator username.",
    pillUnfinished: "⚠ Stripe setup unfinished",
    pillNotConnected: "⚠ Stripe not connected",
    stalledShort:
      "You started connecting Stripe but didn't finish, so your tip page can't take payments yet. It usually takes about five minutes. Have your bank account number ready.",
    connectShort:
      "Connect Stripe to start receiving tips. Takes about five minutes. Have your bank account number ready.",
    tipLinkShare:
      "Share this link with your followers so they can send you tips — they stay private by default, or can optionally leave their name.",
    tipLinkInactive:
      "This is your link, but it can't accept payments until your Stripe setup is finished. Don't share it yet — tips sent to it will fail.",
    recentSub: "Your latest 20 tips.",
    noTips: "No tips yet. Once your followers start tipping, you'll see them here.",
    payoutsNote:
      "Payouts themselves are handled by Stripe. KunTips shows you aggregated stats here, while Stripe provides detailed payout reports for your accounting.",
    profileSubPre: "This is what your followers see on your KunTips page (",
    labelDisplayName: "Display name",
    displayNameHelp: "Shown on your KunTips page and in your dashboard.",
    bioHelp: "A short description shown on your tip page.",
    profileSaved: "Profile saved. Your public page will reflect these changes shortly.",
    profileNote:
      "Profile editing currently lets you change your display name and bio. Avatar and additional branding options will be added later.",
    referralSub:
      "Share this link with other creators. When they sign up and start receiving tips, you get a permanent referral bonus on your tier (up to Tier 6).",
    referralCount:
      "New creators who register through it will count towards your referral boosts.",
    referred365: "Creators referred in the last 365 days:",
    boostReferralPre: "Referral boost: ",
    boostReferralPost: " applied to your effective tier right now.",
    boostJoinPre: "Join boost: ",
    boostJoinPost:
      " because you recently joined KunTips. Temporary, stacked on top of your base tier.",
    boostTempPre: "Temporary promo boost: ",
    boostTempPost: " currently active.",
    boostEventPre: "🎉 Platform event boost: ",
    boostEventPost:
      " — a special KunTips promotion is active for all creators right now!",
    noBoosts:
      "You don't have any extra boosts yet. Once you reach 10 referred creators in a 12-month period, you get +1 tier. At 35, +2 tiers; and 100 gives +3 tiers — always capped at Tier 6.",
    referralUnavailable:
      "Referral details will appear here when your username is available.",
    securitySub: "Change your password and log out of this browser.",
    labelCurrentPassword: "Current password",
    labelNewPassword: "New password",
    labelConfirmPassword: "Confirm new password",
    logoutBtn: "Log out of this browser",
    connectedSubPre: "Your Stripe account is connected. KunTips uses Stripe to handle all payouts. You keep ",
    connectedSubPost:
      " of each tip; tippers cover Stripe fees and the KunTips platform fee.",
    stalledPayout1:
      "You started connecting Stripe but haven't finished, so payouts aren't active yet and your tip page can't accept payments.",
    stalledPayout2:
      "Everything you entered is saved with Stripe — you'll carry on where you left off. Have your bank account number ready.",
    stripeStillNeeds: "Stripe still needs: ",
    opensNewSession:
      "This opens Stripe in a new session. When you're done, come back here to see your updated status.",
    balanceSub:
      "Tips are held for 7 days before becoming eligible for payout. When you request a payout, eligible tips are sent to your connected Stripe account.",
    loadingPayout: "Loading payout info…",
    eligibleSuffix: " tip(s) eligible",
    pendingHold: "tip(s) in 7-day hold",
    nextClearsPre: "Next pending tip clears on ",
    debtPre: "Note: you have an outstanding balance of ",
    debtPost: " that is recovered from future tips.",
    noEligible:
      "No eligible tips yet. Tips become eligible 7 days after the payment clears.",
    historySubPre: "Your last ",
    historySubPost: " payouts. Click a row to see the itemised tip breakdown.",
    loadingStatement: "Loading statement…",
    couldNotLoadStatement: "Could not load statement.",
    noTipsInPayout: "No tips in this payout.",
    statusPaid: "✅ Paid",
    statusProcessing: "⏳ Processing",
    statusFailed: "❌ Failed",
    statusCancelled: "— Cancelled",
    refreshTitle: "Taking you back to Stripe…",
    refreshLead: "One moment — we're picking up your setup where you left off.",
    refreshFinishTitle: "Let's finish your setup",
    refreshNoSession:
      "You've been signed out, so we couldn't reopen Stripe automatically. Log back in and you can carry on where you left off — nothing you entered is lost.",
    refreshLoginBtn: "Log in to continue",
    refreshDashBtn: "Go to dashboard",
    refreshFailed:
      "We couldn't reopen Stripe just then. Your progress is saved — try again, or head to your dashboard and pick it up from there.",
    refreshRetry: "Try again",
    refreshOpening: "Opening Stripe…",
    overviewFor: "Overview for",
    tabOverview: "Overview",
    tabProfile: "Profile",
    tabPayouts: "Payouts",
    totalTipsSuffix: " total tips",
    earnedSuffix: " NOK earned",
    topPercentPre: "Top ",
    topPercentPost: "% of creators",
    vsPrev30: "% vs prev. 30 days",
    streakSuffix: "-day streak",
    onPacePre: "📈 On pace for ~",
    onPacePost: " NOK this month",
    bestDayPre: "🏆 Best day: ",
    bestMonthPre: "📅 Best month: ",
    krSuffix: " NOK",
    pillConnected: "● Stripe connected",
    connectedPre: "Your payout account is active. Manage it in the ",
    connectedTab: "Payouts tab",
    previewPage: "Preview your page →",
    last30Suffix: " tip(s) in the last 30 days",
    eventAllPre: "All creators receive ",
    eventTierOne: "tier",
    eventTierMany: "tiers",
    eventAllPost: " for the duration of this event.",
    endingSoon: "Ending soon…",
    debtDeductedPre: "Debt deducted: −",
    tierFeeText:
      "Tippers cover the fees. Stripe charges a flat NOK 2.75 fee each time you transfer your balance to your bank.",
    tierKeepPre: "You now keep ",
    tierKeepPost: " of each tip. ",
    backToCreators: "← Back to creator information",
    tipStatus: {
      succeeded: "Succeeded",
      failed: "Failed",
      pending: "Pending",
      processing: "Processing",
      refunded: "Refunded",
      disputed: "Disputed",
    },
  },
};

// The active language for these surfaces. Swap to a hook when a toggle is
// wanted — every string above is already paired.
export const DASH = DASH_STRINGS.no;
