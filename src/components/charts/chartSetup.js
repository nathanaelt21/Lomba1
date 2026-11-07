import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  ScatterController,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, BarController, BarElement, ScatterController, CategoryScale, LinearScale, Filler, Tooltip, Legend);

Chart.defaults.font.family = "'Nunito', system-ui, sans-serif";
Chart.defaults.font.weight = 600;
Chart.defaults.color = '#6b8d96';
Chart.defaults.borderColor = 'rgba(7, 59, 76, 0.08)';

export const SERIES_COLORS = {
  air: '#2B8FB8',
  ocean: '#087E8B',
  compare: '#FF927E',
  sand: '#D9B26C',
};

export const tooltipStyle = {
  backgroundColor: '#073B4C',
  titleFont: { family: "'Fredoka', sans-serif", weight: 600, size: 13 },
  bodyFont: { weight: 600 },
  padding: 12,
  cornerRadius: 12,
  displayColors: true,
  boxPadding: 4,
};

/**
 * Draws the regulatory reference for a parameter:
 *  max/min → dashed line, range → soft band. Configure with
 *  options.plugins.reference = { type, value | min,max, label }.
 */
export const referencePlugin = {
  id: 'reference',
  beforeDatasetsDraw(chart, _args, opts) {
    if (!opts || !opts.type || opts.type === 'note') return;
    const { ctx, chartArea: a, scales } = chart;
    const y = scales.y;
    if (!y) return;
    ctx.save();
    if (opts.type === 'range') {
      const top = y.getPixelForValue(opts.max);
      const bottom = y.getPixelForValue(opts.min);
      const t = Math.max(a.top, Math.min(a.bottom, top));
      const b = Math.max(a.top, Math.min(a.bottom, bottom));
      ctx.fillStyle = 'rgba(112, 214, 206, 0.16)';
      ctx.fillRect(a.left, t, a.right - a.left, b - t);
      label(ctx, opts.label, a.right - 6, t + 14);
    } else {
      const py = y.getPixelForValue(opts.value);
      if (py >= a.top && py <= a.bottom) {
        ctx.strokeStyle = '#E5654F';
        ctx.setLineDash([6, 6]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(a.left, py);
        ctx.lineTo(a.right, py);
        ctx.stroke();
        label(ctx, opts.label, a.right - 6, py - 6, '#E5654F');
      }
    }
    ctx.restore();
  },
};

function label(ctx, text, x, y, color = '#087E8B') {
  if (!text) return;
  ctx.setLineDash([]);
  ctx.font = "700 11px 'Nunito', sans-serif";
  ctx.textAlign = 'right';
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

Chart.register(referencePlugin);

export { Chart };
