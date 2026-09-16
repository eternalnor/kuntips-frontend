// src/vanity.js
// Typed-link attribution. A link in a TikTok caption or an Instagram bio is
// often typed by the visitor rather than clicked, and nobody types
// "?ref=TIKTOK1". A two-letter path is typeable — kuntips.no/tt — and it
// redirects to the coded URL so the visit still lands on the right campaign.
//
// Creator usernames are 3–32 characters, so two-letter paths can never collide
// with a creator page. The codes must exist in /admin → Referral codes.
export const VANITY_PATHS = {
  tt: "TIKTOK1",
  ig: "IG1",
  fb: "FB1",
  dm: "DM1",
};
