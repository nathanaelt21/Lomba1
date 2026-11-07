export const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
export const min = (xs) => xs.reduce((a, b) => (b < a ? b : a), Infinity);
export const max = (xs) => xs.reduce((a, b) => (b > a ? b : a), -Infinity);

export function summarize(values) {
  if (!values.length) return null;
  const first = values[0];
  const last = values[values.length - 1];
  return {
    latest: last,
    mean: mean(values),
    min: min(values),
    max: max(values),
    change: first === 0 ? 0 : ((last - first) / Math.abs(first)) * 100,
  };
}

/** Pearson correlation coefficient. Returns NaN for degenerate input. */
export function pearson(xs, ys) {
  const n = Math.min(xs.length, ys.length);
  if (n < 3) return NaN;
  const mx = mean(xs.slice(0, n));
  const my = mean(ys.slice(0, n));
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < n; i++) {
    const a = xs[i] - mx;
    const b = ys[i] - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  return num / Math.sqrt(dx * dy);
}

/** Plain-language (Indonesian) description of a Pearson r. */
export function describeCorrelation(r) {
  if (!Number.isFinite(r)) return 'Tidak dapat dihitung';
  const a = Math.abs(r);
  const strength = a < 0.2 ? 'sangat lemah' : a < 0.4 ? 'lemah' : a < 0.6 ? 'sedang' : a < 0.8 ? 'kuat' : 'sangat kuat';
  const dir = r >= 0 ? 'positif' : 'negatif';
  return `Hubungan ${dir} ${strength}`;
}

/** One-sentence explanation of r for non-experts. */
export function explainCorrelation(r) {
  if (!Number.isFinite(r)) return 'Data tidak cukup bervariasi untuk menghitung hubungan.';
  const a = Math.abs(r);
  if (a < 0.2) return 'Keduanya hampir tidak bergerak bersama: naik-turunnya satu nilai tidak bisa dipakai menebak nilai lainnya.';
  if (r > 0) return 'Saat nilai udara naik, nilai laut cenderung ikut naik (dan sebaliknya).';
  return 'Saat nilai udara naik, nilai laut cenderung turun (dan sebaliknya).';
}

/** Least squares line for scatter plots. */
export function linearFit(xs, ys) {
  const mx = mean(xs);
  const my = mean(ys);
  let num = 0;
  let den = 0;
  xs.forEach((x, i) => {
    num += (x - mx) * (ys[i] - my);
    den += (x - mx) ** 2;
  });
  const slope = den ? num / den : 0;
  return { slope, intercept: my - slope * mx };
}
