import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useAnimationFrame, useInView, usePrefersReducedMotion } from '../../hooks/useMotion.js';

/**
 * Hosts a canvas animation engine (WindField, WaveSurface…).
 * The engine instance is exposed through the forwarded ref so parents can
 * route pointer events to it. Rendering pauses while off-screen.
 */
const EngineCanvas = forwardRef(function EngineCanvas({ Engine, options, className = '', paused = false, onReady }, ref) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const inView = useInView(canvasRef, '0px');
  // A new engine is created whenever Engine or the reduced-motion preference
  // changes; bump a version so the forwarded ref points at the current one
  // (it used to keep the first instance, which no longer drew anything).
  const [version, setVersion] = useState(0);
  const ready = version > 0;

  useImperativeHandle(ref, () => engineRef.current, [version]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new Engine(canvas, { ...options, reduced });
    engineRef.current = engine;
    setVersion((v) => v + 1);
    onReady?.(engine);
    const ro = new ResizeObserver(() => engine.resize());
    ro.observe(canvas);
    return () => {
      ro.disconnect();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Engine, reduced]);

  useAnimationFrame((dt) => {
    const e = engineRef.current;
    if (!e) return;
    e.step(dt);
    e.draw();
  }, ready && inView && !paused);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
});

export default EngineCanvas;
