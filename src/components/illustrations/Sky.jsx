/* Sky illustrations: clouds, sun, birds. Flat cartoon style, palette-only. */

const CLOUD_SHAPES = {
  a: [
    ['c', 70, 62, 34],
    ['c', 118, 46, 42],
    ['c', 162, 66, 28],
    ['r', 36, 62, 154, 34],
  ],
  b: [
    ['c', 52, 66, 26],
    ['c', 92, 50, 36],
    ['c', 136, 42, 30],
    ['c', 172, 64, 24],
    ['r', 28, 64, 168, 32],
  ],
  c: [
    ['c', 80, 58, 30],
    ['c', 124, 60, 24],
    ['r', 50, 62, 100, 28],
  ],
};

function CloudShape({ shape, dy = 0 }) {
  return CLOUD_SHAPES[shape].map(([t, a, b, c, d], i) =>
    t === 'c' ? (
      <circle key={i} cx={a} cy={b + dy} r={c} />
    ) : (
      <rect key={i} x={a} y={b + dy} width={c} height={d} rx={d / 2} />
    )
  );
}

export function Cloud({ shape = 'a', className = '', style, tint = '#d6f0f7' }) {
  return (
    <svg viewBox="0 0 220 110" className={`ill-cloud ${className}`} style={style} aria-hidden="true">
      <g fill={tint}>
        <CloudShape shape={shape} dy={7} />
      </g>
      <g fill="#F8FCFA">
        <CloudShape shape={shape} />
      </g>
      <ellipse cx="104" cy="40" rx="14" ry="6" fill="#fff" opacity=".9" />
    </svg>
  );
}

export function Sun({ className = '', style }) {
  const rays = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg viewBox="0 0 220 220" className={`ill-sun ${className}`} style={style} aria-hidden="true">
      <circle cx="110" cy="110" r="96" fill="#FFD98A" opacity=".18" />
      <circle cx="110" cy="110" r="74" fill="#FFD98A" opacity=".28" />
      <g className="ill-sun__rays">
        {rays.map((r) => (
          <rect key={r} x="104" y="14" width="12" height="26" rx="6" fill="#FFD98A" transform={`rotate(${r} 110 110)`} />
        ))}
      </g>
      <circle cx="110" cy="110" r="50" fill="#FFD98A" />
      <circle cx="110" cy="110" r="50" fill="#F4D6A0" opacity=".55" />
      <circle cx="96" cy="94" r="14" fill="#fff" opacity=".45" />
    </svg>
  );
}

export function Bird({ className = '', style }) {
  return (
    <svg viewBox="0 0 30 14" className={`ill-bird ${className}`} style={style} aria-hidden="true">
      <path
        className="ill-bird__wings"
        d="M2 9 Q8 1 15 8 Q22 1 28 9"
        fill="none"
        stroke="#073B4C"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
