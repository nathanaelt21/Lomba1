/* Coastal skyline of Teluk Jakarta: towers, Monas, port cranes, chimneys. */

export function Skyline({ className = '', style }) {
  return (
    <svg viewBox="0 0 1200 140" preserveAspectRatio="none" className={`ill-skyline ${className}`} style={style} aria-hidden="true">
      {/* far layer */}
      <g fill="#70D6CE" opacity=".45">
        <rect x="40" y="70" width="38" height="70" rx="4" />
        <rect x="86" y="50" width="30" height="90" rx="4" />
        <rect x="300" y="60" width="46" height="80" rx="4" />
        <rect x="352" y="38" width="28" height="102" rx="4" />
        <rect x="640" y="56" width="34" height="84" rx="4" />
        <rect x="680" y="76" width="50" height="64" rx="4" />
        <rect x="980" y="64" width="40" height="76" rx="4" />
        <rect x="1100" y="48" width="32" height="92" rx="4" />
      </g>
      {/* near layer */}
      <g fill="#18A6A6" opacity=".55">
        <rect x="120" y="84" width="54" height="56" rx="5" />
        <rect x="180" y="62" width="34" height="78" rx="5" />
        {/* Monas */}
        <path d="M468 140 V112 h-26 l8 -10 h70 l8 10 h-26 V140z" />
        <path d="M478 102 L482 30 h6 l4 72z" />
        <path d="M480 30 q5 -18 10 0z" fill="#F4D6A0" opacity="1" />
        <rect x="540" y="78" width="44" height="62" rx="5" />
        <rect x="590" y="96" width="36" height="44" rx="5" />
        <rect x="900" y="88" width="60" height="52" rx="5" />
      </g>
      {/* port cranes */}
      <g stroke="#087E8B" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".55">
        <path d="M770 140 V70 L840 70 M770 82 L812 70 M790 70 V140" />
        <path d="M840 70 V96" strokeWidth="3" />
        <path d="M1040 140 V60 L1090 60 M1040 74 L1070 60 M1056 60 V140" />
      </g>
      {/* smoke puffs (animated in illustrations.css) */}
      <g className="sk-smoke" fill="#073B4C" opacity=".16">
        <circle cx="243" cy="64" r="8" />
        <circle cx="243" cy="64" r="8" />
        <circle cx="243" cy="64" r="8" />
        <circle cx="866" cy="74" r="7" />
        <circle cx="866" cy="74" r="7" />
        <circle cx="866" cy="74" r="7" />
      </g>
      {/* chimneys */}
      <g fill="#087E8B" opacity=".6">
        <rect x="236" y="70" width="14" height="70" rx="3" />
        <rect x="258" y="88" width="12" height="52" rx="3" />
        <rect x="860" y="80" width="12" height="60" rx="3" />
      </g>
    </svg>
  );
}

/** Animated smoke puffs; positioned by the parent over a chimney. */
export function Smoke({ className = '', style }) {
  return (
    <span className={`ill-smoke ${className}`} style={style} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}
