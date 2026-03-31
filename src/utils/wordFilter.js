/**
 * Simple client-side word filter for user-submitted text fields.
 * This is a first line of defence only — the backend should enforce the same rules.
 * Uses word-boundary matching (\b) to avoid false positives on innocent words
 * that happen to contain blocked substrings (e.g. "Essex", "Classical", "assistant").
 */

const BLOCKED = [
  // Sexual / explicit
  "fuck", "fucker", "fucking", "fuk",
  "shit", "shat",
  "cunt", "cunts",
  "cock", "cocks", "cocksucker",
  "dick", "dicks",
  "pussy", "pussies",
  "asshole", "assholes", "arse", "arsehole",
  "bitch", "bitches",
  "whore", "whores",
  "slut", "sluts",
  "porn", "porno", "pornography",
  "sexting",
  "nude", "nudes",
  "boob", "boobs", "tit", "tits",
  "dildo", "vibrator",
  "rape", "rapist",
  "masturbat",
  "orgasm",
  "horny",
  "cumshot",
  // Slurs
  "nigger", "nigga",
  "faggot", "fag",
  "retard", "retarded",
  "spastic",
  "tranny",
  "chink", "gook", "spic", "kike", "wetback",
  // Harassment / threats
  "kys", "kill yourself", "kill ur self",
  "go die",
];

/**
 * Normalise a string: lowercase, collapse whitespace, strip most punctuation.
 */
function normalise(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Returns true if the text contains a blocked word or phrase.
 * Uses \b word boundaries to avoid false positives (e.g. "Essex", "Classical").
 */
export function containsBlockedContent(text) {
  if (!text || typeof text !== "string") return false;
  const norm = normalise(text);
  return BLOCKED.some((term) => {
    const pattern = "\\b" + normalise(term).replace(/\s+/g, "\\s+") + "\\b";
    return new RegExp(pattern, "i").test(norm);
  });
}
