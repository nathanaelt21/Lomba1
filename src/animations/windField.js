/**
 * WindField — canvas wind particles + cartoon wind swooshes.
 *  - particles relax toward a slowly changing flow field
 *  - pointer movement drags nearby particles along with it
 *  - gust(x, y) blasts particles outward and spawns swoosh trails
 */
const TAU = Math.PI * 2;

export class WindField {
  constructor(canvas, { density = 1, reduced = false } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.density = density;
    this.reduced = reduced;
    this.particles = [];
    this.swooshes = [];
    this.pointer = { x: -9999, y: -9999, vx: 0, vy: 0, t: 0 };
    this.spawnTimer = 0;
    this.time = 0;
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
    const target = Math.round(((w * h) / 9000) * this.density * (this.reduced ? 0.4 : 1));
    const n = Math.max(30, Math.min(220, target));
    while (this.particles.length < n) this.particles.push(this.makeParticle(true));
    this.particles.length = n;
  }

  makeParticle(randomX) {
    return {
      x: randomX ? Math.random() * this.w : -10,
      y: Math.random() * this.h,
      vx: 0.6 + Math.random(),
      vy: 0,
      size: 0.8 + Math.random() * 1.6,
      alpha: 0.35 + Math.random() * 0.5,
    };
  }

  flow(x, y, t) {
    const base = 0.9 + 0.35 * Math.sin(t * 0.25);
    return [base + 0.4 * Math.sin(y * 0.006 + t * 0.4), 0.35 * Math.sin(x * 0.004 + t * 0.5 + y * 0.01)];
  }

  pointerMove(x, y) {
    const now = performance.now();
    const dt = Math.max(16, now - this.pointer.t);
    if (this.pointer.t && this.pointer.x > -999) {
      this.pointer.vx = ((x - this.pointer.x) / dt) * 16;
      this.pointer.vy = ((y - this.pointer.y) / dt) * 16;
    }
    this.pointer.x = x;
    this.pointer.y = y;
    this.pointer.t = now;
  }

  pointerLeave() {
    this.pointer.x = -9999;
    this.pointer.vx = this.pointer.vy = 0;
  }

  gust(x, y, power = 1) {
    const R = 260;
    for (const p of this.particles) {
      const dx = p.x - x;
      const dy = p.y - y;
      const d = Math.hypot(dx, dy) || 1;
      if (d < R) {
        const f = (1 - d / R) * 14 * power;
        p.vx += (dx / d) * f + 4 * power;
        p.vy += (dy / d) * f * 0.6;
      }
    }
    const n = this.reduced ? 2 : 5;
    for (let i = 0; i < n; i++) {
      this.swooshes.push(this.makeSwoosh(x - 40 + Math.random() * 30, y + (i - n / 2) * 22, 1.8));
    }
  }

  makeSwoosh(x, y, speed = 1) {
    return {
      x0: x,
      y0: y,
      head: 0,
      len: 160 + Math.random() * 220,
      amp: 6 + Math.random() * 12,
      freq: 0.012 + Math.random() * 0.01,
      speed: (3.2 + Math.random() * 2.5) * speed,
      life: 1,
      curl: Math.random() > 0.35,
      width: 2.5 + Math.random() * 1.5,
    };
  }

  step(dt) {
    const k = dt * 60;
    this.time += dt;
    const t = this.time;
    const P = this.pointer;
    for (const p of this.particles) {
      const [fx, fy] = this.flow(p.x, p.y, t);
      p.vx += (fx - p.vx) * 0.025 * k;
      p.vy += (fy - p.vy) * 0.025 * k;
      const dx = p.x - P.x;
      const dy = p.y - P.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 150 * 150) {
        const f = 1 - Math.sqrt(d2) / 150;
        p.vx += P.vx * 0.05 * f * k;
        p.vy += P.vy * 0.05 * f * k;
      }
      p.x += p.vx * k;
      p.y += p.vy * k;
      if (p.x > this.w + 20 || p.y < -20 || p.y > this.h + 20 || p.x < -40) Object.assign(p, this.makeParticle(false), p.x < -40 ? { x: this.w + 10 } : {});
    }
    P.vx *= 0.9;
    P.vy *= 0.9;

    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawnTimer = this.reduced ? 4 : 1.4 + Math.random() * 1.6;
      this.swooshes.push(this.makeSwoosh(-60 + Math.random() * this.w * 0.5, 40 + Math.random() * this.h * 0.6));
    }
    for (const s of this.swooshes) {
      s.head += s.speed * k;
      if (s.head > s.len * 1.6) s.life -= 0.02 * k;
    }
    this.swooshes = this.swooshes.filter((s) => s.life > 0 && s.x0 + s.head - s.len < this.w + 60);
  }

  draw() {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.lineCap = 'round';
    for (const p of this.particles) {
      const lower = p.y > this.h * 0.55;
      ctx.strokeStyle = lower ? `rgba(24,166,166,${p.alpha * 0.55})` : `rgba(255,255,255,${p.alpha})`;
      ctx.lineWidth = p.size;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 7, p.y - p.vy * 7);
      ctx.stroke();
    }
    for (const s of this.swooshes) this.drawSwoosh(s);
  }

  drawSwoosh(s) {
    const { ctx } = this;
    const tail = Math.max(0, s.head - s.len);
    const head = Math.min(s.head, s.len * 1.6);
    if (head <= tail) return;
    const yAt = (u) => s.y0 + Math.sin(u * s.freq * TAU * 0.5) * s.amp;
    ctx.strokeStyle = `rgba(255,255,255,${0.85 * s.life})`;
    ctx.lineWidth = s.width;
    ctx.beginPath();
    for (let u = tail; u <= head; u += 6) {
      const x = s.x0 + u;
      const y = yAt(u);
      u === tail ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    // little cartoon curl at the head
    if (s.curl && s.head > s.len * 0.6) {
      const hx = s.x0 + head;
      const hy = yAt(head);
      const r = 9;
      ctx.beginPath();
      ctx.arc(hx, hy - r, r, Math.PI / 2, Math.PI / 2 + Math.PI * 1.5 * Math.min(1, (s.head - s.len * 0.6) / 60), true);
      ctx.stroke();
    }
  }
}
