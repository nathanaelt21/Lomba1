import { useEffect, useId, useRef, useState } from 'react';

/**
 * Pulsing info marker. Shows a tooltip on hover, focus or tap.
 * `placement`: 'top' | 'bottom' | 'left' | 'right'
 *
 * Hover is handled only for real mouse pointers: on touch screens the
 * emulated mouseenter used to open the tip and the following click closed it
 * again straight away, so a tap seemed to do nothing.
 */
export default function Hotspot({ title, children, placement = 'top', tone = 'light', className = '', style, label }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const box = useRef(null);
  const pointer = useRef('');

  // Close when tapping/clicking anywhere else or pressing Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (box.current && !box.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <span
      ref={box}
      className={`hotspot hotspot--${placement} hotspot--${tone} ${open ? 'is-open' : ''} ${className}`}
      style={style}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
    >
      <button
        type="button"
        className="hotspot__dot"
        aria-describedby={id}
        aria-expanded={open}
        aria-label={label || title}
        onFocus={(e) => e.currentTarget.matches(':focus-visible') && setOpen(true)}
        onBlur={() => setOpen(false)}
        onPointerDown={(e) => {
          pointer.current = e.pointerType;
        }}
        onClick={(e) => {
          e.stopPropagation();
          // A mouse already opened it on hover; a click should not close it.
          if (pointer.current === 'mouse') setOpen(true);
          else setOpen((v) => !v);
          pointer.current = '';
        }}
      >
        <span aria-hidden="true">i</span>
      </button>
      <span role="tooltip" id={id} className="hotspot__tip">
        <strong>{title}</strong>
        <span>{children}</span>
      </span>
    </span>
  );
}
