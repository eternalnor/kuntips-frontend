/**
 * Shared password strength utilities used by both the register form
 * and the password-change form in the dashboard.
 */

export function passwordRequirements(password) {
  return {
    length:  (password || "").length >= 8,
    upper:   /[A-Z]/.test(password || ""),
    lower:   /[a-z]/.test(password || ""),
    digit:   /\d/.test(password || ""),
    special: /[^A-Za-z0-9]/.test(password || ""),
  };
}

export function isStrongPassword(password) {
  if (!password) return false;
  const r = passwordRequirements(password);
  return r.length && r.upper && r.lower && r.digit && r.special;
}

export const PASSWORD_HINT =
  "Minst 8 tegn, med stor bokstav, liten bokstav, tall og spesialtegn.";

export const PASSWORD_ERROR =
  "Passordet må være minst 8 tegn og inneholde stor bokstav, liten bokstav, tall og spesialtegn.";

/** Renders a live requirements checklist. Pass the current password value. */
export function PasswordChecklist({ password }) {
  if (!password) return null;
  const r = passwordRequirements(password);
  const items = [
    { label: "Minst 8 tegn",                    met: r.length  },
    { label: "\u00c9n stor bokstav (A\u2013\u00c5)",      met: r.upper   },
    { label: "\u00c9n liten bokstav (a\u2013\u00e5)",     met: r.lower   },
    { label: "Ett tall (0\u20139)",             met: r.digit   },
    { label: "Ett spesialtegn (!@#$ osv.)",     met: r.special },
  ];
  return (
    <ul className="password-requirements">
      {items.map(({ label, met }) => (
        <li key={label} className={met ? "req-met" : ""}>
          {met ? "\u2713" : "\u00b7"} {label}
        </li>
      ))}
    </ul>
  );
}
