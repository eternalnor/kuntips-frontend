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
  "At least 8 characters, with an uppercase letter, a lowercase letter, a number, and a special character.";

export const PASSWORD_ERROR =
  "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.";

/** Renders a live requirements checklist. Pass the current password value. */
export function PasswordChecklist({ password }) {
  if (!password) return null;
  const r = passwordRequirements(password);
  const items = [
    { label: "At least 8 characters",          met: r.length  },
    { label: "One uppercase letter (A\u2013Z)", met: r.upper   },
    { label: "One lowercase letter (a\u2013z)", met: r.lower   },
    { label: "One number (0\u20139)",           met: r.digit   },
    { label: "One special character (!@#$ etc.)", met: r.special },
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
