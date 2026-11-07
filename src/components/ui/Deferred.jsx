import { Suspense, useEffect, useRef, useState } from 'react';

/**
 * Renders `children` only once the placeholder is within `margin` of the
 * viewport. Pair it with React.lazy so heavy libraries (Leaflet, Chart.js)
 * are downloaded only when their section is about to be seen.
 */
export default function Deferred({ children, minHeight = 400, margin = '600px' }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!('IntersectionObserver' in window)) {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: margin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show, margin]);

  const placeholder = (
    <div className="deferred-placeholder" style={{ minHeight }} aria-hidden="true">
      <span className="page-loading__bubble" />
    </div>
  );

  return <div ref={ref}>{show ? <Suspense fallback={placeholder}>{children}</Suspense> : placeholder}</div>;
}
