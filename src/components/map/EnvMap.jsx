import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getLatestAll } from '../../services/dataProvider.js';
import { useAsync } from '../../hooks/useAsync.js';
import { STATIONS, MAP_VIEWS } from '../../data/stations.js';
import { parametersFor, assessValue, getParameter, STATUS_LABEL } from '../../data/parameters.js';
import PlainReading from '../data/PlainReading.jsx';
import { stationStatus } from '../../utils/status.js';
import { formatValue, formatDateTime } from '../../utils/format.js';
import DemoBadge from '../ui/DemoBadge.jsx';
import Icon from '../ui/Icon.jsx';
import { StatusTag } from '../ui/Basics.jsx';
import './EnvMap.css';

const LAYERS = [
  { key: 'air', label: 'Udara', icon: 'wind' },
  { key: 'ocean', label: 'Laut', icon: 'wave' },
  { key: 'combined', label: 'Gabungan', icon: 'pin' },
];

function markerIcon(station, color, selected) {
  const glyph =
    station.domain === 'air'
      ? '<path d="M3 9h11a3 3 0 1 0-3-3M3 14h15a3 3 0 1 1-3 3" />'
      : '<path d="M2 10c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 3.5-2 5-1M2 16c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 3.5-2 5-1" />';
  return L.divIcon({
    className: '',
    iconSize: [44, 52],
    iconAnchor: [22, 50],
    html: `<span class="mk mk--${station.domain} ${selected ? 'is-selected' : ''}" style="--mk:${color}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">${glyph}</svg>
    </span>`,
  });
}

function ViewController({ view }) {
  const map = useMap();
  useEffect(() => {
    const v = MAP_VIEWS[view];
    map.flyTo(v.center, v.zoom, { duration: 1.2 });
  }, [view, map]);
  return null;
}

function FocusController({ station }) {
  const map = useMap();
  useEffect(() => {
    if (station) map.flyTo([station.lat, station.lng], Math.max(map.getZoom(), 11), { duration: 0.8 });
  }, [station, map]);
  return null;
}

export default function EnvMap({ height = 560, initialLayer = 'combined', fullPage = false, initialSelected = null }) {
  const [layer, setLayer] = useState(initialLayer);
  const [view, setView] = useState('bay');
  const [selectedId, setSelectedId] = useState(initialSelected);
  const { data: latest } = useAsync(() => getLatestAll(), []);

  const byId = useMemo(() => Object.fromEntries((latest || []).map((l) => [l.station.id, l])), [latest]);
  const visible = STATIONS.filter((s) => layer === 'combined' || s.domain === layer);
  const selected = selectedId ? byId[selectedId] : null;

  useEffect(() => {
    if (selected && layer !== 'combined' && selected.station.domain !== layer) setSelectedId(null);
  }, [layer, selected]);

  return (
    <div className={`envmap ${fullPage ? 'envmap--full' : ''}`} style={{ '--map-h': `${height}px` }}>
      <div className="envmap__map">
        <MapContainer
          center={MAP_VIEWS.bay.center}
          zoom={MAP_VIEWS.bay.zoom}
          scrollWheelZoom={fullPage}
          className="envmap__leaflet"
          attributionControl
        >
          {/* OSM's public tiles are fine for a prototype; use a dedicated tile provider in production. */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={18}
          />
          <ViewController view={view} />
          <FocusController station={selected?.station} />
          {visible.map((s) => {
            const l = byId[s.id];
            const st = l ? stationStatus(l) : { color: '#6b8d96', label: '' };
            return (
              <Marker
                key={s.id}
                position={[s.lat, s.lng]}
                icon={markerIcon(s, st.color, s.id === selectedId)}
                eventHandlers={{ click: () => setSelectedId(s.id) }}
                keyboard
                title={`${s.name} (${s.domain === 'air' ? 'udara' : 'laut'})`}
              >
                <Tooltip direction="top" offset={[0, -46]} className="mk-tip">
                  <strong>{s.name}</strong>
                  <span>{st.label}</span>
                </Tooltip>
              </Marker>
            );
          })}
        </MapContainer>

        <div className="envmap__toolbar">
          <div className="segmented" role="group" aria-label="Lapisan peta">
            {LAYERS.map((l) => (
              <button key={l.key} aria-pressed={layer === l.key} onClick={() => setLayer(l.key)}>
                <Icon name={l.icon} size={16} />
                {l.label}
              </button>
            ))}
          </div>
          <div className="segmented envmap__views" role="group" aria-label="Tampilan peta">
            {Object.entries(MAP_VIEWS).map(([k, v]) => (
              <button key={k} aria-pressed={view === k} onClick={() => setView(k)}>
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <aside className="envmap__panel" aria-live="polite">
        {selected ? (
          <StationDetail latest={selected} onClose={() => setSelectedId(null)} />
        ) : (
          <MapLegend layer={layer} stations={visible} byId={byId} onPick={setSelectedId} />
        )}
      </aside>
    </div>
  );
}

function StationDetail({ latest, onClose }) {
  const { station, values, t } = latest;
  const st = stationStatus(latest);
  const params = parametersFor(station.domain);
  const headline = station.domain === 'air' ? getParameter('ispu') : worstParam(params, values);
  return (
    <div className="station-detail">
      <div className="station-detail__top">
        <span className={`station-detail__type station-detail__type--${station.domain}`}>
          <Icon name={station.domain === 'air' ? 'wind' : 'wave'} size={16} />
          {station.domain === 'air' ? 'Kualitas udara' : 'Kualitas air laut'}
        </span>
        <button className="station-detail__close" onClick={onClose} aria-label="Tutup detail lokasi">
          ×
        </button>
      </div>
      <h3>{station.name}</h3>
      <p className="small muted">
        {station.area} · {station.kind}
        <br />
        {station.lat.toFixed(3)}, {station.lng.toFixed(3)} (perkiraan)
      </p>
      <div className="station-detail__status" style={{ '--st': st.color }}>
        <i />
        <span>{st.label}</span>
      </div>
      {headline && <PlainReading param={headline} value={values[headline.key].value} compact />}
      <ul className="station-detail__params">
        {params.map((p) => {
          const v = values[p.key].value;
          return (
            <li key={p.key}>
              <span>{p.short || p.name}</span>
              <b>
                {formatValue(v, p.decimals)} <small>{p.unit}</small>
              </b>
              <span title={STATUS_LABEL[assessValue(p, v)]}>
                <StatusTag status={assessValue(p, v)} label=" " />
              </span>
            </li>
          );
        })}
      </ul>
      <div className="data-meta">
        <span>
          <b>Waktu:</b> {formatDateTime(t)}
        </span>
        <span>
          <b>Catatan:</b> {station.reference}
        </span>
      </div>
      <DemoBadge />
    </div>
  );
}

function MapLegend({ layer, stations, byId, onPick }) {
  return (
    <div className="map-legend">
      <h3>{layer === 'air' ? 'Stasiun kualitas udara' : layer === 'ocean' ? 'Titik sampel air laut' : 'Udara + Laut'}</h3>
      <p className="small muted">Pilih penanda di peta atau salah satu lokasi di bawah untuk melihat hasil ukurnya.</p>
      <ul className="map-legend__list">
        {stations.map((s) => {
          const l = byId[s.id];
          const st = l ? stationStatus(l) : null;
          return (
            <li key={s.id}>
              <button onClick={() => onPick(s.id)}>
                <span className={`map-legend__dot map-legend__dot--${s.domain}`} style={{ '--st': st?.color }} />
                <span>
                  <b>{s.name}</b>
                  <small>{st?.label || s.area}</small>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="map-legend__keys">
        <span>
          <i className="mk-key mk-key--air" /> Stasiun udara
        </span>
        <span>
          <i className="mk-key mk-key--ocean" /> Titik laut
        </span>
        <span>Warna = status</span>
      </div>
      <DemoBadge />
    </div>
  );
}

const RANK = { none: 0, good: 1, watch: 2, poor: 3 };

/** The ocean parameter in the worst state — the one worth explaining first. */
function worstParam(params, values) {
  let worst = null;
  let rank = -1;
  params.forEach((p) => {
    const r = RANK[assessValue(p, values[p.key].value)];
    if (r > rank) {
      rank = r;
      worst = p;
    }
  });
  return worst;
}
