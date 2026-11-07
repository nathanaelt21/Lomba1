const TZ = 'Asia/Jakarta';
const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: TZ });
const dateTimeFmt = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: TZ,
});

export const formatDate = (d) => dateFmt.format(new Date(d));
export const formatDateTime = (d) => `${dateTimeFmt.format(new Date(d))} WIB`;

export function formatValue(value, decimals = 1) {
  if (value == null || !Number.isFinite(Number(value))) return '—';
  if (Math.abs(value) >= 1000) return Math.round(value).toLocaleString('id-ID');
  return Number(value).toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export const formatSigned = (v, d = 1) => (Number.isFinite(v) ? `${v > 0 ? '+' : ''}${formatValue(v, d)}` : '—');

/** ISO date (YYYY-MM-DD) in Jakarta time, for <input type="date">. */
export const toISODate = (d) => {
  const x = new Date(new Date(d).getTime() + 7 * 3600e3); // WIB = UTC+7
  return x.toISOString().slice(0, 10);
};
