/**
 * SEAIR data provider — the single entry point the UI uses for data.
 *
 * Every response follows one envelope so real APIs can replace the demo
 * adapter without touching components:
 *
 *   {
 *     isDemo: boolean,        // true → UI shows the DEMO DATA label
 *     source: { id, name },   // origin of the values
 *     retrievedAt: number,    // when SEAIR fetched/generated the data (ms)
 *     location: { id, name, area, lat, lng },
 *     parameter: { key, name, unit },
 *     period, resolution, range: { start, end },
 *     points: [{ t: ms, v: number }]
 *   }
 *
 * To connect real data, implement `apiAdapter` (BMKG, KLH, ISPU Jakarta,
 * Unpad PODC) and set VITE_DATA_MODE=api. Until then the demo adapter is
 * used and every value is labelled DEMO DATA in the interface.
 */
import { demoSeries, demoValueAt, PERIODS } from '../data/mock/demoGenerator.js';
import { getParameter, parametersFor } from '../data/parameters.js';
import { getStation, stationsFor, STATIONS } from '../data/stations.js';
import { now } from '../utils/clock.js';

const MODE = import.meta.env.VITE_DATA_MODE || 'demo';

const DEMO_SOURCE = { id: 'demo', name: 'Generator demo SEAIR (bukan hasil pengukuran)' };

const locationOf = (s) => ({ id: s.id, name: s.name, area: s.area, lat: s.lat, lng: s.lng });
const paramOf = (p) => ({ key: p.key, name: p.name, unit: p.unit, decimals: p.decimals });

const demoAdapter = {
  async series({ stationId, parameter, period = '30d', end = now() }) {
    const station = getStation(stationId);
    const param = getParameter(parameter);
    if (!station || !param) throw new Error(`Unknown station/parameter: ${stationId}/${parameter}`);
    const { points, start, end: e, resolution } = demoSeries(stationId, parameter, period, end);
    return {
      isDemo: true,
      source: DEMO_SOURCE,
      retrievedAt: now(),
      location: locationOf(station),
      parameter: paramOf(param),
      period,
      resolution,
      range: { start, end: e },
      points,
    };
  },

  async latest(stationId, at = now()) {
    const station = getStation(stationId);
    if (!station) throw new Error(`Unknown station: ${stationId}`);
    const t = Math.floor(at / 3600e3) * 3600e3;
    const values = {};
    parametersFor(station.domain).forEach((p) => {
      values[p.key] = { value: demoValueAt(stationId, p.key, t, true), unit: p.unit, t };
    });
    return { isDemo: true, source: DEMO_SOURCE, retrievedAt: now(), location: locationOf(station), station, values, t };
  },
};

const apiAdapter = {
  async series() {
    throw new Error('Adapter API langsung belum tersedia. Gunakan VITE_DATA_MODE=demo.');
  },
  async latest() {
    throw new Error('Adapter API langsung belum tersedia. Gunakan VITE_DATA_MODE=demo.');
  },
};

const adapter = MODE === 'api' ? apiAdapter : demoAdapter;

export const dataMode = MODE;
export const periods = PERIODS;

export const getSeries = (opts) => adapter.series(opts);
export const getLatest = (stationId, at) => adapter.latest(stationId, at);
export const getLatestAll = (domain, at) =>
  Promise.all((domain ? stationsFor(domain) : STATIONS).map((s) => adapter.latest(s.id, at)));
export const getStations = async (domain) => (domain ? stationsFor(domain) : STATIONS);
