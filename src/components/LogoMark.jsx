export default function LogoMark({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="kt-bg"
          x1="0" y1="36" x2="36" y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient
          id="kt-glow"
          x1="0" y1="0" x2="0" y2="1"
        >
          <stop stopColor="white" stopOpacity="0.18" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Rounded square background */}
      <rect width="36" height="36" rx="9" fill="url(#kt-bg)" />

      {/* Subtle inner top-highlight for depth */}
      <rect width="36" height="18" rx="9" fill="url(#kt-glow)" />

      {/* Coin ring */}
      <circle
        cx="18" cy="20" r="8"
        stroke="white" strokeWidth="1.6" strokeOpacity="0.85"
      />

      {/* Upward arrow — tip being sent */}
      <path
        d="M18 17V24.5M14.5 20L18 16.5L21.5 20"
        stroke="white"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Sparkle dots — top right */}
      <circle cx="27.5" cy="8.5" r="1.2" fill="white" fillOpacity="0.5" />
      <circle cx="30.5" cy="12.5" r="0.75" fill="white" fillOpacity="0.3" />
      <circle cx="25"   cy="5.5" r="0.6"  fill="white" fillOpacity="0.2" />
    </svg>
  );
}
