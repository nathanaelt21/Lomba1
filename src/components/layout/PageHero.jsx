import { useRef } from 'react';
import EngineCanvas from '../interactive/EngineCanvas.jsx';
import { WindField } from '../../animations/windField.js';
import { WaveSurface } from '../../animations/waveSurface.js';
import { Cloud, Sun, Bird } from '../illustrations/Sky.jsx';
import { Fish, Seaweed, BranchCoral, Bubbles, LightRays } from '../illustrations/Underwater.jsx';
import './PageHero.css';

/**
 * Illustrated header for inner pages, sharing the landing page's world.
 *  variant="sky"     → atmosphere with interactive wind (Air)
 *  variant="deep"    → underwater with fish & rays (Ocean)
 *  variant="surface" → horizon with interactive waves (Explore, Insights, About)
 */
export default function PageHero({ variant = 'surface', eyebrow, title, children, aside }) {
  const box = useRef(null);
  const wind = useRef(null);
  const wave = useRef(null);
  const waveBox = useRef(null);

  const local = (e, el) => {
    const r = el.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, r };
  };
  const onMove = (e) => {
    if (wind.current) {
      const p = local(e, box.current);
      wind.current.pointerMove(p.x, p.y);
    }
    if (e.buttons && wave.current) {
      const p = local(e, waveBox.current);
      if (p.y > 0) wave.current.drag(p.x, p.y, e.movementX, e.movementY);
    }
  };
  const onDown = (e) => {
    if (e.target.closest('a, button, input, select')) return;
    if (wind.current) {
      const p = local(e, box.current);
      wind.current.gust(p.x, p.y);
    }
    if (wave.current) {
      const p = local(e, waveBox.current);
      if (p.y > p.r.height * 0.25) wave.current.ripple(p.x, p.y);
    }
  };

  return (
    <header
      className={`page-hero page-hero--${variant}`}
      ref={box}
      onPointerMove={onMove}
      onPointerDown={onDown}
      onPointerLeave={() => wind.current?.pointerLeave()}
    >
      <div className="page-hero__art" aria-hidden="true">
        {variant === 'sky' && (
          <>
            <Sun className="page-hero__sun" />
            <div className="drift" style={{ top: '18%', '--dur': '90s', '--delay': '-20s' }}>
              <Cloud shape="a" style={{ width: 260 }} />
            </div>
            <div className="drift" style={{ top: '52%', '--dur': '120s', '--delay': '-80s' }}>
              <Cloud shape="b" style={{ width: 200, opacity: 0.85 }} />
            </div>
            <div className="drift" style={{ top: '34%', '--dur': '70s', '--delay': '-45s' }}>
              <Bird style={{ width: 28 }} />
            </div>
            <EngineCanvas Engine={WindField} ref={wind} className="page-hero__canvas" options={{ density: 0.8 }} />
          </>
        )}
        {variant === 'deep' && (
          <>
            <LightRays />
            <Bubbles count={14} seed={31} />
            <div className="swim" style={{ top: '30%', '--dur': '24s', '--delay': '-6s' }}>
              <Fish color="coral" style={{ width: 80 }} />
            </div>
            <div className="swim swim--left" style={{ top: '55%', '--dur': '30s', '--delay': '-14s' }}>
              <Fish color="glass" style={{ width: 64 }} />
            </div>
            <div className="swim" style={{ top: '68%', '--dur': '19s', '--delay': '-3s' }}>
              <Fish color="sand" style={{ width: 46 }} />
            </div>
            <Seaweed className="page-hero__weed page-hero__weed--1" color="#087E8B" height={180} />
            <BranchCoral className="page-hero__coral" />
            <Seaweed className="page-hero__weed page-hero__weed--2" color="#70D6CE" height={130} blades={2} />
          </>
        )}
        {variant === 'surface' && (
          <>
            <div className="drift" style={{ top: '14%', '--dur': '100s', '--delay': '-30s' }}>
              <Cloud shape="c" style={{ width: 180 }} />
            </div>
            <div className="drift" style={{ top: '30%', '--dur': '140s', '--delay': '-90s' }}>
              <Cloud shape="a" style={{ width: 240, opacity: 0.8 }} />
            </div>
            <Sun className="page-hero__sun page-hero__sun--low" />
            <div className="page-hero__waves" ref={waveBox}>
              <EngineCanvas Engine={WaveSurface} ref={wave} className="page-hero__canvas" />
            </div>
          </>
        )}
      </div>
      <div className="container page-hero__inner">
        <div className="page-hero__copy">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1>{title}</h1>
          {children && <p className="page-hero__lede">{children}</p>}
        </div>
        {aside && <div className="page-hero__aside">{aside}</div>}
      </div>
    </header>
  );
}
