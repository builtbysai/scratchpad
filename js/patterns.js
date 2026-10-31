/* Revel Pad — artwork pattern registry.
   Each pattern paints the full art layer: paint(ctx, w, h, rng).
   rng is a seeded random so a given pattern always renders identically. */

function hsb(h, s, b, a = 1) { return `hsla(${h},${s}%,${b}%,${a})`; }

function rainbowStops(n, s = 90, b = 60) {
  const stops = [];
  for (let i = 0; i <= n; i++) stops.push(hsb((i / n) * 360, s, b));
  return stops;
}

function applyStops(grad, stops) {
  stops.forEach((c, i) => grad.addColorStop(i / (stops.length - 1), c));
}

export const PATTERNS = {
  /* ---------------- Rainbow Stripes ---------------- */
  'diagonal-rainbow': { name: 'Diagonal Rainbow', category: 'Rainbow Stripes',
    paint(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, w, h);
      applyStops(g, rainbowStops(12));
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    } },
  'vertical-gradient': { name: 'Vertical Spectrum', category: 'Rainbow Stripes',
    paint(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      applyStops(g, rainbowStops(10));
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    } },
  'wavy-rainbow': { name: 'Wavy Rainbow', category: 'Rainbow Stripes',
    paint(ctx, w, h) {
      ctx.fillStyle = '#111'; ctx.fillRect(0, 0, w, h);
      const bands = 14, bh = h / bands;
      for (let i = 0; i < bands; i++) {
        ctx.fillStyle = hsb((i / bands) * 360, 85, 58);
        ctx.beginPath();
        for (let x = 0; x <= w; x += 8) {
          const y = i * bh + Math.sin((x / w) * Math.PI * 4 + i) * bh * 0.45;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        for (let x = w; x >= 0; x -= 8) {
          const y = i * bh + bh + Math.sin((x / w) * Math.PI * 4 + i) * bh * 0.45;
          ctx.lineTo(x, y);
        }
        ctx.closePath(); ctx.fill();
      }
    } },
  'vertical-bars': { name: 'Rainbow Bars', category: 'Rainbow Stripes',
    paint(ctx, w, h) {
      const n = 16, bw = w / n;
      for (let i = 0; i < n; i++) {
        ctx.fillStyle = hsb((i / n) * 360, 85, 58);
        ctx.fillRect(i * bw, 0, bw + 1, h);
      }
    } },
  'horizontal-gradient': { name: 'Horizontal Spectrum', category: 'Rainbow Stripes',
    paint(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, w, 0);
      applyStops(g, rainbowStops(10));
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    } },
  'radial-burst': { name: 'Radial Burst', category: 'Rainbow Stripes',
    paint(ctx, w, h) {
      const cx = w / 2, cy = h / 2, rays = 24;
      for (let i = 0; i < rays; i++) {
        ctx.fillStyle = hsb((i / rays) * 360, 85, 58);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        const a1 = (i / rays) * Math.PI * 2, a2 = ((i + 1) / rays) * Math.PI * 2;
        ctx.arc(cx, cy, Math.hypot(w, h), a1, a2);
        ctx.closePath(); ctx.fill();
      }
    } },
  'spiral-rainbow': { name: 'Rainbow Spiral', category: 'Rainbow Stripes',
    paint(ctx, w, h) {
      const cx = w / 2, cy = h / 2, maxR = Math.hypot(w, h) / 2;
      ctx.fillStyle = '#0c0c0c'; ctx.fillRect(0, 0, w, h);
      ctx.lineCap = 'round';
      for (let a = 0; a < Math.PI * 22; a += 0.08) {
        const r = (a / (Math.PI * 22)) * maxR;
        ctx.fillStyle = hsb((a * 28) % 360, 85, 58);
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        ctx.beginPath(); ctx.arc(x, y, maxR / 52, 0, Math.PI * 2); ctx.fill();
      }
    } },
  'zigzag-rainbow': { name: 'Zigzag Rainbow', category: 'Rainbow Stripes',
    paint(ctx, w, h) {
      const bands = 12, bh = h / bands;
      for (let i = 0; i < bands; i++) {
        ctx.fillStyle = hsb((i / bands) * 360, 85, 58);
        ctx.beginPath();
        const n = 10;
        for (let k = 0; k <= n; k++) {
          const x = (k / n) * w, y = i * bh + (k % 2 ? bh : 0);
          k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        for (let k = n; k >= 0; k--) {
          const x = (k / n) * w, y = i * bh + bh + (k % 2 ? bh : 0);
          ctx.lineTo(x, y);
        }
        ctx.closePath(); ctx.fill();
      }
    } },
  'diagonal-rainbow-reverse': { name: 'Reverse Diagonal', category: 'Rainbow Stripes',
    paint(ctx, w, h) {
      const g = ctx.createLinearGradient(w, 0, 0, h);
      applyStops(g, rainbowStops(12));
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    } },
  'horizontal-bars': { name: 'Sunset Bars', category: 'Rainbow Stripes',
    paint(ctx, w, h) {
      const n = 14, bh = h / n;
      for (let i = 0; i < n; i++) {
        ctx.fillStyle = hsb(8 + (i / n) * 48, 88, 55);
        ctx.fillRect(0, i * bh, w, bh + 1);
      }
    } },
  'concentric-rainbow': { name: 'Concentric Rainbow', category: 'Rainbow Stripes',
    paint(ctx, w, h) {
      const cx = w / 2, cy = h / 2, maxR = Math.hypot(w, h) / 2, rings = 16;
      for (let i = rings; i > 0; i--) {
        ctx.fillStyle = hsb(((rings - i) / rings) * 360, 85, 58);
        ctx.beginPath(); ctx.arc(cx, cy, (i / rings) * maxR, 0, Math.PI * 2); ctx.fill();
      }
    } },
  'mosaic-rainbow': { name: 'Rainbow Mosaic', category: 'Rainbow Stripes',
    paint(ctx, w, h, rng) {
      const n = 18, cw = w / n, ch = h / Math.round((h / w) * n);
      for (let gy = 0; gy * ch < h; gy++) for (let gx = 0; gx < n; gx++) {
        ctx.fillStyle = hsb(rng() * 360, 80, 58);
        ctx.fillRect(gx * cw, gy * ch, cw + 0.5, ch + 0.5);
      }
    } },

  /* ---------------- Rainbow / Glitter ---------------- */
  'gradient': { name: 'Candy Gradient', category: 'Rainbow',
    paint(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#ff6b9d'); g.addColorStop(0.5, '#a06bff'); g.addColorStop(1, '#4bd8ff');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    } },
  'stripes': { name: 'Candy Stripes', category: 'Rainbow',
    paint(ctx, w, h) {
      const cols = ['#ff6b9d', '#ffb36b', '#f7f76b', '#6bffa8', '#6bd8ff', '#a06bff'];
      const n = 24, bw = w / n;
      for (let i = 0; i < n; i++) { ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(i * bw, 0, bw + 1, h); }
    } },
  'glitter': { name: 'Glitter', category: 'Rainbow',
    paint(ctx, w, h, rng) {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#2a1a3a'); g.addColorStop(1, '#0e0e1e');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 900; i++) {
        ctx.fillStyle = hsb(rng() * 360, 90, 70, 0.5 + rng() * 0.5);
        const s = 1 + rng() * 3;
        ctx.fillRect(rng() * w, rng() * h, s, s);
      }
    } },

  /* ---------------- Geometric ---------------- */
  'geometric': { name: 'Geo Field', category: 'Geometric',
    paint(ctx, w, h, rng) {
      ctx.fillStyle = '#101418'; ctx.fillRect(0, 0, w, h);
      const n = 12, cw = w / n, ch = h / n;
      for (let gy = 0; gy < n; gy++) for (let gx = 0; gx < n; gx++) {
        ctx.fillStyle = hsb(rng() * 360, 55, 45, 0.85);
        const x = gx * cw, y = gy * ch, k = rng();
        ctx.beginPath();
        if (k < 0.33) { ctx.moveTo(x, y); ctx.lineTo(x + cw, y); ctx.lineTo(x, y + ch); }
        else if (k < 0.66) { ctx.moveTo(x + cw, y); ctx.lineTo(x + cw, y + ch); ctx.lineTo(x, y + ch); }
        else ctx.rect(x + 1, y + 1, cw - 2, ch - 2);
        ctx.fill();
      }
    } },
  'hexagons': { name: 'Hex Grid', category: 'Geometric',
    paint(ctx, w, h, rng) {
      ctx.fillStyle = '#0d1117'; ctx.fillRect(0, 0, w, h);
      const r = 26;
      for (let row = -1; row * r * 1.5 < h + r; row++) for (let col = -1; col * r * 1.74 < w + r; col++) {
        const x = col * r * 1.74 + (row % 2 ? r * 0.87 : 0), y = row * r * 1.5;
        ctx.fillStyle = hsb(rng() * 360, 60, 50, 0.9);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = Math.PI / 3 * i + Math.PI / 6;
          const px = x + Math.cos(a) * r * 0.92, py = y + Math.sin(a) * r * 0.92;
          i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
        }
        ctx.closePath(); ctx.fill();
      }
    } },
  'diamonds': { name: 'Diamond Grid', category: 'Geometric',
    paint(ctx, w, h, rng) {
      ctx.fillStyle = '#120e14'; ctx.fillRect(0, 0, w, h);
      const s = 44;
      for (let y = 0; y < h + s; y += s) for (let x = 0; x < w + s; x += s) {
        ctx.fillStyle = hsb(rng() * 360, 65, 55, 0.9);
        ctx.beginPath();
        ctx.moveTo(x + s/2, y); ctx.lineTo(x + s, y + s/2); ctx.lineTo(x + s/2, y + s); ctx.lineTo(x, y + s/2);
        ctx.closePath(); ctx.fill();
      }
    } },

  /* ---------------- Metallic ---------------- */
  'gold': { name: 'Gold Leaf', category: 'Metallic',
    paint(ctx, w, h, rng) {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#8a6a1f'); g.addColorStop(0.35, '#f7dc8a');
      g.addColorStop(0.55, '#caa53d'); g.addColorStop(0.8, '#f2d67c'); g.addColorStop(1, '#7a5c1a');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 260; i++) {
        ctx.fillStyle = `rgba(255,244,200,${0.05 + rng() * 0.12})`;
        ctx.fillRect(rng() * w, rng() * h, 1 + rng() * 3, 1 + rng() * 2);
      }
    } },
  'silver': { name: 'Silver', category: 'Metallic',
    paint(ctx, w, h, rng) {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#5a5f6a'); g.addColorStop(0.35, '#e8ecf2');
      g.addColorStop(0.55, '#a9b0bc'); g.addColorStop(0.8, '#dfe5ec'); g.addColorStop(1, '#4c515a');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 200; i++) {
        ctx.fillStyle = `rgba(255,255,255,${0.04 + rng() * 0.1})`;
        ctx.fillRect(rng() * w, rng() * h, 1 + rng() * 3, 1 + rng() * 2);
      }
    } },
  'copper': { name: 'Copper', category: 'Metallic',
    paint(ctx, w, h, rng) {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#5f2f14'); g.addColorStop(0.35, '#eda76a');
      g.addColorStop(0.55, '#b46a35'); g.addColorStop(0.8, '#f0b47e'); g.addColorStop(1, '#4e2410');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 200; i++) {
        ctx.fillStyle = `rgba(255,220,180,${0.04 + rng() * 0.1})`;
        ctx.fillRect(rng() * w, rng() * h, 1 + rng() * 3, 1 + rng() * 2);
      }
    } },

  /* ---------------- Nature ---------------- */
  'aurora': { name: 'Aurora', category: 'Nature',
    paint(ctx, w, h, rng) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#020610'); g.addColorStop(0.6, '#06231f'); g.addColorStop(1, '#0a3a2e');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      for (let b = 0; b < 5; b++) {
        const bx = (b / 5) * w + rng() * w * 0.1;
        const hue = 140 + rng() * 60;
        const grd = ctx.createLinearGradient(bx, 0, bx + w * 0.12, 0);
        grd.addColorStop(0, `hsla(${hue},90%,55%,0)`);
        grd.addColorStop(0.5, `hsla(${hue},90%,55%,0.5)`);
        grd.addColorStop(1, `hsla(${hue},90%,55%,0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        for (let y = 0; y <= h * 0.85; y += 10) {
          const x = bx + Math.sin((y / h) * 6 + b * 2) * w * 0.05;
          y ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.lineTo(bx + w * 0.12, h); ctx.lineTo(bx, h); ctx.closePath(); ctx.fill();
      }
      // stars
      for (let i = 0; i < 160; i++) {
        ctx.fillStyle = `rgba(255,255,255,${0.2 + rng() * 0.7})`;
        ctx.fillRect(rng() * w, rng() * h * 0.6, 1.4, 1.4);
      }
    } },
  'sunset': { name: 'Sunset', category: 'Nature',
    paint(ctx, w, h, rng) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#2b1a4e'); g.addColorStop(0.45, '#b83a5e');
      g.addColorStop(0.7, '#ff7a4d'); g.addColorStop(1, '#ffc46b');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      // sun
      const sx = w * 0.5, sy = h * 0.62;
      const sg = ctx.createRadialGradient(sx, sy, 4, sx, sy, h * 0.3);
      sg.addColorStop(0, '#fff3c4'); sg.addColorStop(0.4, '#ffdf7e'); sg.addColorStop(1, 'rgba(255,180,80,0)');
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, sy, h * 0.3, 0, Math.PI * 2); ctx.fill();
      // sea
      ctx.fillStyle = 'rgba(20,10,40,0.55)'; ctx.fillRect(0, h * 0.72, w, h * 0.28);
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = `rgba(255,180,120,${0.1 + rng() * 0.25})`;
        const yy = h * 0.74 + rng() * h * 0.24;
        ctx.fillRect(rng() * w, yy, 8 + rng() * 40, 1.6);
      }
    } },
  'ocean': { name: 'Ocean', category: 'Nature',
    paint(ctx, w, h, rng) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#7fd4e8'); g.addColorStop(0.5, '#1f7fae'); g.addColorStop(1, '#0a2a52');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 26; i++) {
        ctx.strokeStyle = `rgba(255,255,255,${0.08 + rng() * 0.16})`;
        ctx.lineWidth = 1 + rng() * 2.5; ctx.lineCap = 'round';
        const y = rng() * h, x = rng() * w, len = 30 + rng() * 120;
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + len / 2, y - 6 - rng() * 8, x + len, y);
        ctx.stroke();
      }
    } },
  'fire': { name: 'Fire', category: 'Nature',
    paint(ctx, w, h, rng) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#1a0500'); g.addColorStop(0.6, '#7a1e00'); g.addColorStop(1, '#ff9a2e');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 90; i++) {
        const x = rng() * w, y = h * 0.35 + rng() * h * 0.65;
        const r = 6 + rng() * 26;
        const fg = ctx.createRadialGradient(x, y, 1, x, y, r);
        const hot = rng();
        fg.addColorStop(0, hot > 0.5 ? 'rgba(255,240,180,0.5)' : 'rgba(255,120,30,0.45)');
        fg.addColorStop(1, 'rgba(255,60,0,0)');
        ctx.fillStyle = fg;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
    } },

  /* ---------------- Space ---------------- */
  'starrynight': { name: 'Starry Night', category: 'Space',
    paint(ctx, w, h, rng) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#02030a'); g.addColorStop(1, '#0a1030');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 420; i++) {
        const r = rng();
        ctx.fillStyle = `rgba(255,255,255,${0.25 + r * 0.75})`;
        const s = r > 0.93 ? 2.6 : 1.4;
        ctx.fillRect(rng() * w, rng() * h, s, s);
      }
      // a few bright stars with cross glints
      for (let i = 0; i < 12; i++) {
        const x = rng() * w, y = rng() * h;
        ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - 7, y); ctx.lineTo(x + 7, y);
        ctx.moveTo(x, y - 7); ctx.lineTo(x, y + 7);
        ctx.stroke();
      }
    } },
  'galaxy': { name: 'Galaxy', category: 'Space',
    paint(ctx, w, h, rng) {
      ctx.fillStyle = '#04040c'; ctx.fillRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      for (let i = 0; i < 700; i++) {
        const a = rng() * Math.PI * 2;
        const arm = rng() < 0.5 ? 0 : Math.PI;
        const d = Math.pow(rng(), 0.6) * w * 0.42;
        const ang = a * 0.35 + arm + d * 0.004;
        const x = cx + Math.cos(ang) * d, y = cy + Math.sin(ang) * d * 0.62;
        ctx.fillStyle = hsb(210 + rng() * 90, 70, 55 + rng() * 30, 0.35 + rng() * 0.6);
        ctx.fillRect(x, y, 1.6, 1.6);
      }
      const core = ctx.createRadialGradient(cx, cy, 2, cx, cy, w * 0.16);
      core.addColorStop(0, 'rgba(255,250,230,0.95)'); core.addColorStop(1, 'rgba(255,250,230,0)');
      ctx.fillStyle = core; ctx.beginPath(); ctx.arc(cx, cy, w * 0.16, 0, Math.PI * 2); ctx.fill();
    } },
  'nebula': { name: 'Nebula', category: 'Space',
    paint(ctx, w, h, rng) {
      ctx.fillStyle = '#060412'; ctx.fillRect(0, 0, w, h);
      const hues = [280, 310, 190, 250];
      for (let i = 0; i < 46; i++) {
        const x = rng() * w, y = rng() * h, r = 30 + rng() * 110;
        const ng = ctx.createRadialGradient(x, y, 2, x, y, r);
        ng.addColorStop(0, `hsla(${hues[i % 4]},80%,55%,0.28)`);
        ng.addColorStop(1, 'hsla(0,0%,0%,0)');
        ctx.fillStyle = ng;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      for (let i = 0; i < 260; i++) {
        ctx.fillStyle = `rgba(255,255,255,${0.2 + rng() * 0.7})`;
        ctx.fillRect(rng() * w, rng() * h, 1.3, 1.3);
      }
    } },

  /* ---------------- Custom ---------------- */
  'custom': { name: 'Uploaded Image', category: 'Custom', custom: true,
    paint() { /* filled by the engine from the uploaded image */ } },
};

export const PATTERN_CATEGORIES = ['Rainbow Stripes', 'Rainbow', 'Geometric', 'Metallic', 'Nature', 'Space', 'Custom'];

export function patternCount() { return Object.keys(PATTERNS).length; }
