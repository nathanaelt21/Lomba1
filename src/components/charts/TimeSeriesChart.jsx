import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { tooltipStyle } from './chartSetup.js';
import { formatValue } from '../../utils/format.js';

const fmtShort = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' });
const fmtHour = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });
const fmtMonth = new Intl.DateTimeFormat('id-ID', { month: 'short', year: '2-digit', timeZone: 'Asia/Jakarta' });

function hexToRgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/**
 * series: [{ label, points:[{t,v}], color, dashed }]
 * reference: parameter.reference (drawn by referencePlugin)
 */
export default function TimeSeriesChart({ series, unit, decimals = 1, period = '30d', reference, height = 320, ariaLabel }) {
  const data = useMemo(() => {
    const base = series[0]?.points || [];
    const fmt = period === '7d' ? fmtHour : period === '1y' ? fmtMonth : fmtShort;
    return {
      labels: base.map((p) => fmt.format(new Date(p.t))),
      datasets: series.map((s, i) => ({
        label: s.label,
        data: s.points.map((p) => p.v),
        borderColor: s.color,
        borderWidth: i === 0 ? 3 : 2.5,
        borderDash: s.dashed ? [7, 5] : undefined,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: s.color,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3,
        tension: 0.38,
        fill: i === 0 ? 'origin' : false,
        backgroundColor: (ctx) => {
          const { chart } = ctx;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return 'transparent';
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, hexToRgba(s.color, 0.28));
          g.addColorStop(1, hexToRgba(s.color, 0));
          return g;
        },
      })),
    };
  }, [series, period]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600, easing: 'easeOutCubic' },
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxTicksLimit: period === '1y' ? 12 : 7, maxRotation: 0 },
        },
        y: {
          grace: '12%',
          ticks: { maxTicksLimit: 6, callback: (v) => formatValue(v, decimals > 1 ? 1 : 0) },
          title: { display: !!unit, text: unit, font: { weight: 700 } },
        },
      },
      plugins: {
        legend: {
          display: series.length > 1,
          position: 'top',
          align: 'end',
          labels: { usePointStyle: true, pointStyle: 'line', boxWidth: 24 },
        },
        tooltip: {
          ...tooltipStyle,
          callbacks: { label: (c) => ` ${c.dataset.label}: ${formatValue(c.parsed.y, decimals)}${unit ? ` ${unit}` : ''}` },
        },
        reference: reference ? { ...reference, label: reference.label } : undefined,
      },
    }),
    [unit, decimals, period, reference, series.length]
  );

  return (
    <div className="chart-box" style={{ height }} role="img" aria-label={ariaLabel}>
      <Line data={data} options={options} />
    </div>
  );
}
