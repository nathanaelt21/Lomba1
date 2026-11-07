import { getLatest } from '../../services/dataProvider.js';
import { useAsync } from '../../hooks/useAsync.js';
import { ispuCategory } from '../../utils/ispu.js';
import { getParameter, assessValue } from '../../data/parameters.js';
import { formatValue, formatDateTime } from '../../utils/format.js';
import DemoBadge from './DemoBadge.jsx';

/** Small environmental status indicator used in the hero. */
export default function StatusPill({ airStation = 'priok-air', seaStation = 'ancol-sea' }) {
  const { data } = useAsync(() => Promise.all([getLatest(airStation), getLatest(seaStation)]), [airStation, seaStation]);
  if (!data) return <div className="status-pill status-pill--loading" aria-hidden="true" />;
  const [air, sea] = data;
  const ispu = air.values.ispu.value;
  const cat = ispuCategory(ispu);
  const doParam = getParameter('do');
  const doVal = sea.values.do.value;
  const doStatus = assessValue(doParam, doVal);
  return (
    <div className="status-pill" role="group" aria-label="Status lingkungan, data demo">
      <span className="status-pill__place">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 15s5-5.2 5-9A5 5 0 0 0 3 6c0 3.8 5 9 5 9z" fill="currentColor" />
          <circle cx="8" cy="6" r="1.8" fill="#fff" />
        </svg>
        Teluk Jakarta
      </span>
      <span className="status-pill__item">
        <i style={{ background: cat.color }} />
        Udara · ISPU {ispu} <b>{cat.id}</b>
      </span>
      <span className="status-pill__item">
        <i className={`dot-${doStatus}`} />
        Laut · Oksigen {formatValue(doVal, 1)} mg/L
      </span>
      <span className="status-pill__time">{formatDateTime(air.t)}</span>
      <DemoBadge compact />
    </div>
  );
}
