/* Rounded line icons drawn for SEAIR (24×24, stroke = currentColor). */
const PATHS = {
  gauge: (
    <>
      <path d="M4 16a8 8 0 1 1 16 0" />
      <path d="M12 16l4-5" />
      <circle cx="12" cy="16" r="1.6" fill="currentColor" />
    </>
  ),
  dust: (
    <>
      <circle cx="6" cy="8" r="1.6" />
      <circle cx="13" cy="6" r="2.4" />
      <circle cx="18" cy="12" r="1.4" />
      <circle cx="9" cy="14" r="2" />
      <circle cx="15" cy="18" r="1.8" />
      <circle cx="5" cy="19" r="1" />
    </>
  ),
  factory: (
    <>
      <path d="M3 20V11l5 3v-3l5 3v-3l5 3V5h3v15z" />
      <path d="M18 3c1-1 2.5-1 3 0" />
    </>
  ),
  car: (
    <>
      <path d="M4 15l1.6-5A2 2 0 0 1 7.5 8.6h9a2 2 0 0 1 1.9 1.4L20 15" />
      <rect x="3" y="15" width="18" height="4" rx="2" />
      <circle cx="7.5" cy="19.5" r="1" />
      <circle cx="16.5" cy="19.5" r="1" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </>
  ),
  drop: <path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z" />,
  bubble: (
    <>
      <circle cx="9" cy="14" r="5" />
      <circle cx="17" cy="7" r="3" />
      <path d="M7 12.5a2 2 0 0 1 2-1.5" />
    </>
  ),
  murk: (
    <>
      <path d="M3 8c3-2 6 2 9 0s6-2 9 0" />
      <circle cx="7" cy="14" r="1.2" fill="currentColor" />
      <circle cx="12" cy="17" r="1.6" fill="currentColor" />
      <circle cx="17" cy="13" r="1.2" fill="currentColor" />
      <circle cx="9" cy="20" r="1" fill="currentColor" />
    </>
  ),
  salt: (
    <>
      <rect x="5" y="9" width="6" height="6" rx="1" transform="rotate(-12 8 12)" />
      <rect x="13" y="12" width="6" height="6" rx="1" transform="rotate(14 16 15)" />
      <rect x="10" y="3" width="4.5" height="4.5" rx="1" />
    </>
  ),
  plankton: (
    <>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 4v4.5M12 15.5V20M4 12h4.5M15.5 12H20M6.5 6.5l3 3M14.5 14.5l3 3M6.5 17.5l3-3M14.5 9.5l3-3" />
    </>
  ),
  thermo: (
    <>
      <path d="M10 13.5V5a2 2 0 0 1 4 0v8.5a4 4 0 1 1-4 0z" />
      <path d="M12 9v7" />
    </>
  ),
  wind: (
    <>
      <path d="M3 9h11a3 3 0 1 0-3-3" />
      <path d="M3 14h15a3 3 0 1 1-3 3" />
    </>
  ),
  wave: (
    <>
      <path d="M2 10c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 3.5-2 5-1" />
      <path d="M2 16c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 3.5-2 5-1" />
    </>
  ),
  rain: (
    <>
      <path d="M7 14a4 4 0 0 1 .5-8 5 5 0 0 1 9.6 1.5A3.3 3.3 0 0 1 17 14z" />
      <path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3" />
    </>
  ),
  river: <path d="M6 3c4 4-4 7 0 11s-2 5 2 7M14 3c4 4-4 7 0 11s-2 5 2 7" />,
  fish: (
    <>
      <path d="M3 12c3-5 10-6 15 0-5 6-12 5-15 0z" />
      <path d="M18 12l3-3v6z" />
      <circle cx="8" cy="11" r="1" fill="currentColor" />
    </>
  ),
  heart: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />,
  leaf: (
    <>
      <path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15" />
      <path d="M5 19l7-7" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
  recycle: (
    <>
      <path d="M7 10l-3 5 3 4h4" />
      <path d="M17 10l3 5-3 4h-4" />
      <path d="M9 7l3-4 3 4" />
      <path d="M11 19l2-2-2-2" />
    </>
  ),
  people: (
    <>
      <circle cx="8" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M3 19c0-3.3 2.2-5.5 5-5.5s5 2.2 5 5.5M14 19c0-2.5 1.3-4.3 3-4.3s3 1.8 3 4.3" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  download: <path d="M12 4v11m-5-5 5 5 5-5M5 20h14" />,
  alert: (
    <>
      <path d="M12 3.5 2.5 20h19z" />
      <path d="M12 10v4.5M12 17.5v.3" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
      <path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  play: <path d="M8 5v14l11-7z" />,
  pause: <path d="M8 5v14M16 5v14" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.5" />
    </>
  ),
};

export default function Icon({ name, size = 24, className = '', strokeWidth = 2 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`icon ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name] || PATHS.info}
    </svg>
  );
}
