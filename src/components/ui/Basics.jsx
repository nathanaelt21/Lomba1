/* Small reusable presentational pieces. */
import { STATUS_LABEL } from '../../data/parameters.js';
import { formatValue } from '../../utils/format.js';

export function SectionHeading({ eyebrow, title, children, align = 'left', as: Tag = 'h2', className = '' }) {
  return (
    <header className={`section-heading ${align === 'center' ? 'section-heading--center' : ''} ${className}`} data-reveal>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Tag className="title-xl">{title}</Tag>
      {children && <p className="lede">{children}</p>}
    </header>
  );
}

/** Organic animated wave edge. `fill` should match the section it belongs to. */
export function WaveDivider({ position = 'top', fill = 'var(--sea-foam)', flip = false, back }) {
  const d = 'M0 60 C 160 20 320 20 480 50 S 800 90 960 55 S 1280 10 1440 45 L 1500 45 V 120 H -60 Z';
  return (
    <div className={`wave-divider wave-divider--${position}`} aria-hidden="true" style={{ transform: flip ? 'scaleY(-1)' : undefined }}>
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        {back && <path d="M-60 40 C 200 80 420 0 700 40 S 1200 80 1500 30 V 120 H -60 Z" fill={back} />}
        <path d={d} fill={fill} />
      </svg>
    </div>
  );
}

export function StatTile({ label, value, unit, decimals = 1 }) {
  return (
    <div className="stat-tile">
      <span className="stat-tile__label">{label}</span>
      <span className="stat-tile__value">
        {typeof value === 'number' ? formatValue(value, decimals) : value}
        {unit && <small>{unit}</small>}
      </span>
    </div>
  );
}

const STATUS_COLOR = { good: 'var(--status-good)', watch: 'var(--status-watch)', poor: 'var(--status-poor)', none: 'var(--ink-mute)' };

export function StatusTag({ status, label }) {
  return (
    <span className="status-tag">
      <i style={{ background: STATUS_COLOR[status] }} />
      {label || STATUS_LABEL[status]}
    </span>
  );
}
