import { useId } from 'react';

/** SEAIR mark: a sky/sea roundel + wordmark where SEA and AIR share the "A". */
export default function Logo({ variant = 'dark', showWord = true, size = 40 }) {
  const id = useId().replace(/:/g, '');
  const wordColor = variant === 'light' ? 'var(--cloud)' : 'var(--deep-ocean)';
  return (
    <span className="logo" style={{ '--logo-size': `${size}px` }}>
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" className="logo__mark">
        <defs>
          <clipPath id={`lc-${id}`}>
            <circle cx="32" cy="32" r="30" />
          </clipPath>
        </defs>
        <g clipPath={`url(#lc-${id})`}>
          <rect width="64" height="64" fill="#A8DFF0" />
          <circle className="logo__sun" cx="44" cy="19" r="7.5" fill="#F4D6A0" />
          <path d="M10 22 h14 a4 4 0 0 0 0-8 a6 6 0 0 0-11-1 a4 4 0 0 0-3 9z" fill="#F8FCFA" />
          <path className="logo__wave1" d="M-16 35 Q-8 30 0 35 T16 35 T32 35 T48 35 T64 35 T80 35 V64 H-16Z" fill="#18A6A6" />
          <path className="logo__wave2" d="M-16 45 Q-8 40 0 45 T16 45 T32 45 T48 45 T64 45 T80 45 V64 H-16Z" fill="#087E8B" />
          <path d="M0 55 Q8 51 16 55 T32 55 T48 55 T64 55 V64 H0Z" fill="#073B4C" />
        </g>
        <circle cx="32" cy="32" r="30" fill="none" stroke="#073B4C" strokeOpacity=".15" strokeWidth="2" />
      </svg>
      {showWord && (
        <span className="logo__word" style={{ color: wordColor }}>
          SE<span className="logo__a">A</span>IR
        </span>
      )}
    </span>
  );
}
