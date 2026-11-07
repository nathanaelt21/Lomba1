import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../animations/gsap.js';

/** Reads scroll progress (0–1) once per frame while the page scrolls. */
function useScrollProgress(onChange) {
  const cb = useRef(onChange);
  cb.current = onChange;
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      cb.current(max > 0 ? window.scrollY / max : 0, window.scrollY);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
}

/** Thin bar under the navbar that fills as the visitor reads down the page. */
export function ScrollProgress() {
  const bar = useRef(null);
  useScrollProgress((p) => {
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
  });
  return (
    <div className="scroll-progress" aria-hidden="true">
      <span ref={bar} />
    </div>
  );
}

/** Floating "back to top" button that appears after scrolling a screen. */
export function BackToTop() {
  const [show, setShow] = useState(false);
  useScrollProgress((_p, y) => setShow(y > window.innerHeight * 1.2));
  return (
    <button
      type="button"
      className={`back-to-top ${show ? 'is-visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })}
      aria-label="Kembali ke atas"
      title="Kembali ke atas"
      tabIndex={show ? 0 : -1}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M6 11l6-6 6 6" />
      </svg>
    </button>
  );
}
