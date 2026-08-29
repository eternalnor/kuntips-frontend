// src/tipStrings.js
// Norwegian/English strings for the tip page.
//
// The English is not a new translation — it is the copy that was on this page
// before the site was translated, kept verbatim. That matters: it was written
// as English, not derived from Norwegian, so it reads like English.
//
// Placeholders are {name}, {min}, {max}, {pct}. Use fmt().

export const TIP_STRINGS = {
  no: {
    // --- CreatorPage ---
    loadingProfile: "Laster profil…",
    notFoundTitle: "Fant ingen med dette brukernavnet",
    notFoundBody: "Det finnes ingen aktiv side på {name}.",
    errorTitle: "Noe gikk galt",
    errorBody: "Vi fikk ikke lastet denne siden. Vennligst prøv igjen om litt.",
    about: "Om",
    noBio: "Denne skaperen har ikke skrevet noe om seg selv ennå.",
    tempUnavailableTitle: "Tipsing er midlertidig utilgjengelig",
    tempUnavailableBody:
      "Denne skaperen kan ikke ta imot tips akkurat nå. Vennligst prøv igjen senere.",
    notReadyTitle: "Kan ikke ta imot tips ennå",
    notReadyBody:
      "Denne skaperen har ikke fullført oppsettet for utbetaling. Vennligst prøv igjen senere.",

    // --- TipWidget: form ---
    heading: "Send tips til {name}",
    intro:
      "Privat som standard – du trenger ingen konto. Du velger beløpet, og om du vil legge igjen navnet ditt.",
    customAmount: "Egendefinert beløp",
    minMax: "Minst {min} kr · Maks {max} kr",
    rowTip: "Tips",
    rowFee: "Gebyr",
    rowTotal: "Totalsum",
    creatorReceives: "Skaperen får {pct} % av tipset",
    feeNote:
      "Gebyret dekker kortbetalingen hos Stripe og en liten andel til KunTips. Det trekkes ikke fra skaperen.",
    yourName: "Navnet ditt",
    optional: "(valgfritt)",
    namePlaceholder: "La stå tomt for å tipse anonymt",
    emailForReceipt: "E-post for kvittering",
    emailPlaceholder: "La stå tomt hvis du ikke vil ha kvittering",
    tipAnonymously: "Tips anonymt",
    tipAs: "Tips som {name}",
    startingPayment: "Åpner sikker betaling…",
    secureNote:
      "Betalingen håndteres i sin helhet av Stripe. KunTips ser aldri kortopplysningene dine.",
    legalPre: "Ved å betale bekrefter du at tipset er en frivillig gave, og godtar ",
    legalTerms: "vilkårene",
    legalAnd: " og ",
    legalPrivacy: "personvernerklæringen",
    processing: "Behandler…",
    paySecurely: "Betal",

    // --- TipWidget: errors ---
    invalidAmount: "Vennligst skriv inn et gyldig beløp.",
    nameNotAllowed:
      "Det navnet er ikke tillatt. Vennligst bruk et annet navn, eller tips anonymt.",
    creatorNotFound: "Vi fant ikke denne skaperen, eller siden er ikke aktiv.",
    payoutsNotSetUp:
      "Denne skaperen har ikke satt opp utbetalinger ennå. Vennligst prøv igjen senere.",
    startFailed: "Noe gikk galt da vi prøvde betalingen. Vennligst prøv igjen om litt.",
    sessionFailed: "Kunne ikke starte betalingsprosessen. Vennligst prøv igjen om litt.",
    configError: "Betalingsløsningen er ikke tilgjengelig akkurat nå. Prøv igjen senere.",
    cardInsufficient: "Det er ikke dekning på valgt kort. Vennligst prøv et annet kort.",
    cardExpired: "Kortet har gått ut på dato. Vennligst prøv et annet kort.",
    cardCvc: "CVC-sikkerhetskoden er feil. Vennligst kontroller koden og prøv igjen.",
    cardDeclined: "Kortet ble avvist. Vennligst prøv et annet kort.",
    cardDeclinedProcessor:
      "Kortet ble avvist av betalingsleverandøren. Vennligst prøv et annet kort.",
    cardProcessing:
      "Noe gikk galt under behandlingen av kortet. Vennligst prøv igjen om litt, eller prøv et annet kort.",
    bankConfirm:
      "Banken din må bekrefte betalingen. Vennligst fullfør bekreftelsen og prøv igjen.",
    notCompleted:
      "Betalingen kunne ikke gjennomføres. Vennligst prøv igjen, eller bruk et annet kort.",
    unexpectedResult: "Uventet resultat av betalingsforsøket. Vennligst prøv igjen.",
    genericError: "Noe gikk galt. Vennligst prøv igjen.",
    pendingStatus: "Betalingsstatus: {status}. Sjekk banken din, eller prøv igjen.",

    // --- TipWidget: success ---
    thanks: "Takk! Tipset ditt er sendt.",
    quips: [
      "Måtte skjegget ditt gro langt og sterkt, og håret aldri falle ut!",
      "Du gjorde akkurat noens dag litt bedre. ♥",
      "Gode ting skjer med gode mennesker. Bare sier det…",
      "Det der var legendarisk. Universet skylder deg en stor en!",
    ],

    langSwitch: "English",
    langLabel: "Bytt til engelsk",
  },

  en: {
    loadingProfile: "Loading profile…",
    notFoundTitle: "Creator not found",
    notFoundBody: "No active creator with username {name} was found.",
    errorTitle: "Something went wrong",
    errorBody:
      "Something went wrong while loading this creator. Please try again in a moment.",
    about: "About",
    noBio: "This creator has not written a bio yet.",
    tempUnavailableTitle: "Tips are temporarily unavailable",
    tempUnavailableBody:
      "This creator is currently not able to receive tips. Please try again later.",
    notReadyTitle: "Tips are not available yet",
    notReadyBody:
      "This creator hasn't finished setting up payouts yet. Please try again later.",

    heading: "Support {name}",
    intro:
      "Private by default — no account needed. You choose the amount and whether to leave your name.",
    customAmount: "Custom amount",
    minMax: "Min {min} kr · Max {max} kr",
    rowTip: "Tip",
    rowFee: "Service fee",
    rowTotal: "Total charged",
    creatorReceives: "Creator receives {pct}% of your tip",
    feeNote:
      "The service fee covers Stripe's card processing and a small KunTips fee — paid by you, not deducted from the creator.",
    yourName: "Your name",
    optional: "(optional)",
    namePlaceholder: "Leave it blank to tip anonymously",
    emailForReceipt: "Email for receipt",
    emailPlaceholder: "Leave blank if you don't want a receipt",
    tipAnonymously: "Tip anonymously",
    tipAs: "Tip as {name}",
    startingPayment: "Starting secure payment…",
    secureNote:
      "Payments are handled entirely by Stripe. KunTips never sees your card details.",
    legalPre: "By paying you acknowledge that your tip is a voluntary gift and agree to the ",
    legalTerms: "Terms of Service",
    legalAnd: " and ",
    legalPrivacy: "Privacy Policy",
    processing: "Processing…",
    paySecurely: "Pay securely",

    invalidAmount: "Please enter a valid number.",
    nameNotAllowed:
      "That name isn't allowed. Please use a different name or tip anonymously.",
    creatorNotFound: "This creator could not be found or is not active right now.",
    payoutsNotSetUp:
      "This creator has not finished setting up payouts yet. Please try again later.",
    startFailed:
      "Something went wrong starting the payment. Please try again in a moment.",
    sessionFailed:
      "We could not start the payment session. Please try again in a moment.",
    configError:
      "Payments are not available right now. Please try again later.",
    cardInsufficient: "That card has insufficient funds. Please try a different card.",
    cardExpired: "That card has expired. Please try a different card.",
    cardCvc:
      "The card's security code (CVC) looks wrong. Please check it and try again.",
    cardDeclined: "Your card was declined. Please try a different card.",
    cardDeclinedProcessor:
      "Your card was declined by our payment processor. This isn't a problem with KunTips — please try a different card.",
    cardProcessing:
      "Something went wrong processing that card. Please try again in a moment, or use a different card.",
    bankConfirm:
      "Your bank needs to confirm this payment. Please complete the verification and try again.",
    notCompleted:
      "The payment couldn't be completed. Please try again or use a different card.",
    unexpectedResult: "Unexpected payment result. Please try again.",
    genericError: "Something went wrong. Please try again.",
    pendingStatus: "Payment status: {status}. Please check your bank or try again.",

    thanks: "Thank you! Your tip was sent successfully.",
    quips: [
      "May your beard grow long and strong, and your hair never fall out.",
      "You just made someone's day a little better. ♥",
      "Great things happen to generous people. Just saying.",
      "That was a legend move. The universe owes you one.",
    ],

    langSwitch: "Norsk",
    langLabel: "Switch to Norwegian",
  },
};

/** Replace {placeholders}. Missing keys are left alone rather than blanked. */
export function fmt(str, vars) {
  if (typeof str !== "string") return str;
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (m, k) =>
    Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : m,
  );
}
