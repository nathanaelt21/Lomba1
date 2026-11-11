import { useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../../animations/gsap.js';
import { WindField } from '../../animations/windField.js';
import { WaveSurface } from '../../animations/waveSurface.js';
import EngineCanvas from '../../components/interactive/EngineCanvas.jsx';
import Hotspot from '../../components/ui/Hotspot.jsx';
import StatusPill from '../../components/ui/StatusPill.jsx';
import { Cloud, Sun, Bird } from '../../components/illustrations/Sky.jsx';
import { Skyline } from '../../components/illustrations/Coast.jsx';
import { Boat, Buoy } from '../../components/illustrations/SeaObjects.jsx';
import { Fish, BranchCoral, BrainCoral, FanCoral, Seaweed, Rock, Bubbles, LightRays } from '../../components/illustrations/Underwater.jsx';
import './HeroJourney.css';

/** Fraction of the scroll where the waterline crosses the top of the screen. */
const WATERLINE = 0.36;

const CLOUDS = [
  { shape: 'a', top: '6%', w: 230, dur: 110, delay: -20, layer: 'back' },
  { shape: 'c', top: '14%', w: 150, dur: 140, delay: -90, layer: 'back' },
  { shape: 'b', top: '30%', w: 190, dur: 125, delay: -55, layer: 'back' },
  { shape: 'a', top: '20%', w: 330, dur: 80, delay: -10, layer: 'front' },
  { shape: 'b', top: '48%', w: 270, dur: 95, delay: -60, layer: 'front' },
  { shape: 'c', top: '62%', w: 200, dur: 70, delay: -35, layer: 'front' },
];

const FISH = [
  { color: 'coral', top: '40%', w: 90, dur: 28, delay: -4, dir: 'right' },
  { color: 'sand', top: '48%', w: 60, dur: 22, delay: -14, dir: 'left' },
  { color: 'glass', top: '56%', w: 110, dur: 34, delay: -20, dir: 'right' },
  { color: 'sky', top: '63%', w: 70, dur: 25, delay: -8, dir: 'left' },
  { color: 'coral', top: '70%', w: 50, dur: 19, delay: -2, dir: 'right' },
  { color: 'glass', top: '76%', w: 64, dur: 30, delay: -26, dir: 'left' },
];

export default function HeroJourney() {
  const root = useRef(null);
  const stage = useRef(null);
  const windRef = useRef(null);
  const waveRef = useRef(null);
  const waveBox = useRef(null);
  const boatRef = useRef(null);
  const buoyRef = useRef(null);
  const gaugeValue = useRef(null);
  const gaugeLabel = useRef(null);
  const gaugeMarker = useRef(null);
  const stRef = useRef(null);
  const crossed = useRef(false);

  // ---------- Bubble burst (waterline crossing & underwater clicks) -----
  const burst = useCallback((x, y, count = 14) => {
    const host = stage.current;
    if (!host || prefersReducedMotion()) return;
    for (let i = 0; i < count; i++) {
      const b = document.createElement('span');
      b.className = 'burst-bubble';
      const s = 6 + Math.random() * 16;
      Object.assign(b.style, { width: `${s}px`, height: `${s}px`, left: `${x}px`, top: `${y}px` });
      host.appendChild(b);
      gsap.fromTo(
        b,
        { x: 0, y: 0, opacity: 0.95, scale: 0.4 },
        {
          x: gsap.utils.random(-70, 70),
          y: -gsap.utils.random(120, 320),
          scale: 1,
          opacity: 0,
          duration: gsap.utils.random(1.2, 2.4),
          ease: 'power1.out',
          onComplete: () => b.remove(),
        }
      );
    }
  }, []);

  // ---------- Scroll journey timeline -----------------------------------
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: stage.current,
          start: 'top top',
          end: '+=190%',
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            updateGauge(self.progress);
            const below = self.progress > WATERLINE;
            if (below !== crossed.current) {
              crossed.current = below;
              const r = stage.current.getBoundingClientRect();
              burst(r.width * 0.5, r.height * 0.35, 26);
            }
          },
        },
      });
      stRef.current = tl.scrollTrigger;

      tl.to(q('.journey__world'), { yPercent: -66.667, duration: 1 }, 0)
        // Hero copy lifts away first
        .to(q('.journey__copy'), { y: -140, opacity: 0, duration: 0.2 }, 0)
        .to(q('.journey__cue'), { opacity: 0, duration: 0.06 }, 0)
        // Atmosphere parallax: far clouds slower than front clouds
        .to(q('.world-clouds--back'), { yPercent: 30, duration: 0.4 }, 0)
        .to(q('.world-clouds--front'), { yPercent: -20, duration: 0.4 }, 0)
        .to(q('.world-sun'), { yPercent: 60, duration: 0.4 }, 0)
        .to(q('.journey__wind'), { opacity: 0, duration: 0.22 }, 0.1)
        // Waterline caption
        .fromTo(q('.caption-1'), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.08 }, 0.24)
        .to(q('.caption-1'), { opacity: 0, y: -40, duration: 0.08 }, 0.44)
        // Sunlight fades as we go deeper
        .fromTo(q('.world-rays'), { opacity: 1 }, { opacity: 0.15, duration: 0.55 }, 0.45)
        .fromTo(q('.journey__shade'), { opacity: 0 }, { opacity: 0.4, duration: 0.5 }, 0.5)
        // Reef rises in layers
        .fromTo(q('.reef-back'), { yPercent: 30 }, { yPercent: 0, duration: 0.45 }, 0.55)
        .fromTo(q('.reef-front'), { yPercent: 55 }, { yPercent: 0, duration: 0.45 }, 0.55)
        .fromTo(q('.caption-2'), { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.14 }, 0.72);

      function updateGauge(p) {
        let label;
        let value;
        if (p < WATERLINE) {
          label = 'Altitude';
          value = `${Math.round((1 - p / WATERLINE) * 120)} m`;
        } else {
          label = 'Depth';
          value = `${Math.round(((p - WATERLINE) / (1 - WATERLINE)) * 18)} m`;
        }
        if (gaugeLabel.current) gaugeLabel.current.textContent = label;
        if (gaugeValue.current) gaugeValue.current.textContent = value;
        if (gaugeMarker.current) gaugeMarker.current.style.top = `${p * 100}%`;
      }
      updateGauge(0);
    },
    { scope: root }
  );

  // ---------- Pointer routing: sky → wind, sea → waves, deep → bubbles ---
  const local = (e, el) => {
    const r = el.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, r };
  };
  const isUi = (e) => e.target.closest('a, button, .hotspot, .status-pill');

  const onPointerMove = (e) => {
    const s = local(e, stage.current);
    windRef.current?.pointerMove(s.x, s.y);
    if (e.buttons && waveRef.current && waveBox.current) {
      const w = local(e, waveBox.current);
      if (w.y > w.r.height * 0.25 && w.y < w.r.height) waveRef.current.drag(w.x, w.y, e.movementX, e.movementY);
    }
  };

  const onPointerDown = (e) => {
    if (isUi(e)) return;
    const s = local(e, stage.current);
    const w = local(e, waveBox.current);
    if (w.y < w.r.height * 0.3) {
      windRef.current?.gust(s.x, s.y);
      gsap.fromTo(
        root.current.querySelectorAll('.world-clouds'),
        { x: 0 },
        { x: 60, duration: 0.5, ease: 'power2.out', yoyo: true, repeat: 1 }
      );
    } else if (w.y < w.r.height) {
      waveRef.current?.ripple(w.x, w.y);
    } else {
      burst(s.x, s.y, 10);
    }
  };

  const setFloaters = (engine) =>
    engine.setFloaters([
      { el: boatRef.current, x: 0.2, layer: 2, sink: 0.82 },
      { el: buoyRef.current, x: 0.84, layer: 1, sink: 0.72 },
    ]);

  const dive = () => {
    const st = stRef.current;
    const target = st ? st.end + 4 : window.innerHeight;
    window.scrollTo({ top: target, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <section className="journey" ref={root} aria-label="SEAIR: from the sky to the deep sea">
      <div
        className="journey__stage"
        ref={stage}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerLeave={() => windRef.current?.pointerLeave()}
      >
        {/* ================= THE WORLD (3 screens tall) ================= */}
        <div className="journey__world">
          {/* ---- SKY ---- */}
          <div className="world-sky">
            <Sun className="world-sun" />
            <div className="world-clouds world-clouds--back">
              {CLOUDS.filter((c) => c.layer === 'back').map((c, i) => (
                <div key={i} className="drift" style={{ top: c.top, '--dur': `${c.dur}s`, '--delay': `${c.delay}s` }}>
                  <Cloud shape={c.shape} style={{ width: c.w, opacity: 0.85 }} />
                </div>
              ))}
            </div>
            <div className="world-birds">
              <Bird style={{ width: 30 }} />
              <Bird style={{ width: 22, marginLeft: 40, marginTop: -18 }} />
              <Bird style={{ width: 18, marginLeft: 16, marginTop: 4 }} />
            </div>
            <div className="world-clouds world-clouds--front">
              {CLOUDS.filter((c) => c.layer === 'front').map((c, i) => (
                <div key={i} className="drift" style={{ top: c.top, '--dur': `${c.dur}s`, '--delay': `${c.delay}s` }}>
                  <Cloud shape={c.shape} style={{ width: c.w }} />
                </div>
              ))}
            </div>
          </div>

          {/* ---- HORIZON (coastline sits exactly on the waterline) ---- */}
          <div className="world-horizon">
            <div className="world-horizon__inner">
              <Skyline />
              <Hotspot title="Coastal emissions" placement="top" style={{ left: '72.2%', top: '34%' }}>
                Industri, pelabuhan, dan lalu lintas di pesisir Jakarta melepaskan gas dan partikel. Angin bisa membawanya sampai
                ke atas teluk.
              </Hotspot>
            </div>
          </div>

          {/* ---- UNDERWATER ---- */}
          <div className="world-under">
            <LightRays className="world-rays" />
            <Bubbles count={18} seed={3} />
            {FISH.map((f, i) => (
              <div
                key={i}
                className={`swim ${f.dir === 'left' ? 'swim--left' : ''}`}
                style={{ top: f.top, '--dur': `${f.dur}s`, '--delay': `${f.delay}s` }}
              >
                <Fish color={f.color} style={{ width: f.w }} />
              </div>
            ))}
            <div className="world-reef">
              <div className="reef-back">
                <Rock className="reef-rock reef-rock--1" color="#0A4D61" />
                <Rock className="reef-rock reef-rock--2" color="#0A4D61" />
                <FanCoral className="reef-fan" />
                <Seaweed className="reef-weed reef-weed--1" color="#087E8B" height={220} />
              </div>
              <div className="reef-front">
                <div className="reef-sand" />
                <BranchCoral className="reef-coral reef-coral--1" />
                <BrainCoral className="reef-brain" />
                <BranchCoral className="reef-coral reef-coral--2" color="#F4D6A0" tip="#FCEBCB" />
                <Seaweed className="reef-weed reef-weed--2" color="#18A6A6" height={190} />
                <Seaweed className="reef-weed reef-weed--3" color="#70D6CE" height={140} blades={2} />
                <Hotspot title="Coral reef" tone="dark" placement="top" style={{ left: '17%', bottom: '170px' }}>
                  Karang hanya bisa hidup pada rentang suhu, pH, dan kejernihan air yang sempit. Karang termasuk yang paling
                  awal merasakan perubahan di udara dan laut.
                </Hotspot>
                <Hotspot title="Oxygen for fish" tone="dark" placement="top" style={{ left: '63%', bottom: '230px' }}>
                  Ikan bernapas dengan oksigen terlarut. Di bawah sekitar 5 mg/L, banyak biota laut mulai stres.
                </Hotspot>
              </div>
            </div>
          </div>

          {/* ---- SURFACE ---- */}
          <div className="world-surface" ref={waveBox}>
            <EngineCanvas Engine={WaveSurface} ref={waveRef} className="world-surface__canvas" onReady={setFloaters} />
            <div className="world-floater" ref={boatRef} style={{ left: '20%' }}>
              <Boat />
              <Hotspot title="Coastal livelihoods" placement="top" style={{ left: '50%', top: '-6px' }}>
                Nelayan di sekitar Teluk Jakarta bergantung pada air yang bersih dan sehat untuk pangan dan penghasilan mereka.
              </Hotspot>
            </div>
            <div className="world-floater world-floater--buoy" ref={buoyRef} style={{ left: '84%' }}>
              <Buoy />
              <Hotspot title="Ocean monitoring" placement="top" style={{ left: '50%', top: '-8px' }}>
                Pelampung dan stasiun sampel mengukur pH, oksigen, salinitas, dan suhu. Pelampung ini hanya ilustrasi.
              </Hotspot>
            </div>
          </div>
        </div>

        {/* ================= SCREEN-FIXED LAYERS ================= */}
        <EngineCanvas Engine={WindField} ref={windRef} className="journey__wind" />
        <div className="journey__shade" aria-hidden="true" />

        <div className="journey__copy container">
          <StatusPill />
          <h1 className="journey__title">
            Above the Surface, <span>Beyond the Horizon.</span>
          </h1>
          <p className="journey__lede">Temukan hubungan antara udara yang kita hirup dan laut yang kita jaga bersama.</p>
          <div className="journey__actions">
            <a href="#data" className="btn">
              Explore the data
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 10h12m-5-5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <Link to="/map" target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
              Open the map
            </Link>
          </div>
          <p className="journey__hint">
            <span>Tap the sky for a gust of wind</span>
            <span>Tap or drag the sea to make waves</span>
          </p>
        </div>

        <div className="journey__caption caption-1" aria-hidden="true">
          <span className="eyebrow">Sea level · 0 m</span>
          <p>Crossing the surface</p>
        </div>
        <div className="journey__caption caption-2">
          <span className="eyebrow">The Deep Blue</span>
          <h2>What rises from our cities settles here.</h2>
          <p>Laut menyerap gas, partikel, dan panas dari atmosfer. Terus menyelam untuk melihat caranya.</p>
        </div>

        <div className="depth-gauge" aria-hidden="true">
          <span className="depth-gauge__label" ref={gaugeLabel}>
            Altitude
          </span>
          <span className="depth-gauge__value" ref={gaugeValue}>
            120 m
          </span>
          <span className="depth-gauge__track">
            <span className="depth-gauge__water" style={{ top: `${WATERLINE * 100}%` }} />
            <span className="depth-gauge__marker" ref={gaugeMarker} />
          </span>
        </div>

        <button className="journey__cue" onClick={dive}>
          <span className="journey__cue-mouse" aria-hidden="true">
            <span />
          </span>
          Scroll to dive
        </button>
      </div>
    </section>
  );
}

// Keep ScrollTrigger measurements fresh once webfonts finish loading.
if (typeof document !== 'undefined' && document.fonts) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
