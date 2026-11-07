import Icon from '../ui/Icon.jsx';
import { assessValue, STATUS_LABEL, referenceText } from '../../data/parameters.js';
import { formatValue } from '../../utils/format.js';

/**
 * Parameter card with a mini gauge: the bar shows the value relative to the
 * reference (dashed tick). Details open on hover/focus or by tapping.
 */
export default function ParamCard({ param, value, tone = 'air', revealDelay = 0 }) {
  const ref = param.reference;
  const scaleMax = ref.type === 'max' ? ref.value * 1.6 : ref.type === 'min' ? ref.value * 2 : ref.type === 'range' ? ref.max * 1.25 : value * 1.6 || 1;
  const pct = Math.max(3, Math.min(100, (value / scaleMax) * 100));
  const refPct = ref.type === 'max' || ref.type === 'min' ? (ref.value / scaleMax) * 100 : null;
  const status = assessValue(param, value);
  return (
    <article className={`param-card param-card--${tone}`} tabIndex={0} data-reveal data-reveal-delay={revealDelay}>
      <div className="param-card__top">
        <span className="icon-bubble">
          <Icon name={param.icon} />
        </span>
        <div>
          <h3>{param.name}</h3>
          <p className="param-card__full">{param.full}</p>
        </div>
      </div>
      {value != null && (
        <div className="param-card__reading" title={`${formatValue(value, param.decimals)} ${param.unit} — ${STATUS_LABEL[status]}`}>
          <span className="param-card__value">
            {formatValue(value, param.decimals)} <small>{param.unit}</small>
          </span>
          <div className="mini-gauge" aria-hidden="true">
            <span className={`mini-gauge__fill mini-gauge__fill--${status}`} style={{ width: `${pct}%` }} />
            {refPct != null && <span className="mini-gauge__ref" style={{ left: `${Math.min(98, refPct)}%` }} />}
          </div>
          <span className={`param-card__status param-card__status--${status}`}>{STATUS_LABEL[status]}</span>
        </div>
      )}
      <p className="param-card__simple">{param.simple}</p>
      <p className="param-card__what">{param.what}</p>
      <div className="param-card__more">
        <p>
          <b>Berasal dari:</b> {param.source}
        </p>
        <p>
          <b>Mengapa penting:</b> {param.why}
        </p>
        {ref.citation !== '—' && (
          <p className="tiny muted">
            Acuan: {ref.label} {referenceText(param)} · {ref.citation}
          </p>
        )}
      </div>
    </article>
  );
}
