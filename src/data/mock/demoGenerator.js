/**
 * SEAIR DEMO data generator.
 *
 * Produces deterministic, plausible-looking series so the interface can be
 * designed and tested before real APIs are connected. These values are NOT
 * measurements, and every object it returns carries `isDemo: true`.
 *
 * Shape of the signal: station pressure × seasonal monsoon cycle × weekly
 * cycle × daily cycle × smooth noise. Jakarta's wet season peaks around
 * January/February and the dry season around July/August.
 */
import { getParameter } from '../parameters.js';
import { getStation } from '../stations.js';
import { hashString, smoothNoise, clamp } from '../../utils/random.js';
import { illustrativeISPU } from '../../utils/ispu.js';
import { wetness } from '../../utils/season.js';

const HOUR = 3600e3;
const DAY = 24 * HOUR;

export const PERIODS = {
  '7d': { label: '7 hari', days: 7, step: 3 * HOUR, resolution: 'per 3 jam' },
  '30d': { label: '30 hari', days: 30, step: DAY, resolution: 'rata-rata harian' },
  '1y': { label: '1 tahun', days: 364, step: 7 * DAY, resolution: 'rata-rata mingguan' },
};

export { wetness };

const gauss = (x, mu, s) => Math.exp(-((x - mu) ** 2) / (2 * s * s));

function diurnal(key, t) {
  const h = (new Date(t).getUTCHours() + 7) % 24; // WIB
  switch (key) {
    case 'co':
    case 'no2':
      return 0.85 + 0.35 * (gauss(h, 7.5, 1.8) + gauss(h, 18.5, 2.4));
    case 'o3':
      return 0.45 + 1.1 * gauss(h, 13, 2.8);
    case 'pm25':
    case 'pm10':
      return 1 + 0.16 * Math.cos((2 * Math.PI * (h - 3)) / 24);
    case 'temp':
      return 1 + 0.012 * Math.cos((2 * Math.PI * (h - 14)) / 24);
    case 'do':
      return 1 + 0.12 * Math.cos((2 * Math.PI * (h - 15)) / 24);
    default:
      return 1;
  }
}

function weekly(param, t) {
  const amp = param.demo.weekly || 0;
  const day = new Date(t + 7 * HOUR).getUTCDay(); // WIB weekday
  if (day === 0) return 1 - amp;
  if (day === 6) return 1 - amp / 2;
  return 1 + amp * 0.25;
}

/** Instantaneous demo value. `withCycle` adds the daily cycle (used for 3-hourly data). */
export function demoValueAt(stationId, key, t, withCycle = false) {
  const station = getStation(stationId);
  if (key === 'ispu') {
    return illustrativeISPU(demoValueAt(stationId, 'pm25', t, withCycle), demoValueAt(stationId, 'pm10', t, withCycle));
  }
  const param = getParameter(key);
  const d = param.demo;
  const seed = hashString(`${stationId}:${key}`);
  const days = t / DAY;
  const n = smoothNoise(seed, days / 2.5) * 0.7 + smoothNoise(seed + 7, days * 2) * 0.3;
  const wet = wetness(t);
  const p = station.pressure;
  const cyc = withCycle ? diurnal(key, t) : 1;
  let v;
  if (param.domain === 'air') {
    v = d.base * (0.45 + p * 0.85) * (1 + d.season * wet) * weekly(param, t) * cyc * (1 + d.noise * n);
  } else if (d.absolute) {
    v = (d.base + d.spread * p * p) * (1 + d.season * wet) * cyc + d.base * d.noise * n * 3;
  } else {
    v = (d.base + d.spread * p * p) * (1 + d.season * wet) * cyc * (1 + d.noise * n);
  }
  return clamp(v, d.min, d.max);
}

/** Series of { t, v } points for a period ending at `end`. */
export function demoSeries(stationId, key, period = '30d', end = Date.now()) {
  const cfg = PERIODS[period] || PERIODS['30d'];
  const endT = period === '7d' ? Math.floor(end / cfg.step) * cfg.step : Math.floor(end / DAY) * DAY;
  const startT = endT - cfg.days * DAY;
  const pts = [];
  for (let t = startT + cfg.step; t <= endT + 1; t += cfg.step) {
    let v;
    if (period === '1y') {
      // Weekly mean of daily values.
      let s = 0;
      for (let k = 0; k < 7; k++) s += demoValueAt(stationId, key, t - k * DAY);
      v = s / 7;
    } else {
      v = demoValueAt(stationId, key, t, period === '7d');
    }
    pts.push({ t, v });
  }
  return { points: pts, start: startT, end: endT, resolution: cfg.resolution };
}
