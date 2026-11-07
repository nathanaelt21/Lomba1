import { ISPU_CATEGORIES, ispuCategory } from '../../utils/ispu.js';

/** The five ISPU bands with an optional marker for a current value. */
export default function IspuScale({ value, showAdvice = false }) {
  const current = value != null ? ispuCategory(value) : null;
  const pos = value != null ? Math.max(0, Math.min(100, (value / 500) * 100)) : null;
  return (
    <div className="ispu-scale">
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
      <ol className="ispu-scale__legend">
        {ISPU_CATEGORIES.map((c) => (
          <li key={c.key} className={current?.key === c.key ? 'is-current' : ''}>
            <i style={{ background: c.color }} />
            <span>
              <b>{c.id}</b> {c.max === 500 ? `${c.min}+` : `${c.min}–${c.max}`}
              {showAdvice && <small>{c.advice}</small>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
