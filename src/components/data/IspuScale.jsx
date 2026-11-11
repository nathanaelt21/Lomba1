import { ISPU_CATEGORIES, ispuCategory } from '../../utils/ispu.js';

/** The five ISPU bands with an optional marker for a current value. */
export default function IspuScale({ value, showAdvice = false }) {
  const current = value != null ? ispuCategory(value) : null;
  const pos = value != null ? Math.max(0, Math.min(100, (value / 500) * 100)) : null;
  return (
    <div className={`ispu-scale ${pos != null ? 'ispu-scale--marked' : ''} ${showAdvice ? 'ispu-scale--advice' : ''}`}>
      <div className="ispu-scale__bar">
        {ISPU_CATEGORIES.map((c) => (
          <span key={c.key} style={{ background: c.color, flex: c.max - c.min + 1 }} title={`${c.id} (${c.min}–${c.max})`} />
        ))}
        {pos != null && (
          <span className="ispu-scale__marker" style={{ left: `${pos}%` }}>
            <b>{value}</b>
          </span>
        )}
      </div>
      <div className="ispu-scale__ticks" aria-hidden="true">
        <span>0</span>
        <span>500</span>
      </div>
      <ol className="ispu-scale__legend">
        {ISPU_CATEGORIES.map((c) => (
          <li key={c.key} className={current?.key === c.key ? 'is-current' : ''}>
            <i style={{ background: c.color }} />
            <span className="ispu-scale__name">
              <b>{c.id}</b>
              {showAdvice && <small>{c.advice}</small>}
            </span>
            <span className="ispu-scale__range">{c.max === 500 ? `${c.min}+` : `${c.min}–${c.max}`}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
