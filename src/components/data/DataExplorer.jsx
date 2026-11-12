import { useEffect, useMemo, useState } from 'react';
import TimeSeriesChart from '../charts/TimeSeriesChart.jsx';
import { SERIES_COLORS } from '../charts/chartSetup.js';
import DemoBadge from '../ui/DemoBadge.jsx';
import Icon from '../ui/Icon.jsx';
import { StatTile, StatusTag } from '../ui/Basics.jsx';
import PlainReading from './PlainReading.jsx';
import { getSeries, periods } from '../../services/dataProvider.js';
import { useAsync } from '../../hooks/useAsync.js';
import { parametersFor, getParameter, assessValue, describeTrend } from '../../data/parameters.js';
import { stationsFor, getStation } from '../../data/stations.js';
import { summarize } from '../../utils/stats.js';
import { formatDate, formatDateTime, formatSigned, toISODate } from '../../utils/format.js';
import { downloadSeriesCsv } from '../../utils/csv.js';
import { now } from '../../utils/clock.js';
import './DataExplorer.css';

const DEFAULT_STATION = { air: 'priok-air', ocean: 'ancol-sea' };
const DEFAULT_PARAM = { air: 'pm25', ocean: 'do' };

/**
 * Interactive data explorer: domain, location, parameter, period, end date
 * and an optional comparison location. Every value comes from the data
 * provider, so it is labelled DEMO until real APIs are connected.
 */
export default function DataExplorer({ fixedDomain, initialStation, initialParam, tone = 'light' }) {
  const [domain, setDomain] = useState(fixedDomain || 'air');
  const [stationId, setStationId] = useState(initialStation || DEFAULT_STATION[fixedDomain || 'air']);
  const [param, setParam] = useState(initialParam || DEFAULT_PARAM[fixedDomain || 'air']);
  const [period, setPeriod] = useState('30d');
  const [endDate, setEndDate] = useState(() => toISODate(now()));
  const [compareId, setCompareId] = useState('');

  // Reset dependent selections when the domain changes.
  useEffect(() => {
    if (getStation(stationId)?.domain !== domain) setStationId(DEFAULT_STATION[domain]);
    if (getParameter(param)?.domain !== domain) setParam(DEFAULT_PARAM[domain]);
    setCompareId('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain]);

  // The comparison list hides the main station, so choosing the compared
  // station as the main one used to leave an empty, invisible selection.
  useEffect(() => {
    if (compareId && compareId === stationId) setCompareId('');
  }, [stationId, compareId]);

  const stations = stationsFor(domain);
  const params = parametersFor(domain);
  const paramMeta = getParameter(param);
  const station = getStation(stationId);
  const valid = station?.domain === domain && paramMeta?.domain === domain;
  const today = toISODate(now());
  const end = useMemo(() => {
    const d = new Date(`${endDate}T23:00:00+07:00`).getTime();
    return Number.isFinite(d) ? Math.min(d, now()) : now();
  }, [endDate]);

  const { data, loading, error } = useAsync(async () => {
    if (!valid) return null;
    const main = await getSeries({ stationId, parameter: param, period, end });
    const cmp = compareId && compareId !== stationId ? await getSeries({ stationId: compareId, parameter: param, period, end }) : null;
    return { main, cmp };
  }, [stationId, param, period, end, compareId, valid]);

  const stats = data?.main ? summarize(data.main.points.map((p) => p.v)) : null;
  const status = stats ? assessValue(paramMeta, stats.latest) : 'none';
  const trend = stats ? describeTrend(paramMeta, stats.change) : null;
  const color = domain === 'air' ? SERIES_COLORS.air : SERIES_COLORS.ocean;
  const series = data?.main
    ? [
        { label: data.main.location.name, points: data.main.points, color },
        ...(data.cmp ? [{ label: data.cmp.location.name, points: data.cmp.points, color: SERIES_COLORS.compare, dashed: true }] : []),
      ]
    : [];
  const dec = paramMeta?.decimals ?? 1;
  const unit = paramMeta?.unit === 'indeks' ? '' : paramMeta?.unit;

  return (
    <div className={`explorer explorer--${tone}`}>
      <div className="explorer__controls">
        {!fixedDomain && (
          <div className="segmented" role="group" aria-label="Kategori data">
            <button aria-pressed={domain === 'air'} onClick={() => setDomain('air')}>
              <Icon name="wind" size={18} /> Udara
            </button>
            <button aria-pressed={domain === 'ocean'} onClick={() => setDomain('ocean')}>
              <Icon name="wave" size={18} /> Laut
            </button>
          </div>
        )}
        <label className="field">
          Lokasi
          <select value={stationId} onChange={(e) => setStationId(e.target.value)}>
            {stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Bandingkan dengan
          <select value={compareId} onChange={(e) => setCompareId(e.target.value)}>
            <option value="">Tanpa pembanding</option>
            {stations
              .filter((s) => s.id !== stationId)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </select>
        </label>
        <label className="field">
          Sampai tanggal
          <input
            type="date"
            value={endDate}
            max={today}
            min={toISODate(now() - 730 * 864e5)}
            onChange={(e) => e.target.value && setEndDate(e.target.value)}
          />
        </label>
        <div className="field">
          Rentang waktu
          <div className="chip-row" role="group" aria-label="Rentang waktu">
            {Object.entries(periods).map(([k, p]) => (
              <button key={k} className="chip" aria-pressed={period === k} onClick={() => setPeriod(k)}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="explorer__params chip-row" role="group" aria-label="Parameter">
        {params.map((p) => (
          <button key={p.key} className="chip" aria-pressed={param === p.key} onClick={() => setParam(p.key)} title={p.simple}>
            {p.short || p.name}
          </button>
        ))}
      </div>

      <div className="explorer__panel">
        <div className="explorer__head">
          <div>
            <h3>
              {paramMeta?.name} <span>di {station?.name}</span>
            </h3>
            <p className="small muted">{paramMeta?.what}</p>
          </div>
          <div className="explorer__badges">
            <StatusTag status={status} />
            <DemoBadge />
          </div>
        </div>

        {stats && (
          <div className="explorer__stats" key={`${stationId}-${param}-${period}`}>
            <StatTile label="Terbaru" value={stats.latest} unit={unit} decimals={dec} />
            <StatTile label="Rata-rata" value={stats.mean} unit={unit} decimals={dec} />
            <StatTile label="Terendah" value={stats.min} unit={unit} decimals={dec} />
            <StatTile label="Tertinggi" value={stats.max} unit={unit} decimals={dec} />
            <StatTile label="Perubahan" value={`${formatSigned(stats.change, 0)}%`} />
          </div>
        )}

        {stats && (
          <PlainReading
            param={paramMeta}
            value={stats.latest}
            extra={trend && `Selama ${periods[period].label} terakhir, nilainya ${trend.text}.`}
          />
        )}

        <div className={`explorer__chart ${loading ? 'is-loading' : ''}`} aria-busy={loading}>
          {error && <p className="explorer__error">Data gagal dimuat: {error.message}</p>}
          {series.length > 0 && (
            <TimeSeriesChart
              series={series}
              unit={unit}
              decimals={dec}
              period={period}
              reference={paramMeta.reference}
              ariaLabel={`${paramMeta.name} di ${station?.name}, ${periods[period].label}, data demo`}
            />
          )}
        </div>

        <p className="explorer__howto tiny muted">
          <Icon name="info" size={14} /> Arahkan kursor (atau sentuh) grafik untuk melihat nilai tiap titik.
          {paramMeta?.reference?.type === 'range'
            ? ' Pita berwarna menunjukkan rentang normal.'
            : paramMeta?.reference?.type === 'note'
              ? ''
              : ' Garis putus-putus merah adalah batas acuan.'}
        </p>

        {data?.main && (
          <div className="explorer__foot">
            <div className="data-meta">
              <span>
                <b>Sumber:</b> {data.main.source.name}
              </span>
              <span>
                <b>Lokasi:</b> {data.main.location.name}, {data.main.location.area} ({data.main.location.lat.toFixed(3)},{' '}
                {data.main.location.lng.toFixed(3)}, perkiraan)
              </span>
              <span>
                <b>Rentang:</b> {formatDate(data.main.range.start)} – {formatDate(data.main.range.end)} · {data.main.resolution}
              </span>
              <span>
                <b>Satuan:</b> {paramMeta.unit}
              </span>
              <span>
                <b>Dibuat:</b> {formatDateTime(data.main.retrievedAt)}
              </span>
              {paramMeta.reference?.citation !== '—' && (
                <span>
                  <b>Acuan:</b> {paramMeta.reference.label} ({paramMeta.reference.citation})
                </span>
              )}
            </div>
            <button
              type="button"
              className="btn btn--sm btn--light explorer__download"
              onClick={() => downloadSeriesCsv(data.main, data.cmp, paramMeta)}
            >
              <Icon name="download" size={16} /> Unduh data (CSV)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
