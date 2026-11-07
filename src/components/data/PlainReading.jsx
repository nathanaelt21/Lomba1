import Icon from '../ui/Icon.jsx';
import { explainValue } from '../../data/parameters.js';
import { ispuCategory } from '../../utils/ispu.js';

/**
 * "Apa artinya?" box: turns a number into a plain-language sentence so
 * visitors don't need to know the thresholds to understand a reading.
 */
export default function PlainReading({ param, value, extra, compact = false }) {
  const info = explainValue(param, value);
  if (!info) return null;
  const ispu = param.key === 'ispu' ? ispuCategory(value) : null;
  return (
    <div className={`plain-reading plain-reading--${info.tone} ${compact ? 'plain-reading--compact' : ''}`} role="note">
      <span className="plain-reading__icon" aria-hidden="true">
        <Icon name={info.tone === 'good' ? 'check' : info.tone === 'none' ? 'info' : 'alert'} size={18} strokeWidth={2.6} />
      </span>
      <div>
        <p className="plain-reading__title">
          <b>Apa artinya?</b> {ispu ? `Kategori "${ispu.id}"` : info.headline}
        </p>
        <p className="plain-reading__text">
          {ispu ? ispu.advice : info.text}
          {extra && ` ${extra}`}
        </p>
      </div>
    </div>
  );
}
