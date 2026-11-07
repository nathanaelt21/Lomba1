/* Underwater illustrations: fish, coral, seaweed, rocks, bubbles, light rays. */
import { useMemo } from 'react';

const FISH_COLORS = {
  coral: { body: '#FF927E', belly: '#FFC2B4', fin: '#E5654F', stripe: '#F8FCFA' },
  sand: { body: '#F4D6A0', belly: '#FCEBCB', fin: '#D9B26C', stripe: '#FF927E' },
  glass: { body: '#70D6CE', belly: '#BDEEE9', fin: '#18A6A6', stripe: '#F8FCFA' },
  sky: { body: '#A8DFF0', belly: '#E3F5FA', fin: '#2B8FB8', stripe: '#073B4C' },
};

export function Fish({ color = 'coral', className = '', style }) {
  const c = FISH_COLORS[color] || FISH_COLORS.coral;
  return (
    <svg viewBox="0 0 120 70" className={`ill-fish ${className}`} style={style} aria-hidden="true">
      <path className="ill-fish__tail" d="M26 35 L3 14 Q10 35 3 56 Z" fill={c.fin} />
      <path d="M50 13 Q62 -1 78 15 Z" fill={c.fin} />
      <path d="M20 35 C30 8 78 4 98 30 C102 34 102 37 98 41 C78 66 30 62 20 35 Z" fill={c.body} />
      <path d="M28 42 C44 58 78 58 96 42 C78 52 46 52 28 42 Z" fill={c.belly} />
      <path d="M58 12 C52 26 52 44 58 58" stroke={c.stripe} strokeWidth="6" fill="none" strokeLinecap="round" opacity=".85" />
      <path d="M50 40 Q58 46 50 52" stroke={c.fin} strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="84" cy="29" r="7" fill="#fff" />
      <circle cx="86" cy="29" r="3.6" fill="#073B4C" />
      <circle cx="87.4" cy="27.6" r="1.2" fill="#fff" />
      <path d="M97 38 q-3 2 -6 1" stroke="#073B4C" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function BranchCoral({ color = '#FF927E', tip = '#FFC2B4', className = '', style }) {
  return (
    <svg viewBox="0 0 120 140" className={`ill-coral ${className}`} style={style} aria-hidden="true">
      <g stroke={color} strokeWidth="13" strokeLinecap="round" fill="none">
        <path d="M60 136 V80" />
        <path d="M60 104 Q38 94 34 62" />
        <path d="M36 78 Q22 70 20 48" />
        <path d="M60 90 Q82 76 84 44" />
        <path d="M82 62 Q98 54 100 34" />
        <path d="M60 84 V30" />
      </g>
      <g fill={tip}>
        <circle cx="34" cy="62" r="7" />
        <circle cx="20" cy="48" r="7" />
        <circle cx="84" cy="44" r="7" />
        <circle cx="100" cy="34" r="7" />
        <circle cx="60" cy="30" r="7" />
      </g>
    </svg>
  );
}

export function BrainCoral({ className = '', style }) {
  return (
    <svg viewBox="0 0 140 80" className={`ill-coral ${className}`} style={style} aria-hidden="true">
      <path d="M6 78 Q8 10 70 8 Q132 10 134 78z" fill="#F4D6A0" />
      <g stroke="#D9B26C" strokeWidth="4" fill="none" strokeLinecap="round">
        <path d="M24 70 Q30 34 54 26 Q66 22 64 36 Q62 48 76 40 Q92 30 104 44" />
        <path d="M40 74 Q46 52 62 56 Q78 60 84 52 Q98 42 116 66" />
        <path d="M70 18 Q86 16 100 26" />
      </g>
    </svg>
  );
}

export function FanCoral({ color = '#70D6CE', className = '', style }) {
  const rays = [-60, -40, -20, 0, 20, 40, 60];
  return (
    <svg viewBox="0 0 140 130" className={`ill-coral ${className}`} style={style} aria-hidden="true">
      <path d="M70 128 Q6 96 18 40 Q70 -6 122 40 Q134 96 70 128z" fill={color} opacity=".55" />
      <g stroke={color} strokeWidth="5" strokeLinecap="round">
        {rays.map((r) => (
          <path key={r} d="M70 126 L70 26" transform={`rotate(${r} 70 126)`} />
        ))}
      </g>
    </svg>
  );
}

export function Seaweed({ color = '#18A6A6', height = 180, blades = 3, className = '', style }) {
  const paths = [
    'M30 200 C10 160 46 130 28 92 C14 62 38 36 30 4',
    'M44 200 C58 168 30 140 48 104 C60 80 44 58 54 30',
    'M18 200 C6 176 24 156 14 128',
  ];
  return (
    <svg viewBox="0 0 70 200" className={`ill-seaweed ${className}`} style={{ height, ...style }} aria-hidden="true">
      {paths.slice(0, blades).map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={12 - i * 2}
          fill="none"
          strokeLinecap="round"
          className="ill-seaweed__blade"
          style={{ animationDelay: `${-i * 0.9}s` }}
        />
      ))}
    </svg>
  );
}

export function Rock({ color = '#0A4D61', className = '', style }) {
  return (
    <svg viewBox="0 0 160 80" className={`ill-rock ${className}`} style={style} aria-hidden="true">
      <path d="M4 80 Q2 40 40 26 Q60 4 96 16 Q140 20 156 80z" fill={color} />
      <path d="M40 34 Q60 16 88 22" stroke="#fff" strokeOpacity=".14" strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** Rising bubbles. Deterministic layout per `seed` so SSR/re-renders match. */
export function Bubbles({ count = 14, className = '', seed = 1 }) {
  const items = useMemo(() => {
    let s = seed * 9301;
    const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    return Array.from({ length: count }, () => ({
      left: `${r() * 100}%`,
      size: 6 + r() * 16,
      dur: 6 + r() * 8,
      delay: -r() * 14,
      drift: (r() - 0.5) * 40,
    }));
  }, [count, seed]);
  return (
    <div className={`ill-bubbles ${className}`} aria-hidden="true">
      {items.map((b, i) => (
        <span
          key={i}
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.delay}s`,
            '--drift': `${b.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

export function LightRays({ className = '', count = 6 }) {
  return (
    <div className={`ill-rays ${className}`} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} style={{ '--i': i }} />
      ))}
    </div>
  );
}

/** A small reef composition used in section scenes. */
export function MiniReef({ className = '' }) {
  return (
    <div className={`mini-reef ${className}`} aria-hidden="true">
      <Rock className="mini-reef__rock" />
      <BranchCoral className="mini-reef__coral1" />
      <BrainCoral className="mini-reef__brain" />
      <FanCoral className="mini-reef__fan" />
      <Seaweed className="mini-reef__weed1" height={150} />
      <Seaweed className="mini-reef__weed2" color="#70D6CE" height={110} blades={2} />
    </div>
  );
}
