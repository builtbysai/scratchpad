/* Revel Pad — studio engine.
   Layers: art (the hidden artwork) under foil (the scratch cover).
   Every brush dab either erases foil (scratch) or paints foil back (restore).
   Undo = foil snapshots; autosave = settings + stroke replay (seeded). */

import { SHAPES } from './shapes.js';
import { PATTERNS } from './patterns.js';
import { mulberry32, randomSeed } from './rng.js';
import { ensureAudio, playScratch, playRestore } from './audio.js';

export const ART_W = 1200;
export const ART_H = 800;
const UNDO_CAP = 30;
const FOIL_BASE = '#35302a';

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

export class Studio {
  constructor(displayCanvas) {
    this.view = displayCanvas;
    this.vctx = displayCanvas.getContext('2d');
    this.art = makeCanvas(ART_W, ART_H);
    this.foil = makeCanvas(ART_W, ART_H);
    this.fctx = this.foil.getContext('2d', { willReadFrequently: true });

    this.pattern = 'diagonal-rainbow';
    this.artSeed = randomSeed();
    this.customImage = null;

    this.brush = { shape: 'circle', size: 90, rotation: 0, smoothing: 14 };
    this.mode = 'scratch'; // | 'restore'
    this.particlesOn = true;
    this.soundOn = true;

    this.strokes = [];
    this.undoStack = [];
    this.redoStack = [];
    this.activeStroke = null;

    this.view_ = { scale: 1, tx: 0, ty: 0 };
    this.particles = [];
    this.dirty = true;
    this.onChange = null; // (info) => void — step count, undo/redo state

    this.paintArt();
    this.resetFoil(false);
    this.loop();
  }

  /* ---------------- layers ---------------- */

  paintArt() {
    const ctx = this.art.getContext('2d');
    const rng = mulberry32(this.artSeed);
    if (this.pattern === 'custom' && this.customImage) {
      // cover-fit the uploaded image
      const img = this.customImage;
      const s = Math.max(ART_W / img.width, ART_H / img.height);
      const dw = img.width * s, dh = img.height * s;
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, ART_W, ART_H);
      ctx.drawImage(img, (ART_W - dw) / 2, (ART_H - dh) / 2, dw, dh);
    } else {
      const p = PATTERNS[this.pattern] || PATTERNS['diagonal-rainbow'];
      p.paint(ctx, ART_W, ART_H, rng);
    }
    this.dirty = true;
  }

  resetFoil(record = true) {
    if (record) this.pushUndo();
    const ctx = this.fctx;
    // brushed-metal foil, warmed to sit with the brass UI
    const g = ctx.createLinearGradient(0, 0, ART_W, ART_H);
    g.addColorStop(0, '#403a30'); g.addColorStop(0.5, '#2d2921');
    g.addColorStop(1, '#3a342a');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = g; ctx.fillRect(0, 0, ART_W, ART_H);
    // fine grain
    const rng = mulberry32(1234);
    for (let i = 0; i < 5200; i++) {
      const v = 42 + rng() * 30;
      ctx.fillStyle = `rgba(${v},${v - 4},${v - 10},0.16)`;
      ctx.fillRect(rng() * ART_W, rng() * ART_H, 1.6, 1.6);
    }
    // diagonal sheen
    const sheen = ctx.createLinearGradient(0, 0, ART_W, 0);
    sheen.addColorStop(0.42, 'rgba(255,255,255,0)');
    sheen.addColorStop(0.5, 'rgba(255,255,255,0.06)');
    sheen.addColorStop(0.58, 'rgba(255,255,255,0)');
    ctx.fillStyle = sheen; ctx.fillRect(0, 0, ART_W, ART_H);
    // watermark
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#d8cdb4';
    ctx.font = '700 44px Georgia, serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('S C R A T C H   T O   R E V E A L', ART_W / 2, ART_H / 2);
    ctx.font = '400 20px Georgia, serif';
    ctx.globalAlpha = 0.35;
    ctx.fillText('— revel pad —', ART_W / 2, ART_H / 2 + 52);
    ctx.restore();
    this.strokes = [];
    this.redoStack = [];
    this.dirty = true;
    this.emit();
  }

  setPattern(key) {
    this.pattern = key;
    this.artSeed = randomSeed();
    this.paintArt();
    this.emit();
  }

  setCustomImage(img) {
    this.customImage = img;
    this.pattern = 'custom';
    this.paintArt();
    this.emit();
  }

  /* ---------------- strokes ---------------- */

  screenToWorld(sx, sy) {
    const r = this.view.getBoundingClientRect();
    const dpr = this.dpr || 1;
    const v = this.view_;
    return {
      x: ((sx - r.left) * dpr - v.tx) / v.scale,
      y: ((sy - r.top) * dpr - v.ty) / v.scale,
    };
  }

  pushUndo() {
    const snap = makeCanvas(ART_W, ART_H);
    snap.getContext('2d').drawImage(this.foil, 0, 0);
    this.undoStack.push(snap);
    if (this.undoStack.length > UNDO_CAP) this.undoStack.shift();
    this.redoStack = [];
  }

  beginStroke(wx, wy) {
    ensureAudio();
    this.pushUndo();
    this.activeStroke = {
      shape: this.brush.shape,
      size: this.brush.size,
      rotation: this.brush.rotation,
      mode: this.mode,
      seed: randomSeed(),
      points: [[wx, wy]],
    };
    this.stamp(wx, wy, this.activeStroke, mulberry32(this.activeStroke.seed));
    this.lastPt = [wx, wy];
  }

  addPoint(wx, wy) {
    const st = this.activeStroke;
    if (!st) return;
    const [lx, ly] = this.lastPt;
    const dist = Math.hypot(wx - lx, wy - ly);
    const stepPx = Math.max(2, this.brush.smoothing);
    const steps = Math.max(1, Math.min(64, Math.round(dist / stepPx)));
    const rng = mulberry32(st.seed + st.points.length);
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const x = lx + (wx - lx) * t, y = ly + (wy - ly) * t;
      st.points.push([x, y]);
      this.stamp(x, y, st, rng);
    }
    this.lastPt = [wx, wy];
    // feel: particles + sound scaled by speed
    const speed = Math.min(1, dist / 60);
    if (this.particlesOn) this.spawnParticles(wx, wy, speed, st.mode);
    if (this.soundOn) {
      if (st.mode === 'scratch') playScratch(speed); else playRestore(speed);
    }
    this.dirty = true;
  }

  endStroke() {
    const st = this.activeStroke;
    this.activeStroke = null;
    if (st && st.points.length > 0) {
      this.strokes.push(st);
      this.emit();
    }
    this.dirty = true;
  }

  stamp(wx, wy, st, rng) {
    const ctx = this.fctx;
    const shape = SHAPES[st.shape] || SHAPES.circle;
    ctx.save();
    ctx.translate(wx, wy);
    ctx.rotate((st.rotation * Math.PI) / 180);
    if (st.mode === 'scratch') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = '#000';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = FOIL_BASE;
    }
    shape.draw(ctx, st.size, rng);
    ctx.restore();
    this.dirty = true;
  }

  undo() {
    if (!this.undoStack.length) return false;
    const snap = makeCanvas(ART_W, ART_H);
    snap.getContext('2d').drawImage(this.foil, 0, 0);
    this.redoStack.push(snap);
    const prev = this.undoStack.pop();
    this.fctx.save();
    this.fctx.globalCompositeOperation = 'source-over';
    this.fctx.clearRect(0, 0, ART_W, ART_H);
    this.fctx.drawImage(prev, 0, 0);
    this.fctx.restore();
    this.strokes.pop();
    this.dirty = true;
    this.emit();
    return true;
  }

  redo() {
    if (!this.redoStack.length) return false;
    const snap = makeCanvas(ART_W, ART_H);
    snap.getContext('2d').drawImage(this.foil, 0, 0);
    this.undoStack.push(snap);
    const next = this.redoStack.pop();
    this.fctx.save();
    this.fctx.globalCompositeOperation = 'source-over';
    this.fctx.clearRect(0, 0, ART_W, ART_H);
    this.fctx.drawImage(next, 0, 0);
    this.fctx.restore();
    this.dirty = true;
    this.emit();
    return true;
  }

  /* ---------------- particles ---------------- */

  spawnParticles(wx, wy, speed, mode) {
    // world -> screen for the particle overlay (drawn in screen space)
    const r = this.view.getBoundingClientRect();
    const v = this.view_;
    const sx = wx * v.scale + v.tx, sy = wy * v.scale + v.ty;
    const n = 2 + Math.round(speed * 5);
    for (let i = 0; i < n; i++) {
      this.particles.push({
        x: sx + (Math.random() - 0.5) * 8,
        y: sy + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 90,
        vy: -30 - Math.random() * 70,
        life: 0.5 + Math.random() * 0.4,
        age: 0,
        color: mode === 'scratch' ? '217,176,106' : '150,155,165',
        size: 1 + Math.random() * 2.4,
      });
    }
    if (this.particles.length > 420) this.particles.splice(0, this.particles.length - 420);
  }

  /* ---------------- view ---------------- */

  fitView() {
    const r = this.view.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.view.width = Math.round(r.width * dpr);
    this.view.height = Math.round(r.height * dpr);
    const s = Math.min(r.width / ART_W, r.height / ART_H);
    this.view_ = {
      scale: s * dpr,
      tx: (r.width * dpr - ART_W * s * dpr) / 2,
      ty: (r.height * dpr - ART_H * s * dpr) / 2,
    };
    this.dpr = dpr;
    this.dirty = true;
  }

  zoomAt(sx, sy, factor) {
    const r = this.view.getBoundingClientRect();
    const dpr = this.dpr || 1;
    const px = (sx - r.left) * dpr, py = (sy - r.top) * dpr;
    const v = this.view_;
    const ns = Math.min(8 * dpr, Math.max(0.2 * dpr, v.scale * factor));
    const k = ns / v.scale;
    v.tx = px - (px - v.tx) * k;
    v.ty = py - (py - v.ty) * k;
    v.scale = ns;
    this.dirty = true;
    this.emit();
  }

  panBy(dx, dy) {
    const dpr = this.dpr || 1;
    this.view_.tx += dx * dpr;
    this.view_.ty += dy * dpr;
    this.dirty = true;
  }

  /* ---------------- render loop ---------------- */

  loop() {
    let last = performance.now();
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // particles
      if (this.particles.length) {
        for (const p of this.particles) {
          p.age += dt;
          p.x += p.vx * dt; p.y += p.vy * dt;
          p.vy += 260 * dt;
        }
        this.particles = this.particles.filter((p) => p.age < p.life);
        this.dirty = true;
      }
      if (this.dirty) this.render();
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  render() {
    this.dirty = false;
    const ctx = this.vctx, v = this.view_;
    const W = this.view.width, H = this.view.height;
    ctx.save();
    ctx.fillStyle = '#0b0906';
    ctx.fillRect(0, 0, W, H);
    ctx.translate(v.tx, v.ty);
    ctx.scale(v.scale, v.scale);
    // soft shadow under the card
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.65)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 18;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, ART_W, ART_H);
    ctx.restore();
    ctx.drawImage(this.art, 0, 0);
    ctx.drawImage(this.foil, 0, 0);
    ctx.restore();
    // particles in screen space
    for (const p of this.particles) {
      const a = 1 - p.age / p.life;
      ctx.fillStyle = `rgba(${p.color},${(a * 0.85).toFixed(3)})`;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
  }

  /* ---------------- export / persistence ---------------- */

  composite() {
    const c = makeCanvas(ART_W, ART_H);
    const ctx = c.getContext('2d');
    ctx.drawImage(this.art, 0, 0);
    ctx.drawImage(this.foil, 0, 0);
    return c;
  }

  exportBlob() {
    return new Promise((res) => this.composite().toBlob(res, 'image/png'));
  }

  serialize() {
    return {
      v: 1,
      pattern: this.pattern,
      artSeed: this.artSeed,
      brush: this.brush,
      mode: this.mode,
      strokes: this.strokes,
    };
  }

  restore(data) {
    if (!data || data.v !== 1) return false;
    this.pattern = data.pattern || this.pattern;
    this.artSeed = data.artSeed ?? randomSeed();
    Object.assign(this.brush, data.brush || {});
    this.mode = data.mode || 'scratch';
    this.paintArt();
    this.resetFoil(false);
    this.undoStack = [];
    this.redoStack = [];
    // replay strokes deterministically
    for (const st of data.strokes || []) {
      const rng = mulberry32(st.seed);
      for (const [x, y] of st.points) this.stamp(x, y, st, rng);
      this.strokes.push(st);
    }
    this.dirty = true;
    this.emit();
    return true;
  }

  emit() {
    if (this.onChange) this.onChange({
      steps: this.strokes.length,
      canUndo: this.undoStack.length > 0,
      canRedo: this.redoStack.length > 0,
      zoom: this.view_.scale / (this.dpr || 1),
    });
  }

  /* test helper: fraction of foil pixels with alpha < 128 */
  clearedRatio(sample = 48) {
    const img = this.fctx.getImageData(0, 0, ART_W, ART_H).data;
    let clear = 0, total = 0;
    const sx = Math.floor(ART_W / sample), sy = Math.floor(ART_H / sample);
    for (let y = 0; y < ART_H; y += sy) for (let x = 0; x < ART_W; x += sx) {
      total++;
      if (img[(y * ART_W + x) * 4 + 3] < 128) clear++;
    }
    return clear / total;
  }
}
