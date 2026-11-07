/** Tiny CSV export so visitors can open the data in Excel / Google Sheets. */
const iso = (t) => new Date(t + 7 * 3600e3).toISOString().slice(0, 16).replace('T', ' ');

const cell = (v) => {
  const s = String(v ?? '');
  return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function seriesToCsv(main, cmp, param) {
  const rows = [['waktu_wib', `${main.location.name} (${param.unit})`, ...(cmp ? [`${cmp.location.name} (${param.unit})`] : [])]];
  const other = cmp ? new Map(cmp.points.map((p) => [p.t, p.v])) : null;
  main.points.forEach((p) => {
    const row = [iso(p.t), p.v.toFixed(param.decimals)];
    if (other) {
      const o = other.get(p.t);
      row.push(o == null ? '' : o.toFixed(param.decimals));
    }
    rows.push(row);
  });
  const note = [
    `# ${param.name} — ${main.resolution}`,
    `# Sumber: ${main.source.name}${main.isDemo ? ' — DATA DEMO, bukan hasil pengukuran' : ''}`,
  ];
  return [...note, ...rows.map((r) => r.map(cell).join(','))].join('\n');
}

export function downloadSeriesCsv(main, cmp, param) {
  const csv = seriesToCsv(main, cmp, param);
  // BOM so Excel opens µ, ³ and other characters correctly.
  const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `seair_${param.key}_${main.location.id}_${main.period}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
