import { PATHWAYS } from '../../data/pathways.js';

/** Step marker positions in the 1000×560 diagram. */
const MARKERS = {
  emission: [205, 96],
  transport: [470, 62],
  deposition: [610, 214],
  exchange: [880, 250],
  runoff: [150, 262],
  response: [690, 410],
};

/**
 * Cross-section of Teluk Jakarta from the coastal city to the seabed.
 * Elements carry `dg--<step>` classes; the active step stays bright and the
 * rest dim.
 */
export default function ConnectionDiagram({ active, onSelect, playing = false }) {
  return (
    <div className={`diagram ${playing ? 'is-playing' : ''}`} data-active={active}>
      <svg viewBox="0 0 1000 560" role="img" aria-label="Diagram perjalanan polutan dari kota pesisir, melalui udara, hingga masuk ke Teluk Jakarta">
        <defs>
          <linearGradient id="dg-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#A8DFF0" />
            <stop offset="1" stopColor="#F8FCFA" />
          </linearGradient>
          <linearGradient id="dg-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#18A6A6" />
            <stop offset="1" stopColor="#073B4C" />
          </linearGradient>
          <marker id="dg-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10z" fill="#073B4C" />
          </marker>
        </defs>

        {/* backdrop */}
        <rect width="1000" height="310" fill="url(#dg-sky)" />
        <rect y="300" width="1000" height="260" fill="url(#dg-sea)" />
        <circle cx="905" cy="74" r="34" fill="#FFD98A" />
        <circle cx="905" cy="74" r="50" fill="#FFD98A" opacity=".25" />

        {/* sea surface */}
        <path d="M300 302 Q340 292 380 302 T460 302 T540 302 T620 302 T700 302 T780 302 T860 302 T940 302 T1020 302" stroke="#F8FCFA" strokeWidth="4" fill="none" />

        {/* land cross-section */}
        <path d="M0 232 H250 Q296 232 318 300 L372 560 H0Z" fill="#F4D6A0" />
        <path d="M0 232 H250 Q296 232 318 300" stroke="#70D6CE" strokeWidth="8" fill="none" />

        {/* city */}
        <g fill="#087E8B" opacity=".85">
          <rect x="22" y="160" width="34" height="72" rx="4" />
          <rect x="62" y="126" width="28" height="106" rx="4" />
          <rect x="96" y="176" width="40" height="56" rx="4" />
          <path d="M150 232 V208 h-12 l4 -6 h30 l4 6 h-12 V232z" />
          <path d="M155 202 L158 150 h4 l3 52z" />
        </g>

        {/* emission: factory + smoke */}
        <g className="dg dg--emission">
          <rect x="190" y="196" width="60" height="36" rx="4" fill="#073B4C" />
          <rect x="198" y="150" width="14" height="50" rx="3" fill="#073B4C" />
          <rect x="222" y="164" width="12" height="36" rx="3" fill="#073B4C" />
          <g className="dg-smoke" fill="#6b8d96">
            <circle cx="205" cy="140" r="10" />
            <circle cx="214" cy="124" r="13" />
            <circle cx="228" cy="150" r="8" />
          </g>
          {/* car */}
          <rect x="100" y="222" width="30" height="12" rx="5" fill="#FF927E" />
        </g>

        {/* transport: wind carrying pollution offshore */}
        <g className="dg dg--transport">
          <path className="dg-flow" d="M235 120 C 360 40, 560 50, 700 110" stroke="#073B4C" strokeWidth="4" fill="none" strokeLinecap="round" markerEnd="url(#dg-arrow)" />
          <path className="dg-flow dg-flow--2" d="M260 165 C 400 110, 520 140, 600 175" stroke="#073B4C" strokeWidth="3" fill="none" strokeLinecap="round" markerEnd="url(#dg-arrow)" opacity=".6" />
          <g fill="#6b8d96" opacity=".7">
            <circle cx="330" cy="82" r="4" />
            <circle cx="420" cy="62" r="3" />
            <circle cx="520" cy="66" r="4" />
            <circle cx="610" cy="80" r="3" />
          </g>
        </g>

        {/* deposition: rain cloud + falling particles */}
        <g className="dg dg--deposition">
          <g fill="#F8FCFA">
            <circle cx="690" cy="128" r="26" />
            <circle cx="726" cy="114" r="32" />
            <circle cx="762" cy="132" r="22" />
            <rect x="664" y="128" width="120" height="28" rx="14" />
          </g>
          <g className="dg-rain" stroke="#2B8FB8" strokeWidth="3" strokeLinecap="round">
            <path d="M684 170 l-6 18" />
            <path d="M712 172 l-6 18" />
            <path d="M740 170 l-6 18" />
            <path d="M766 172 l-6 18" />
          </g>
          <g className="dg-fall" fill="#6b8d96">
            <circle cx="540" cy="180" r="4" />
            <circle cx="575" cy="200" r="3" />
            <circle cx="610" cy="170" r="4" />
            <circle cx="560" cy="240" r="3" />
          </g>
        </g>

        {/* air–sea exchange */}
        <g className="dg dg--exchange">
          <path d="M850 222 V282" stroke="#073B4C" strokeWidth="3.5" markerEnd="url(#dg-arrow)" />
          <text x="836" y="214" className="dg-label">
            CO₂
          </text>
          <path d="M915 336 V280" stroke="#F8FCFA" strokeWidth="3.5" markerEnd="url(#dg-arrow)" />
          <text x="902" y="356" className="dg-label dg-label--light">
            O₂
          </text>
        </g>

        {/* runoff: river + sediment plume */}
        <g className="dg dg--runoff">
          <path className="dg-river" d="M20 236 Q120 250 210 238 T322 300" stroke="#18A6A6" strokeWidth="9" fill="none" strokeLinecap="round" />
          <ellipse className="dg-plume" cx="410" cy="345" rx="90" ry="34" fill="#D9B26C" opacity=".55" />
          <ellipse className="dg-plume" cx="470" cy="372" rx="60" ry="22" fill="#D9B26C" opacity=".4" />
        </g>

        {/* marine response: bloom, low-oxygen zone, fish, coral */}
        <g className="dg dg--response">
          <g className="dg-bloom" fill="#70D6CE">
            {Array.from({ length: 18 }, (_, i) => (
              <circle key={i} cx={560 + ((i * 47) % 220)} cy={318 + ((i * 29) % 40)} r={3 + (i % 3)} />
            ))}
          </g>
          <ellipse cx="610" cy="470" rx="90" ry="40" fill="none" stroke="#FF927E" strokeWidth="3" strokeDasharray="6 6" />
          <text x="610" y="476" textAnchor="middle" className="dg-label dg-label--coral">
            Low O₂
          </text>
          <g transform="translate(740 420)">
            <path d="M0 14 C8 0 34 -2 46 12 C34 28 8 28 0 14z" fill="#FF927E" />
            <path d="M2 14 L-12 4 V24z" fill="#E5654F" />
            <circle cx="36" cy="11" r="3" fill="#073B4C" />
          </g>
          <g stroke="#FF927E" strokeWidth="9" strokeLinecap="round" fill="none">
            <path d="M880 548 V500" />
            <path d="M880 520 Q864 512 862 490" />
            <path d="M880 510 Q896 500 898 482" />
          </g>
        </g>

        {/* seabed */}
        <path d="M372 560 Q480 520 640 540 T1000 520 V560Z" fill="#F4D6A0" />
      </svg>

      {PATHWAYS.map((p, i) => {
        const [x, y] = MARKERS[p.key];
        return (
          <button
            key={p.key}
            className={`diagram__marker ${active === p.key ? 'is-active' : ''}`}
            style={{ left: `${x / 10}%`, top: `${(y / 560) * 100}%` }}
            onClick={() => onSelect(p.key)}
            aria-label={`Step ${i + 1}: ${p.title}`}
            aria-pressed={active === p.key}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
