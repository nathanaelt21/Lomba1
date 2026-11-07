import { parametersFor, assessValue } from '../data/parameters.js';
import { ispuCategory } from './ispu.js';

const STATUS_RANK = { none: 0, good: 1, watch: 2, poor: 3 };
export const STATUS_HEX = { good: '#2fae8f', watch: '#f2b84b', poor: '#e5654f', none: '#6b8d96' };

/** Overall status of a station from its latest values (provider envelope). */
export function stationStatus(latest) {
  const { station, values } = latest;
  if (station.domain === 'air') {
    const v = values.ispu.value;
    const cat = ispuCategory(v);
    return {
      status: cat.key === 'good' ? 'good' : cat.key === 'moderate' ? 'watch' : 'poor',
      label: `ISPU ${v} · ${cat.id}`,
      color: cat.hex,
    };
  }
  let worst = 'none';
  parametersFor('ocean').forEach((p) => {
    const s = assessValue(p, values[p.key].value);
    if (STATUS_RANK[s] > STATUS_RANK[worst]) worst = s;
  });
  const label =
    worst === 'poor'
      ? 'Ada parameter yang melewati acuan'
      : worst === 'watch'
        ? 'Ada parameter yang mendekati batas'
        : worst === 'good'
          ? 'Semua dalam rentang acuan'
          : 'Belum ada penilaian';
  return { status: worst, label, color: STATUS_HEX[worst] };
}
