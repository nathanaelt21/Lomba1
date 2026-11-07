/* Additional chart types used on the Ocean and Insights pages. */
import { useMemo } from 'react';
import { Bar, Line, Scatter } from 'react-chartjs-2';
import { tooltipStyle } from './chartSetup.js';
import { formatValue } from '../../utils/format.js';

const box = (height, label, chart) => (
  <div className="chart-box" style={{ height }} role="img" aria-label={label}>
    {chart}
  </div>
);

/** Horizontal or vertical bars. items: [{ label, value, color }] */
export function BarChart({ items, unit, decimals = 1, horizontal = false, height = 300, reference, ariaLabel }) {
  const data = useMemo(
    () => ({
      labels: items.map((i) => i.label),
      datasets: [
        {
          data: items.map((i) => i.value),
          backgroundColor: items.map((i) => i.color),
          borderRadius: 10,
          borderSkipped: false,
          maxBarThickness: 34,
        },
      ],
    }),
    [items]
  );
  const options = useMemo(
    () => ({
      indexAxis: horizontal ? 'y' : 'x',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { ...tooltipStyle, callbacks: { label: (c) => ` ${formatValue(c.raw, decimals)}${unit ? ` ${unit}` : ''}` } },
        reference: !horizontal && reference ? reference : undefined,
      },
      scales: {
        x: { grid: { display: horizontal }, ticks: { maxRotation: 0, autoSkip: false, font: { size: 11 } } },
        y: { grid: { display: !horizontal }, grace: '10%', title: { display: !horizontal && !!unit, text: unit } },
      },
    }),
    [horizontal, unit, decimals, reference]
  );
  return box(height, ariaLabel, <Bar data={data} options={options} />);
}

/** Two series with independent y axes. */
export function DualLineChart({ labels, left, right, height = 340, ariaLabel }) {
  const data = useMemo(
    () => ({
      labels,
      datasets: [
        { label: `${left.label} (${left.unit})`, data: left.values, borderColor: left.color, backgroundColor: left.color, yAxisID: 'y', tension: 0.35, pointRadius: 0, borderWidth: 3 },
        { label: `${right.label} (${right.unit})`, data: right.values, borderColor: right.color, backgroundColor: right.color, yAxisID: 'y1', tension: 0.35, pointRadius: 0, borderWidth: 3, borderDash: [7, 5] },
      ],
    }),
    [labels, left, right]
  );
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top', align: 'end', labels: { usePointStyle: true, pointStyle: 'line', boxWidth: 24 } },
        tooltip: { ...tooltipStyle, callbacks: { label: (c) => ` ${c.dataset.label}: ${formatValue(c.parsed.y, 1)}` } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 12, maxRotation: 0 } },
        y: { position: 'left', title: { display: true, text: left.unit, color: left.color }, ticks: { color: left.color } },
        y1: { position: 'right', grid: { display: false }, title: { display: true, text: right.unit, color: right.color }, ticks: { color: right.color } },
      },
    }),
    [left, right]
  );
  return box(height, ariaLabel, <Line data={data} options={options} />);
}

/** Scatter with an optional fitted line. points: [{x,y}] */
export function ScatterPlot({ points, fit, xLabel, yLabel, color = '#087E8B', height = 340, ariaLabel }) {
  const data = useMemo(() => {
    const xs = points.map((p) => p.x);
    const lo = Math.min(...xs);
    const hi = Math.max(...xs);
    return {
      datasets: [
        { type: 'scatter', label: 'Nilai mingguan', data: points, backgroundColor: `${color}AA`, borderColor: '#fff', borderWidth: 1.5, pointRadius: 6, pointHoverRadius: 8 },
        ...(fit
          ? [
              {
                type: 'line',
                label: 'Garis tren',
                data: [
                  { x: lo, y: fit.intercept + fit.slope * lo },
                  { x: hi, y: fit.intercept + fit.slope * hi },
                ],
                borderColor: '#FF927E',
                borderWidth: 2.5,
                borderDash: [6, 6],
                pointRadius: 0,
              },
            ]
          : []),
      ],
    };
  }, [points, fit, color]);
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { ...tooltipStyle, callbacks: { label: (c) => ` ${xLabel}: ${formatValue(c.parsed.x, 1)} · ${yLabel}: ${formatValue(c.parsed.y, 1)}` } },
      },
      scales: {
        x: { type: 'linear', title: { display: true, text: xLabel } },
        y: { title: { display: true, text: yLabel } },
      },
    }),
    [xLabel, yLabel]
  );
  return box(height, ariaLabel, <Scatter data={data} options={options} />);
}
