const DAY = 864e5;

/**
 * Monsoon calendar proxy for Jakarta: +1 near the wet-season peak (~30 Jan),
 * −1 near the dry-season peak (~31 Jul). A smooth calendar curve, not a
 * rainfall measurement.
 */
export function wetness(t) {
  const d = new Date(t);
  const start = Date.UTC(d.getUTCFullYear(), 0, 1);
  const doy = (t - start) / DAY;
  return Math.cos((2 * Math.PI * (doy - 30)) / 365.25);
}

/** 'wet' (Dec–Mar), 'dry' (Jun–Sep) or 'transition'. */
export function seasonOf(t) {
  const m = new Date(t).getUTCMonth();
  if (m === 11 || m <= 2) return 'wet';
  if (m >= 5 && m <= 8) return 'dry';
  return 'transition';
}
