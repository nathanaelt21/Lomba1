import { useId } from 'react';

/**
 * SEAIR mark: a soft squircle that fades from sky to deep sea. A wind gust
 * curls across the top and settles into a wave at the bottom, so air and
 * ocean read as one continuous flow. Wordmark: SEA and AIR share the "A",
 * which blends from ink into lagoon.
 */
export default function Logo({ variant = 'dark', showWord = true, size = 40 }) {
  const id = useId().replace(/:/g, '');
  const light = variant === 'light';
  return (
    <span className={`logo ${light ? 'logo--light' : ''}`} style={{ '--logo-size': `${size}px` }}>
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" className="logo__mark">
        <defs>
          <linearGradient id={`lg-${id}`} x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0" stopColor="#8FD8EC" />
            <stop offset="0.48" stopColor="#18A6A6" />
            <stop offset="1" stopColor="#073B4C" />
          </linearGradient>
          <clipPath id={`lc-${id}`}>
            <rect x="2" y="2" width="60" height="60" rx="19" />
          </clipPath>
        </defs>
        <rect x="2" y="2" width="60" height="60" rx="19" fill={`url(#lg-${id})`} />
        <g clipPath={`url(#lc-${id})`}>
          {/* sun */}
          <circle className="logo__sun" cx="47" cy="16" r="5.5" fill="#FF927E" />
          {/* wind gusts */}
          <g className="logo__wind" fill="none" stroke="#F8FCFA" strokeWidth="4.2" strokeLinecap="round">
            <path d="M12 23 H32 a5.5 5.5 0 1 0 -5.5 -5.5" />
            <path d="M12 32 H40" opacity=".75" />
          </g>
          {/* waves */}
          <path
            className="logo__wave1"
            d="M-14 45 q5.5 -6 11 0 t11 0 t11 0 t11 0 t11 0 t11 0 t11 0 V70 H-14Z"
            fill="#F8FCFA"
            opacity=".9"
          />
          <path
            className="logo__wave2"
            d="M-20 53 q5.5 -5 11 0 t11 0 t11 0 t11 0 t11 0 t11 0 t11 0 t11 0 V70 H-20Z"
            fill="#0A4D61"
          />
        </g>
      </svg>
      {showWord && (
        <span className="logo__word">
          SE<span className="logo__a">A</span>
          <span className="logo__air">IR</span>
        </span>
      )}
    </span>
  );
}
