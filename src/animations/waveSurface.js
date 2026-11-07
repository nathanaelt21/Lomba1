/**
 * WaveSurface — layered cartoon sea surface on a canvas.
 *  - 3 layers of sine waves moving at different speeds
 *  - a 1D spring field (height map) the user can disturb:
 *      ripple(x, y)       → click splash + expanding rings
 *      drag(x, y, vx, vy) → continuous disturbance while dragging
 *  - floaters (DOM nodes) ride the front layer and tilt with its slope
 */
const LAYERS = [
  // baseline is a fraction of canvas height; `react` is how much the springs move this layer
  { base: 0.34, a1: 5, k1: 0.012, s1: 0.5, a2: 3, k2: 0.03, s2: 0.8, react: 0.2, fill: '#70D6CE', foam: 'rgba(248,252,250,.7)' },
  { base: 0.46, a1: 8, k1: 0.009, s1: -0.7, a2: 4, k2: 0.024, s2: 1.1, react: 0.55, fill: '#3DBDB6', foam: 'rgba(248,252,250,.8)' },
  { base: 0.6, a1: 11, k1: 0.007, s1: 0.9, a2: 5, k2: 0.02, s2: -1.3, react: 1, fill: '#18A6A6', foam: '#F8FCFA' },
];
const SPACING = 6;

export class WaveSurface {
  constructor(canvas, { reduced = false } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.reduced = reduced;
    this.time = 0;
    this.rings = [];
    this.floaters = [];
    this.sparkles = Array.from({ length: 26 }, () => ({ x: Math.random(), y: Math.random(), p: Math.random() * 6 }));
    this.acc = 0;
    this.resize();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { clientWidth: w, clientHeight: h } = this.canvas;
    this.w = w;
    this.h = h;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.ceil(w / SPACING) + 2;
    this.hgt = new Float32Array(n);
    this.vel = new Float32Array(n);
    this.n = n;
  }

  setFloaters(list) {
    this.floaters = list.filter((f) => f.el);
  }

  idx(x) {
    return Math.max(0, Math.min(this.n - 1, Math.round(x / SPACING)));
  }

  push(x, force, radius = 40) {
    const c = x / SPACING;
    const r = radius / SPACING;
    for (let i = Math.max(0, Math.floor(c - r)); i <= Math.min(this.n - 1, Math.ceil(c + r)); i++) {
      const f = 1 - Math.abs(i - c) / r;
      if (f > 0) this.vel[i] += force * f;
    }
  }

  ripple(x, y) {
    this.push(x, 14, 46);
    this.rings.push({ x, y: Math.max(y, this.surfaceY(2, x) + 6), r: 4, life: 1 });
    this.rings.push({ x, y: Math.max(y, this.surfaceY(2, x) + 6), r: 0, life: 1.25 });
  }

  drag(x, y, vx, vy) {
    const speed = Math.min(40, Math.hypot(vx, vy));
    this.push(x, Math.sign(vy || 1) * speed * 0.35 + speed * 0.1, 34);
    if (Math.random() < 0.18) this.rings.push({ x, y: Math.max(y, this.surfaceY(2, x) + 4), r: 2, life: 0.7 });
  }

  /** y of a layer's surface at x (CSS px, within canvas). */
  surfaceY(li, x) {
    const L = LAYERS[li];
    const t = this.time;
    const amp = this.reduced ? 0.5 : 1;
    let y = this.h * L.base + amp * (L.a1 * Math.sin(x * L.k1 + t * L.s1) + L.a2 * Math.sin(x * L.k2 + t * L.s2 + li));
    if (this.hgt) {
      const f = x / SPACING;
      const i = Math.max(0, Math.min(this.n - 2, Math.floor(f)));
      const u = f - i;
      y += (this.hgt[i] * (1 - u) + this.hgt[i + 1] * u) * L.react;
    }
    return y;
  }

  stepSprings() {
    const K = 0.028;
    const D = 0.035;
    const S = 0.22;
    const { hgt, vel, n } = this;
    for (let i = 0; i < n; i++) {
      vel[i] += -K * hgt[i] - D * vel[i];
      hgt[i] += vel[i];
    }
    for (let pass = 0; pass < 3; pass++) {
      for (let i = 0; i < n; i++) {
        if (i > 0) vel[i - 1] += S * (hgt[i] - hgt[i - 1]) * 0.5;
        if (i < n - 1) vel[i + 1] += S * (hgt[i] - hgt[i + 1]) * 0.5;
      }
    }
  }

  step(dt) {
    this.time += dt;
    this.acc += dt;
    while (this.acc > 1 / 60) {
      this.stepSprings();
      this.acc -= 1 / 60;
    }
    for (const r of this.rings) {
      r.r += 70 * dt;
      r.life -= 0.7 * dt;
    }
    this.rings = this.rings.filter((r) => r.life > 0);
  }

  draw() {
    const { ctx, w, h } = this;
    ctx.clearRect(0, 0, w, h);
    LAYERS.forEach((L, li) => {
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w + SPACING; x += SPACING) ctx.lineTo(x, this.surfaceY(li, x));
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = L.fill;
      ctx.fill();
      // foam crest
      ctx.beginPath();
      for (let x = 0; x <= w + SPACING; x += SPACING) {
        const y = this.surfaceY(li, x);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = L.foam;
      ctx.lineWidth = li === 2 ? 5 : 3;
      ctx.lineCap = 'round';
      ctx.stroke();

      if (li === 0) this.drawSparkles();
    });
    this.drawFoamDots();
    this.drawRings();
    this.updateFloaters();
  }

  drawSparkles() {
    // sun reflection: short horizontal glints on the back layer
    const { ctx, w, h, time } = this;
    for (const s of this.sparkles) {
      const x = w * (0.55 + s.x * 0.35);
      const y = h * (0.38 + s.y * 0.18);
      const a = 0.25 + 0.55 * Math.max(0, Math.sin(time * 2 + s.p));
      ctx.strokeStyle = `rgba(255,255,255,${a})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 8 - s.y * 10, y);
      ctx.lineTo(x + 8 + s.y * 10, y);
      ctx.stroke();
    }
  }

  drawFoamDots() {
    const { ctx, w, time } = this;
    ctx.fillStyle = 'rgba(248,252,250,.85)';
    for (let x = 30; x < w; x += 70) {
      const ox = x + Math.sin(time * 0.6 + x) * 12;
      const y = this.surfaceY(2, ox) + 14 + Math.sin(time + x) * 3;
      ctx.beginPath();
      ctx.ellipse(ox, y, 7, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawRings() {
    const { ctx } = this;
    for (const r of this.rings) {
      ctx.strokeStyle = `rgba(255,255,255,${Math.min(1, r.life) * 0.9})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(r.x, r.y, r.r * 1.6, r.r * 0.38, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  updateFloaters() {
    for (const f of this.floaters) {
      const x = f.x * this.w;
      const li = f.layer ?? 2;
      const y = this.surfaceY(li, x);
      const slope = (this.surfaceY(li, x + 12) - this.surfaceY(li, x - 12)) / 24;
      f.el.style.transform = `translate(-50%, ${y - (f.sink ?? 0.8) * f.el.offsetHeight}px) rotate(${Math.atan(slope) * 0.9}rad)`;
    }
  }
}
