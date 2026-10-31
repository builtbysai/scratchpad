/* Revel Pad — brush shape registry.
   Each shape paints centered at (0,0) with an overall bounding size of ~s.
   Solid shapes use the context's current fillStyle; stroke shapes set their
   own lineWidth relative to s. rng is a per-stroke seeded random for the
   organic shapes so undo/autosave replay is deterministic. */

function poly(ctx, n, r, rot = -Math.PI / 2) {
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const a = rot + (i / n) * Math.PI * 2;
    const x = Math.cos(a) * r, y = Math.sin(a) * r;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath();
}

function starPath(ctx, points, r1, r2, rot = -Math.PI / 2) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? r1 : r2;
    const a = rot + (i / (points * 2)) * Math.PI * 2;
    const x = Math.cos(a) * r, y = Math.sin(a) * r;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath();
}

function ellipsePath(ctx, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.closePath();
}

export const SHAPES = {
  /* ---------------- Basic ---------------- */
  circle: { name: 'Circle', category: 'Basic', icon: '●',
    draw(ctx, s) { ctx.beginPath(); ctx.arc(0, 0, s / 2, 0, Math.PI * 2); ctx.fill(); } },
  square: { name: 'Square', category: 'Basic', icon: '■',
    draw(ctx, s) { ctx.fillRect(-s / 2, -s / 2, s, s); } },
  diamond: { name: 'Diamond', category: 'Basic', icon: '◆',
    draw(ctx, s) { poly(ctx, 4, s / 2, 0); ctx.fill(); } },
  triangle: { name: 'Triangle', category: 'Basic', icon: '▲',
    draw(ctx, s) { poly(ctx, 3, s / 2); ctx.fill(); } },
  rightTriangle: { name: 'Right Triangle', category: 'Basic', icon: '◣',
    draw(ctx, s) { ctx.beginPath(); ctx.moveTo(-s/2, s/2); ctx.lineTo(s/2, s/2); ctx.lineTo(-s/2, -s/2); ctx.closePath(); ctx.fill(); } },
  pentagon: { name: 'Pentagon', category: 'Basic', icon: '⬠',
    draw(ctx, s) { poly(ctx, 5, s / 2); ctx.fill(); } },
  hexagon: { name: 'Hexagon', category: 'Basic', icon: '⬡',
    draw(ctx, s) { poly(ctx, 6, s / 2); ctx.fill(); } },
  octagon: { name: 'Octagon', category: 'Basic', icon: '⯃',
    draw(ctx, s) { poly(ctx, 8, s / 2); ctx.fill(); } },
  ellipse: { name: 'Ellipse', category: 'Basic', icon: '⬯',
    draw(ctx, s) { ellipsePath(ctx, s / 2, s / 3.2); ctx.fill(); } },
  roundedRect: { name: 'Rounded Rect', category: 'Basic', icon: '▭',
    draw(ctx, s) {
      const w = s, h = s * 0.62, r = s * 0.16;
      ctx.beginPath();
      ctx.roundRect(-w/2, -h/2, w, h, r);
      ctx.fill();
    } },
  thinRect: { name: 'Thin Rect', category: 'Basic', icon: '▬',
    draw(ctx, s) { ctx.fillRect(-s / 2, -s * 0.09, s, s * 0.18); } },
  cross: { name: 'Cross', category: 'Basic', icon: '✚',
    draw(ctx, s) {
      const a = s * 0.32;
      ctx.beginPath();
      ctx.moveTo(-a/2, -s/2); ctx.lineTo(a/2, -s/2); ctx.lineTo(a/2, -a/2);
      ctx.lineTo(s/2, -a/2); ctx.lineTo(s/2, a/2); ctx.lineTo(a/2, a/2);
      ctx.lineTo(a/2, s/2); ctx.lineTo(-a/2, s/2); ctx.lineTo(-a/2, a/2);
      ctx.lineTo(-s/2, a/2); ctx.lineTo(-s/2, -a/2); ctx.lineTo(-a/2, -a/2);
      ctx.closePath(); ctx.fill();
    } },
  xShape: { name: 'X Shape', category: 'Basic', icon: '✕',
    draw(ctx, s) {
      const a = s * 0.24, h = s / 2;
      ctx.beginPath();
      for (const sgn of [1, -1]) {
        ctx.save(); ctx.rotate(sgn * Math.PI / 4);
        ctx.fillRect(-a/2, -h, a, h * 2);
        ctx.restore();
      }
    } },

  /* ---------------- Stars ---------------- */
  fiveStar: { name: '5-Point Star', category: 'Stars', icon: '★',
    draw(ctx, s) { starPath(ctx, 5, s / 2, s / 4.4); ctx.fill(); } },
  sixStar: { name: '6-Point Star', category: 'Stars', icon: '✶',
    draw(ctx, s) { starPath(ctx, 6, s / 2, s / 3.4); ctx.fill(); } },
  puffyStar: { name: 'Puffy Star', category: 'Stars', icon: '⭑',
    draw(ctx, s) {
      // star with rounded, inflated arms
      ctx.beginPath();
      const P = 5, r1 = s / 2, r2 = s / 3.1;
      for (let i = 0; i < P; i++) {
        const a = -Math.PI / 2 + (i / P) * Math.PI * 2;
        const ax = Math.cos(a) * r1, ay = Math.sin(a) * r1;
        const a2 = a + Math.PI / P;
        const bx = Math.cos(a2) * r2, by = Math.sin(a2) * r2;
        const a3 = a + (Math.PI * 2) / P;
        const cx = Math.cos(a3) * r1, cy = Math.sin(a3) * r1;
        if (i === 0) ctx.moveTo(ax, ay);
        ctx.quadraticCurveTo(bx, by, cx, cy);
      }
      ctx.closePath(); ctx.fill();
    } },
  starburst: { name: 'Starburst', category: 'Stars', icon: '✹',
    draw(ctx, s) { starPath(ctx, 12, s / 2, s / 3.6); ctx.fill(); } },
  sunburst: { name: 'Sunburst', category: 'Stars', icon: '☀',
    draw(ctx, s) {
      ctx.beginPath(); ctx.arc(0, 0, s / 5, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        ctx.save(); ctx.rotate(a);
        ctx.beginPath();
        ctx.moveTo(s / 5, -s / 22); ctx.lineTo(s / 2, 0); ctx.lineTo(s / 5, s / 22);
        ctx.closePath(); ctx.fill();
        ctx.restore();
      }
    } },
  sparkle: { name: 'Sparkle', category: 'Stars', icon: '✦',
    draw(ctx, s) {
      // four-point concave sparkle
      const r = s / 2, w = s * 0.10;
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.quadraticCurveTo(w, -w, r, 0);
      ctx.quadraticCurveTo(w, w, 0, r);
      ctx.quadraticCurveTo(-w, w, -r, 0);
      ctx.quadraticCurveTo(-w, -w, 0, -r);
      ctx.closePath(); ctx.fill();
    } },
  diamondShine: { name: 'Diamond Shine', category: 'Stars', icon: '💠',
    draw(ctx, s) {
      // tall faceted diamond
      ctx.beginPath();
      ctx.moveTo(0, -s/2); ctx.lineTo(s*0.32, 0); ctx.lineTo(0, s/2); ctx.lineTo(-s*0.32, 0);
      ctx.closePath(); ctx.fill();
    } },

  /* ---------------- Organic ---------------- */
  leaf: { name: 'Leaf', category: 'Organic', icon: '🍃',
    draw(ctx, s) {
      ctx.beginPath();
      ctx.moveTo(0, -s/2);
      ctx.quadraticCurveTo(s/2, -s/6, 0, s/2);
      ctx.quadraticCurveTo(-s/2, -s/6, 0, -s/2);
      ctx.fill();
    } },
  teardrop: { name: 'Teardrop', category: 'Organic', icon: '💧',
    draw(ctx, s) {
      ctx.beginPath();
      ctx.moveTo(0, -s/2);
      ctx.bezierCurveTo(s/2.4, -s/8, s/2.6, s/2.6, 0, s/2.6);
      ctx.bezierCurveTo(-s/2.6, s/2.6, -s/2.4, -s/8, 0, -s/2);
      ctx.fill();
    } },
  cloud: { name: 'Cloud', category: 'Organic', icon: '☁',
    draw(ctx, s) {
      const r = s / 6;
      for (const [dx, dy, rr] of [[-s/4, 0, r*1.5], [0, -s/8, r*2], [s/4, 0, r*1.5], [0, s/8, r*1.3]]) {
        ctx.beginPath(); ctx.arc(dx, dy, rr, 0, Math.PI * 2); ctx.fill();
      }
    } },
  flower: { name: 'Flower', category: 'Organic', icon: '🌸',
    draw(ctx, s) {
      for (let i = 0; i < 6; i++) {
        ctx.save(); ctx.rotate((i / 6) * Math.PI * 2);
        ellipsePath(ctx, s / 6, s / 4); ctx.fill();
        ctx.restore();
      }
      ctx.beginPath(); ctx.arc(0, 0, s / 8, 0, Math.PI * 2); ctx.fill();
    } },
  petal: { name: 'Petal', category: 'Organic', icon: '🌷',
    draw(ctx, s) {
      ctx.beginPath();
      ctx.moveTo(0, -s/2);
      ctx.quadraticCurveTo(s/2.6, 0, 0, s/2);
      ctx.quadraticCurveTo(-s/2.6, 0, 0, -s/2);
      ctx.fill();
    } },
  flame: { name: 'Flame', category: 'Organic', icon: '🔥',
    draw(ctx, s) {
      ctx.beginPath();
      ctx.moveTo(0, -s/2);
      ctx.bezierCurveTo(s/3, -s/4, s/2.2, 0, s/4, s/4);
      ctx.bezierCurveTo(s/8, s/2.2, -s/8, s/2.2, -s/4, s/4);
      ctx.bezierCurveTo(-s/2.2, 0, -s/3, -s/4, 0, -s/2);
      ctx.fill();
    } },
  smokePuff: { name: 'Smoke Puff', category: 'Organic', icon: '💨',
    draw(ctx, s, rng) {
      for (let i = 0; i < 7; i++) {
        const a = rng() * Math.PI * 2, d = rng() * s * 0.22;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * d, Math.sin(a) * d, s * (0.10 + rng() * 0.12), 0, Math.PI * 2);
        ctx.fill();
      }
    } },
  snowflake: { name: 'Snowflake', category: 'Organic', icon: '❄',
    draw(ctx, s) {
      ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = Math.max(1, s * 0.045); ctx.lineCap = 'round';
      for (let i = 0; i < 6; i++) {
        ctx.save(); ctx.rotate((i / 6) * Math.PI * 2);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -s/2); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -s/3); ctx.lineTo(-s/8, -s/3 - s/8);
        ctx.moveTo(0, -s/3); ctx.lineTo(s/8, -s/3 - s/8);
        ctx.stroke(); ctx.restore();
      }
    } },
  bubble: { name: 'Bubble', category: 'Organic', icon: '🫧',
    draw(ctx, s) { ctx.beginPath(); ctx.arc(0, 0, s / 2.4, 0, Math.PI * 2); ctx.fill(); } },

  /* ---------------- Artistic ---------------- */
  splatter: { name: 'Paint Splatter', category: 'Artistic', icon: '🎨',
    draw(ctx, s, rng) {
      ctx.beginPath(); ctx.arc(0, 0, s * 0.22, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 9; i++) {
        const a = rng() * Math.PI * 2, d = s * (0.12 + rng() * 0.38);
        ctx.beginPath();
        ctx.arc(Math.cos(a) * d, Math.sin(a) * d, s * (0.03 + rng() * 0.07), 0, Math.PI * 2);
        ctx.fill();
      }
    } },
  inkBlot: { name: 'Ink Blot', category: 'Artistic', icon: '🖋',
    draw(ctx, s, rng) {
      ctx.beginPath();
      const n = 14;
      for (let i = 0; i <= n; i++) {
        const a = (i / n) * Math.PI * 2;
        const r = s * (0.30 + rng() * 0.20);
        const x = Math.cos(a) * r, y = Math.sin(a) * r;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath(); ctx.fill();
    } },
  roughBlob: { name: 'Rough Blob', category: 'Artistic', icon: '🪨',
    draw(ctx, s, rng) {
      ctx.beginPath();
      const n = 10;
      for (let i = 0; i <= n; i++) {
        const a = (i / n) * Math.PI * 2;
        const r = s * (0.34 + rng() * 0.16);
        const x = Math.cos(a) * r, y = Math.sin(a) * r * 0.9;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath(); ctx.fill();
    } },
  grainyTexture: { name: 'Grainy Texture', category: 'Artistic', icon: '🧂',
    draw(ctx, s, rng) {
      for (let i = 0; i < 60; i++) {
        const a = rng() * Math.PI * 2, d = Math.sqrt(rng()) * s * 0.42;
        ctx.fillRect(Math.cos(a) * d, Math.sin(a) * d, Math.max(1, s * 0.02), Math.max(1, s * 0.02));
      }
    } },
  hairline: { name: 'Hairline', category: 'Artistic', icon: '╱',
    draw(ctx, s) {
      ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = Math.max(1, s * 0.02); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-s/2, s/2); ctx.lineTo(s/2, -s/2); ctx.stroke();
    } },
  calligraphy: { name: 'Calligraphy', category: 'Artistic', icon: '🖌',
    draw(ctx, s) {
      ctx.save(); ctx.rotate(-Math.PI / 4);
      ctx.beginPath(); ctx.ellipse(0, 0, s / 2, s / 10, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } },
  markerChisel: { name: 'Marker Chisel', category: 'Artistic', icon: '🖍',
    draw(ctx, s) {
      ctx.save(); ctx.rotate(Math.PI / 4);
      ctx.fillRect(-s/2, -s*0.11, s, s*0.22);
      ctx.restore();
    } },
  chalkGrain: { name: 'Chalk Grain', category: 'Artistic', icon: '◌',
    draw(ctx, s, rng) {
      for (let i = 0; i < 26; i++) {
        const x = (rng() - 0.5) * s, y = (rng() - 0.5) * s * 0.7;
        ctx.beginPath(); ctx.arc(x, y, s * (0.02 + rng() * 0.05), 0, Math.PI * 2); ctx.fill();
      }
    } },
  pixelBlock: { name: 'Pixel Block', category: 'Artistic', icon: '🔲',
    draw(ctx, s, rng) {
      const cell = s / 5;
      for (let gy = 0; gy < 5; gy++) for (let gx = 0; gx < 5; gx++) {
        if (rng() < 0.72) ctx.fillRect(gx * cell - s/2, gy * cell - s/2, cell * 0.92, cell * 0.92);
      }
    } },

  /* ---------------- Motion ---------------- */
  spiral: { name: 'Spiral', category: 'Motion', icon: '🌀',
    draw(ctx, s) {
      ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = Math.max(1.5, s * 0.05); ctx.lineCap = 'round';
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 6; a += 0.1) {
        const r = (a / (Math.PI * 6)) * s * 0.48;
        const x = Math.cos(a) * r, y = Math.sin(a) * r;
        a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    } },
  swirl: { name: 'Mini Swirl', category: 'Motion', icon: '🍥',
    draw(ctx, s) {
      ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = Math.max(1.5, s * 0.07); ctx.lineCap = 'round';
      for (const dir of [1, -1]) {
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 3; a += 0.15) {
          const r = (a / (Math.PI * 3)) * s * 0.4;
          const x = Math.cos(a * dir) * r, y = Math.sin(a * dir) * r;
          a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    } },
  cometTail: { name: 'Comet Tail', category: 'Motion', icon: '☄',
    draw(ctx, s) {
      ctx.beginPath(); ctx.arc(-s/5, 0, s/5, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 3; i++) {
        const w = s * (0.16 - i * 0.04);
        ctx.beginPath();
        ctx.moveTo(-s/5, -w/2); ctx.lineTo(s/2, -w/6); ctx.lineTo(s/2, w/6); ctx.lineTo(-s/5, w/2);
        ctx.closePath(); ctx.fill();
      }
    } },
  lightning: { name: 'Lightning', category: 'Motion', icon: '⚡',
    draw(ctx, s) {
      const h = s / 2, w = s * 0.16;
      ctx.beginPath();
      ctx.moveTo(w, -h); ctx.lineTo(-w*0.7, -h*0.1); ctx.lineTo(w*0.5, -h*0.1);
      ctx.lineTo(-w, h); ctx.lineTo(w*0.7, h*0.1); ctx.lineTo(-w*0.5, h*0.1);
      ctx.closePath(); ctx.fill();
    } },
  wave: { name: 'Wave', category: 'Motion', icon: '〰',
    draw(ctx, s) {
      ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = Math.max(2, s * 0.08); ctx.lineCap = 'round';
      ctx.beginPath();
      for (let x = -s/2; x <= s/2; x += s/40) {
        const y = Math.sin((x / s) * Math.PI * 3) * s * 0.18;
        x === -s/2 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    } },
  crescent: { name: 'Crescent', category: 'Motion', icon: '🌙',
    draw(ctx, s) {
      // even-odd: outer disc minus offset disc = crescent; erases exactly that
      ctx.beginPath();
      ctx.arc(0, 0, s/2, 0, Math.PI * 2);
      ctx.moveTo(s/5 + s*0.42, -s/8);
      ctx.arc(s/5, -s/8, s*0.42, 0, Math.PI * 2);
      ctx.fill('evenodd');
    } },
  sCurve: { name: 'S Curve', category: 'Motion', icon: '↝',
    draw(ctx, s) {
      ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = Math.max(2, s * 0.1); ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-s/2, s/4);
      ctx.bezierCurveTo(-s/4, -s/2, s/4, s/2, s/2, -s/4);
      ctx.stroke();
    } },

  /* ---------------- Cute ---------------- */
  heart: { name: 'Heart', category: 'Cute', icon: '♥',
    draw(ctx, s) {
      const w = s / 2;
      ctx.beginPath();
      ctx.moveTo(0, w * 0.75);
      ctx.bezierCurveTo(-w * 1.3, -w * 0.1, -w * 0.55, -w * 0.95, 0, -w * 0.35);
      ctx.bezierCurveTo(w * 0.55, -w * 0.95, w * 1.3, -w * 0.1, 0, w * 0.75);
      ctx.fill();
    } },
  starHeart: { name: 'Star Heart', category: 'Cute', icon: '💖',
    draw(ctx, s) {
      starPath(ctx, 5, s / 2, s / 4.2); ctx.fill();
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      starPath(ctx, 5, s / 3.4, s / 6.4); ctx.fill();
      ctx.restore();
    } },
  smiley: { name: 'Smiley', category: 'Cute', icon: '☺',
    // silhouette-only: under erase compositing the face knocks out nothing;
    // the stamp reads as a round dab, exactly as the original behaved
    draw(ctx, s) { ctx.beginPath(); ctx.arc(0, 0, s/2, 0, Math.PI * 2); ctx.fill(); } },
  emoji: { name: 'Emoji', category: 'Cute', icon: '😊',
    draw(ctx, s) { ctx.beginPath(); ctx.arc(0, 0, s/2.1, 0, Math.PI * 2); ctx.fill(); } },
  pawPrint: { name: 'Paw Print', category: 'Cute', icon: '🐾',
    draw(ctx, s) {
      ellipsePath(ctx, s/5, s/4); ctx.fill();
      ctx.save(); ctx.translate(0, s/8); ctx.restore();
      for (let i = -1.5; i <= 1.5; i++) {
        const a = -Math.PI/2 + i * 0.5;
        ctx.beginPath();
        ctx.ellipse(Math.cos(a) * s/3.1, Math.sin(a) * s/3.1 - s/14, s/9, s/7, a, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath(); ctx.ellipse(0, s/10, s/4.6, s/3.8, 0, 0, Math.PI * 2); ctx.fill();
    } },
  butterfly: { name: 'Butterfly', category: 'Cute', icon: '🦋',
    draw(ctx, s) {
      for (const m of [1, -1]) {
        ctx.save(); ctx.scale(m, 1);
        ctx.beginPath(); ctx.ellipse(s/4.4, -s/6, s/4, s/5.4, 0.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(s/4.8, s/5, s/5, s/7, -0.4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      ctx.fillRect(-s/40, -s/3, s/20, s/1.5);
    } },
  balloon: { name: 'Balloon', category: 'Cute', icon: '🎈',
    draw(ctx, s) {
      ctx.beginPath(); ctx.ellipse(0, -s/8, s/3, s/2.6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-s/14, s/4.4); ctx.lineTo(s/14, s/4.4); ctx.lineTo(0, s/3.4); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = Math.max(1, s/40);
      ctx.beginPath(); ctx.moveTo(0, s/4.4); ctx.quadraticCurveTo(s/6, s/2.6, 0, s/2); ctx.stroke();
    } },
  musicNote: { name: 'Music Note', category: 'Cute', icon: '♪',
    draw(ctx, s) {
      ctx.beginPath(); ctx.ellipse(-s/6, s/4, s/6, s/8, -0.3, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(s/14 - s/40, -s/2.4, s/20, s/1.7);
      ctx.beginPath();
      ctx.moveTo(s/14 - s/40, -s/2.4); ctx.quadraticCurveTo(s/2.6, -s/2.2, s/3, -s/6);
      ctx.quadraticCurveTo(s/4, -s/3.4, s/14 + s/40, -s/3.2);
      ctx.lineTo(s/14 + s/40, -s/4.2);
      ctx.quadraticCurveTo(s/5, -s/4.4, s/2.8, -s/3.4);
      ctx.closePath(); ctx.fill();
    } },

  /* ---------------- Symbols ---------------- */
  playButton: { name: 'Play', category: 'Symbols', icon: '▶',
    draw(ctx, s) {
      ctx.beginPath(); ctx.arc(0, 0, s/2, 0, Math.PI * 2); ctx.fill();
      ctx.save();
      // triangle knocked via even-odd so the stamp stays one silhouette
      ctx.beginPath();
      ctx.arc(0, 0, s/2, 0, Math.PI * 2);
      ctx.moveTo(-s/8, -s/4); ctx.lineTo(s/4, 0); ctx.lineTo(-s/8, s/4); ctx.closePath();
      ctx.fill('evenodd');
      ctx.restore();
    } },
  checkMark: { name: 'Check', category: 'Symbols', icon: '✓',
    draw(ctx, s) {
      ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = s * 0.14; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(-s/3, 0); ctx.lineTo(-s/10, s/3); ctx.lineTo(s/3, -s/3);
      ctx.stroke();
    } },
  arrowThin: { name: 'Arrow Thin', category: 'Symbols', icon: '→',
    draw(ctx, s) {
      ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = Math.max(1.5, s * 0.06); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(-s/2, 0); ctx.lineTo(s/2, 0);
      ctx.moveTo(s/4, -s/5); ctx.lineTo(s/2, 0); ctx.lineTo(s/4, s/5);
      ctx.stroke();
    } },
  arrowThick: { name: 'Arrow Thick', category: 'Symbols', icon: '➔',
    draw(ctx, s) {
      const h = s / 2, sh = s * 0.14;
      ctx.beginPath();
      ctx.moveTo(-h, -sh); ctx.lineTo(h - s*0.28, -sh); ctx.lineTo(h - s*0.28, -s*0.26);
      ctx.lineTo(h, 0); ctx.lineTo(h - s*0.28, s*0.26); ctx.lineTo(h - s*0.28, sh);
      ctx.lineTo(-h, sh); ctx.closePath(); ctx.fill();
    } },
  gearCog: { name: 'Gear', category: 'Symbols', icon: '⚙',
    draw(ctx, s) {
      const teeth = 8, r1 = s/2, r2 = s/3.2, steps = teeth * 4;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const seg = i % 4;
        const r = (seg === 0 || seg === 1) ? r1 : r2;
        const x = Math.cos(a) * r, y = Math.sin(a) * r;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath();
      ctx.moveTo(r2 * 0.5, 0);
      ctx.arc(0, 0, r2 * 0.5, 0, Math.PI * 2);
      ctx.fill('evenodd');
    } },
  infinity: { name: 'Infinity', category: 'Symbols', icon: '∞',
    draw(ctx, s) {
      ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = Math.max(2, s * 0.1); ctx.lineCap = 'round';
      ctx.beginPath();
      const w = s / 4;
      // lemniscate-ish: two tangent circles stroked
      ctx.arc(-w/1.4, 0, w/1.4, 0, Math.PI * 2);
      ctx.moveTo(w/1.4 + w/1.4, 0);
      ctx.arc(w/1.4, 0, w/1.4, 0, Math.PI * 2);
      ctx.stroke();
    } },
  hashtag: { name: 'Hashtag', category: 'Symbols', icon: '#',
    draw(ctx, s) {
      ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = Math.max(2, s * 0.08); ctx.lineCap = 'round';
      const o = s * 0.14;
      for (const dx of [-o, o]) {
        ctx.beginPath(); ctx.moveTo(dx - s*0.08, -s/2); ctx.lineTo(dx + s*0.08, s/2); ctx.stroke();
      }
      for (const dy of [-o, o]) {
        ctx.beginPath(); ctx.moveTo(-s/2, dy); ctx.lineTo(s/2, dy); ctx.stroke();
      }
    } },
  atSymbol: { name: 'At Symbol', category: 'Symbols', icon: '@',
    draw(ctx, s) {
      ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = Math.max(1.5, s * 0.07);
      ctx.beginPath(); ctx.arc(0, 0, s*0.32, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, s*0.13, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s*0.32, 0); ctx.lineTo(s*0.32, -s*0.42); ctx.stroke();
    } },

  /* ---------------- Patterns (tile stamps) ---------------- */
  honeycombHex: { name: 'Honeycomb', category: 'Patterns', icon: '⬡',
    draw(ctx, s) {
      const r = s / 5;
      for (let row = -2; row <= 2; row++) for (let col = -2; col <= 2; col++) {
        const x = col * r * 1.74 + (row % 2 ? r * 0.87 : 0);
        const y = row * r * 1.5;
        if (Math.hypot(x, y) > s * 0.55) continue;
        ctx.save(); ctx.translate(x, y);
        poly(ctx, 6, r * 0.9); ctx.fill();
        ctx.restore();
      }
    } },
  mosaicTile: { name: 'Mosaic', category: 'Patterns', icon: '◫',
    draw(ctx, s, rng) {
      const n = 4, cell = s / n;
      for (let gy = 0; gy < n; gy++) for (let gx = 0; gx < n; gx++) {
        if (rng() < 0.85) {
          ctx.save();
          ctx.globalAlpha = 0.55 + rng() * 0.45;
          ctx.fillRect(gx * cell - s/2, gy * cell - s/2, cell * 0.9, cell * 0.9);
          ctx.restore();
        }
      }
    } },
  dotCluster: { name: 'Dot Cluster', category: 'Patterns', icon: '⋮⋮',
    draw(ctx, s, rng) {
      for (let i = 0; i < 16; i++) {
        const a = rng() * Math.PI * 2, d = Math.sqrt(rng()) * s * 0.42;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * d, Math.sin(a) * d, s * (0.03 + rng() * 0.05), 0, Math.PI * 2);
        ctx.fill();
      }
    } },
  lattice: { name: 'Lattice', category: 'Patterns', icon: '▦',
    draw(ctx, s) {
      ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = Math.max(1.5, s * 0.03);
      const n = 5, cell = s / n;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const p = -s/2 + i * cell;
        ctx.moveTo(p, -s/2); ctx.lineTo(p, s/2);
        ctx.moveTo(-s/2, p); ctx.lineTo(s/2, p);
      }
      ctx.stroke();
    } },
  concentricCircles: { name: 'Concentric', category: 'Patterns', icon: '◎',
    draw(ctx, s) {
      ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = Math.max(1.5, s * 0.035);
      for (let r = s/2; r > 0; r -= s/8) {
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
      }
    } },
  stripeHorizontal: { name: 'H-Stripes', category: 'Patterns', icon: '☰',
    draw(ctx, s) {
      const n = 5, h = s / (n * 2);
      for (let i = 0; i < n; i++) ctx.fillRect(-s/2, -s/2 + i * 2 * h, s, h);
    } },
  stripeVertical: { name: 'V-Stripes', category: 'Patterns', icon: '⋮',
    draw(ctx, s) {
      const n = 5, w = s / (n * 2);
      for (let i = 0; i < n; i++) ctx.fillRect(-s/2 + i * 2 * w, -s/2, w, s);
    } },
  zigzagStamp: { name: 'Zigzag', category: 'Patterns', icon: '﹏',
    draw(ctx, s) {
      ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = Math.max(2, s * 0.07); ctx.lineJoin = 'round';
      ctx.beginPath();
      const n = 6;
      for (let i = 0; i <= n; i++) {
        const x = -s/2 + (i / n) * s, y = (i % 2 ? -1 : 1) * s * 0.22;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
    } },
  wavyBand: { name: 'Wavy Band', category: 'Patterns', icon: '〜',
    draw(ctx, s) {
      for (const off of [-s*0.18, 0, s*0.18]) {
        ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = Math.max(2, s * 0.06); ctx.lineCap = 'round';
        ctx.beginPath();
        for (let x = -s/2; x <= s/2; x += s/40) {
          const y = off + Math.sin((x / s) * Math.PI * 4) * s * 0.08;
          x === -s/2 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    } },
  checkerSquare: { name: 'Checker', category: 'Patterns', icon: '◩',
    draw(ctx, s) {
      const n = 4, cell = s / n;
      for (let gy = 0; gy < n; gy++) for (let gx = 0; gx < n; gx++) {
        if ((gx + gy) % 2 === 0) ctx.fillRect(gx * cell - s/2, gy * cell - s/2, cell, cell);
      }
    } },
};

export const SHAPE_CATEGORIES = ['Basic', 'Stars', 'Organic', 'Artistic', 'Motion', 'Cute', 'Symbols', 'Patterns'];

export function shapeCount() { return Object.keys(SHAPES).length; }
