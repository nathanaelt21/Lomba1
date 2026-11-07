/** Mandatory label for any value that is not a real measurement. */
export default function DemoBadge({ tone = 'light', className = '', compact = false }) {
  return (
    <span
      className={`demo-badge demo-badge--${tone} ${className}`}
      title="Nilai contoh buatan, bukan hasil pengukuran. Data asli dari BMKG, KLH, ISPU Jakarta, dan Unpad PODC akan menggantikannya setelah terhubung."
    >
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M8 4.5v4.2M8 11.2v.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {compact ? 'DEMO' : 'DATA DEMO'}
    </span>
  );
}
