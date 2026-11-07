/* Floating objects that ride the interactive wave surface. */

export function Boat({ className = '', style }) {
  return (
    <svg viewBox="0 0 120 90" className={`ill-boat ${className}`} style={style} aria-hidden="true">
      {/* mast + flag */}
      <path d="M58 70 V14" stroke="#073B4C" strokeWidth="3.5" strokeLinecap="round" />
      <path className="ill-boat__flag" d="M60 14 L84 20 L60 28z" fill="#FF927E" />
      {/* sail */}
      <path d="M62 30 Q90 46 86 64 H62z" fill="#F8FCFA" />
      <path d="M54 34 Q34 50 38 64 H54z" fill="#E9F7F2" />
      {/* hull */}
      <path d="M8 66 H112 Q104 86 84 86 H32 Q14 86 8 66z" fill="#FF927E" />
      <path d="M8 66 H112 l-3 7 H11z" fill="#F4D6A0" />
      <circle cx="40" cy="77" r="3" fill="#073B4C" opacity=".35" />
      <circle cx="80" cy="77" r="3" fill="#073B4C" opacity=".35" />
    </svg>
  );
}

export function Buoy({ className = '', style }) {
  return (
    <svg viewBox="0 0 70 110" className={`ill-buoy ${className}`} style={style} aria-hidden="true">
      <path d="M35 6 V30" stroke="#073B4C" strokeWidth="3" strokeLinecap="round" />
      <circle className="ill-buoy__light" cx="35" cy="6" r="5" fill="#FF927E" />
      <path d="M22 30 h26 l6 36 H16z" fill="#F8FCFA" />
      <path d="M20 44 h30 l2 10 H18z" fill="#FF927E" />
      <rect x="27" y="34" width="16" height="6" rx="2" fill="#087E8B" />
      <ellipse cx="35" cy="72" rx="30" ry="12" fill="#F4D6A0" />
      <ellipse cx="35" cy="69" rx="30" ry="9" fill="#FF927E" />
    </svg>
  );
}
