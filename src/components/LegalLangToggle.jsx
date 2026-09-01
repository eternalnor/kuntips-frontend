// src/components/LegalLangToggle.jsx
// Language switch for the legal and support pages — the shared flag toggle,
// floated to the top right of the document. Reads and sets the same language
// state as the tip page (see LangFlagToggle.jsx for why that sharing matters).

import LangFlagToggle from "./LangFlagToggle.jsx";

export default function LegalLangToggle() {
  return <LangFlagToggle className="lang-flags--legal" />;
}

/**
 * The Norwegian version governs; the English version is a convenience
 * translation. Shown at the top of every ENGLISH legal page so an
 * English-reading visitor knows which text is authoritative. (Flipped from
 * English-prevails by owner decision 26 Aug 2026: both texts were drafted
 * without legal review, so the original-language argument carried no weight,
 * and Norwegian-prevails fits a Norwegian platform under Norwegian law.)
 */
export function ConvenienceNote() {
  return (
    <p className="legal-convenience-note">
      This English version is a translation provided for convenience. In case
      of any conflict between the versions, the Norwegian version prevails.
    </p>
  );
}
