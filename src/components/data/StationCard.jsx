import Icon from '../ui/Icon.jsx';
import { getParameter } from '../../data/parameters.js';
import { stationStatus } from '../../utils/status.js';
import { formatValue } from '../../utils/format.js';

/** Compact station summary. `keys` = parameters to show. */
export default function StationCard({ latest, keys, onSelect, active }) {
  const { station, values } = latest;
  const st = stationStatus(latest);
  return (
    <button className={`station-card ${active ? 'is-active' : ''}`} style={{ '--st': st.color }} onClick={onSelect} aria-pressed={!!active}>
      <span className="station-card__top">
        <Icon name="pin" size={16} />
        <span className="station-card__kind">{station.kind}</span>
      </span>
      <b className="station-card__name">{station.name}</b>
      <span className="station-card__area">{station.area}</span>
      <span className="station-card__status">
        <i /> {st.label}
      </span>
      <span className="station-card__vals">
        {keys.map((k) => {
          const p = getParameter(k);
          return (
            <span key={k}>
              <small>{p.short || p.name}</small>
              {formatValue(values[k].value, p.decimals)} <em>{p.unit}</em>
            </span>
          );
        })}
      </span>
    </button>
  );
}
