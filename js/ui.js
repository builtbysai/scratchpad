/* Revel Pad — UI wiring: panel, toolbar, canvas gestures, persistence. */
import { Studio, ART_W, ART_H } from './engine.js';
import { SHAPES, SHAPE_CATEGORIES } from './shapes.js';
import { PATTERNS, PATTERN_CATEGORIES } from './patterns.js';
import { mulberry32 } from './rng.js';
import { setAudioEnabled } from './audio.js';

const $ = (id) => document.getElementById(id);
const AUTOSAVE_KEY = 'scratchpad-v1';

let studio = null;
let autosaveOn = true;
let saveTimer = null;
let panTool = false;
let spaceDown = false;

function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.hidden = false;
  requestAnimationFrame(() => t.classList.add('show'));
  clearTimeout(t._h);
  t._h = setTimeout(() => { t.classList.remove('show'); setTimeout(() => (t.hidden = true), 300); }, 2200);
}

/* ---------------- pattern panel ---------------- */

function renderPatternThumb(key) {
  const c = document.createElement('canvas');
  c.width = 144; c.height = 96;
  const ctx = c.getContext('2d');
  const p = PATTERNS[key];
  if (p.custom) {
    ctx.fillStyle = '#222'; ctx.fillRect(0, 0, 144, 96);
    ctx.fillStyle = '#d9b06a'; ctx.font = '700 13px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('UPLOAD', 72, 52);
  } else {
    p.paint(ctx, 144, 96, mulberry32(42));
  }
  return c;
}

function buildPatterns() {
  const cats = $('patternCats'), grid = $('patternGrid');
  let activeCat = PATTERN_CATEGORIES[0];
  const draw = () => {
    cats.innerHTML = '';
    for (const cat of PATTERN_CATEGORIES) {
      const b = document.createElement('button');
      b.textContent = cat.replace('Rainbow Stripes', 'Stripes');
      b.className = cat === activeCat ? 'on' : '';
      b.onclick = () => { activeCat = cat; draw(); };
      cats.appendChild(b);
    }
    grid.innerHTML = '';
    for (const [key, p] of Object.entries(PATTERNS)) {
      if (p.category !== activeCat) continue;
      const b = document.createElement('button');
      b.className = 'thumb' + (studio.pattern === key ? ' on' : '');
      b.title = p.name;
      b.appendChild(renderPatternThumb(key));
      const label = document.createElement('span');
      label.textContent = p.name;
      b.appendChild(label);
      b.onclick = () => {
        if (key === 'custom') { $('fileUpload').click(); return; }
        studio.setPattern(key);
        draw();
        scheduleSave();
      };
      grid.appendChild(b);
    }
  };
  draw();
  // reseed: new variation of the current pattern
  $('btnReseed').onclick = () => {
    studio.artSeed = (Math.random() * 0xFFFFFFFF) >>> 0;
    studio.paintArt();
    toast('New variation');
    scheduleSave();
  };
  $('btnUpload').onclick = () => $('fileUpload').click();
  $('fileUpload').onchange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const img = new Image();
    img.onload = () => {
      studio.setCustomImage(img);
      URL.revokeObjectURL(img.src);
      toast('Image set as artwork');
      scheduleSave();
    };
    img.src = URL.createObjectURL(f);
    e.target.value = '';
  };
}

/* ---------------- shape panel ---------------- */

function buildShapes() {
  const sel = $('shapeCat'), grid = $('shapeGrid');
  for (const cat of SHAPE_CATEGORIES) {
    const o = document.createElement('option');
    o.value = cat; o.textContent = cat;
    sel.appendChild(o);
  }
  const draw = () => {
    const cat = sel.value;
    grid.innerHTML = '';
    for (const [key, s] of Object.entries(SHAPES)) {
      if (s.category !== cat) continue;
      const b = document.createElement('button');
      b.className = 'shape-btn' + (studio.brush.shape === key ? ' on' : '');
      b.textContent = s.icon;
      b.title = s.name;
      b.onclick = () => {
        studio.brush.shape = key;
        draw();
        updateStatus();
        scheduleSave();
      };
      grid.appendChild(b);
    }
  };
  sel.onchange = draw;
  draw();
}

/* ---------------- controls ---------------- */

function bindControls() {
  // mode
  $('modeSeg').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    setMode(b.dataset.mode);
  });
  // sliders
  const slider = (id, valId, fmt, fn) => {
    $(id).addEventListener('input', (e) => {
      const v = +e.target.value;
      $(valId).textContent = fmt(v);
      fn(v);
      scheduleSave();
    });
  };
  slider('sizeSlider', 'sizeVal', (v) => v, (v) => (studio.brush.size = v));
  slider('rotSlider', 'rotVal', (v) => v + '°', (v) => (studio.brush.rotation = v));
  slider('smoothSlider', 'smoothVal', (v) => v, (v) => (studio.brush.smoothing = v));
  // toggles
  const toggle = (id, fn) => {
    $(id).addEventListener('click', () => {
      const b = $(id);
      const on = !b.classList.contains('on');
      b.classList.toggle('on', on);
      b.setAttribute('aria-checked', on);
      fn(on);
      scheduleSave();
    });
  };
  toggle('tglParticles', (on) => (studio.particlesOn = on));
  toggle('tglSound', (on) => { studio.soundOn = on; setAudioEnabled(on); });
  toggle('tglAutosave', (on) => {
    autosaveOn = on;
    if (!on) localStorage.removeItem(AUTOSAVE_KEY);
    else scheduleSave();
  });
  // actions
  $('btnResetFoil').onclick = () => {
    studio.resetFoil(true);
    toast('Fresh foil — undo brings back your work');
    scheduleSave();
  };
  // export
  $('btnDownload').onclick = async () => {
    const blob = await studio.exportBlob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'scratchpad.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast('PNG downloaded');
  };
  $('btnCopy').onclick = async () => {
    try {
      const blob = await studio.exportBlob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      toast('Copied to clipboard');
    } catch {
      toast('Copy blocked by the browser — use download');
    }
  };
  // toolbar
  $('btnUndo').onclick = () => { studio.undo(); scheduleSave(); };
  $('btnRedo').onclick = () => { studio.redo(); scheduleSave(); };
  $('btnZoomIn').onclick = () => zoomCenter(1.25);
  $('btnZoomOut').onclick = () => zoomCenter(0.8);
  $('btnZoomFit').onclick = () => { studio.fitView(); updateStatus(); updateZoomLabel(); };
  $('btnPan').onclick = () => {
    panTool = !panTool;
    $('btnPan').classList.toggle('on', panTool);
    $('stage').classList.toggle('panning', panTool);
  };
  $('btnHelp').onclick = () => ($('helpModal').hidden = false);
  $('btnCloseHelp').onclick = () => ($('helpModal').hidden = true);
  $('helpModal').addEventListener('click', (e) => {
    if (e.target.id === 'helpModal') $('helpModal').hidden = true;
  });
  $('btnPanel').onclick = () => $('app').classList.toggle('panel-open');
}

function setMode(mode) {
  studio.mode = mode;
  for (const b of $('modeSeg').querySelectorAll('button')) {
    const on = b.dataset.mode === mode;
    b.classList.toggle('on', on);
    b.setAttribute('aria-selected', on);
  }
  $('cursorRing').classList.toggle('restore', mode === 'restore');
  updateStatus();
  scheduleSave();
}

function zoomCenter(f) {
  const r = $('pad').getBoundingClientRect();
  studio.zoomAt(r.left + r.width / 2, r.top + r.height / 2, f);
}

function updateStatus() {
  const s = SHAPES[studio.brush.shape];
  $('stShape').textContent = `${s.icon} ${s.name}`;
  $('stMode').textContent = studio.mode === 'scratch' ? 'Scratch' : 'Restore';
  $('btnUndo').disabled = studio.undoStack.length === 0;
  $('btnRedo').disabled = studio.redoStack.length === 0;
}

function updateZoomLabel() {
  const z = Math.round((studio.view_.scale / (studio.dpr || 1)) * 100);
  $('zoomLabel').textContent = z + '%';
}

/* ---------------- canvas gestures ---------------- */

function bindCanvas() {
  const canvas = $('pad');
  const ring = $('cursorRing');
  let drawing = false;
  let panning = false;
  let lastPan = null;
  const pinch = new Map();

  const pos = (e) => ({ x: e.clientX, y: e.clientY });

  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    pinch.set(e.pointerId, pos(e));
    if (pinch.size === 2) {
      drawing = false;
      if (studio.activeStroke) studio.endStroke();
      return; // pinch takes over
    }
    if (e.button === 1 || spaceDown || panTool) {
      panning = true;
      lastPan = pos(e);
      return;
    }
    const w = studio.screenToWorld(e.clientX, e.clientY);
    if (w.x < -50 || w.y < -50 || w.x > ART_W + 50 || w.y > ART_H + 50) return;
    drawing = true;
    studio.beginStroke(w.x, w.y);
  });

  canvas.addEventListener('pointermove', (e) => {
    // cursor ring: brush world-size -> css px
    const r = canvas.getBoundingClientRect();
    const dpr = studio.dpr || 1;
    const sizePx = (studio.brush.size * studio.view_.scale) / dpr;
    ring.hidden = false;
    ring.style.width = ring.style.height = Math.max(8, sizePx) + 'px';
    ring.style.left = e.clientX - r.left + 'px';
    ring.style.top = e.clientY - r.top + 'px';

    if (pinch.has(e.pointerId)) pinch.set(e.pointerId, pos(e));
    if (pinch.size === 2) {
      const [a, b] = [...pinch.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch._d) {
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        studio.zoomAt(mx, my, d / pinch._d);
      }
      pinch._d = d;
      return;
    }
    if (panning && lastPan) {
      const p = pos(e);
      studio.panBy(p.x - lastPan.x, p.y - lastPan.y);
      lastPan = p;
      return;
    }
    if (!drawing) return;
    const w = studio.screenToWorld(e.clientX, e.clientY);
    studio.addPoint(
      Math.max(0, Math.min(ART_W, w.x)),
      Math.max(0, Math.min(ART_H, w.y))
    );
  });

  const up = (e) => {
    pinch.delete(e.pointerId);
    pinch._d = 0;
    if (drawing) { drawing = false; studio.endStroke(); scheduleSave(); }
    panning = false;
    lastPan = null;
  };
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);
  canvas.addEventListener('pointerleave', () => (ring.hidden = true));

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    studio.zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.12 : 1 / 1.12);
  }, { passive: false });

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { spaceDown = true; e.preventDefault(); }
  });
  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') spaceDown = false;
  });
}

/* ---------------- keyboard ---------------- */

function bindKeys() {
  window.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); studio.undo(); scheduleSave(); }
    else if ((mod && e.key.toLowerCase() === 'y') || (mod && e.shiftKey && e.key.toLowerCase() === 'z')) { e.preventDefault(); studio.redo(); scheduleSave(); }
    else if (e.key.toLowerCase() === 'x') setMode(studio.mode === 'scratch' ? 'restore' : 'scratch');
    else if (e.key === '[') nudgeSlider('sizeSlider', -8);
    else if (e.key === ']') nudgeSlider('sizeSlider', 8);
    else if (e.key.toLowerCase() === 'r') nudgeSlider('rotSlider', e.shiftKey ? -15 : 15, 0, 359);
    else if (e.key === '+' || e.key === '=') zoomCenter(1.25);
    else if (e.key === '-') zoomCenter(0.8);
    else if (e.key === '0') { studio.fitView(); updateStatus(); updateZoomLabel(); }
    else if (e.key === '?') $('helpModal').hidden = !$('helpModal').hidden;
    else if (e.key === 'Escape') { $('helpModal').hidden = true; $('app').classList.remove('panel-open'); }
  });
}

function nudgeSlider(id, delta, min = 0, max = 1e9) {
  const el = $(id);
  const v = Math.max(+el.min, Math.min(+el.max, +el.value + delta));
  el.value = v;
  el.dispatchEvent(new Event('input'));
}

/* ---------------- persistence ---------------- */

function scheduleSave() {
  if (!autosaveOn) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(studio.serialize()));
    } catch { /* quota — non-fatal */ }
  }, 600);
}

function tryRestore() {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    const ok = studio.restore(data);
    if (ok) {
      // sync UI to restored state
      $('sizeSlider').value = studio.brush.size;
      $('sizeVal').textContent = studio.brush.size;
      $('rotSlider').value = studio.brush.rotation;
      $('rotVal').textContent = studio.brush.rotation + '°';
      $('smoothSlider').value = studio.brush.smoothing;
      $('smoothVal').textContent = studio.brush.smoothing;
      setMode(studio.mode);
      return true;
    }
  } catch { /* corrupted — start fresh */ }
  return false;
}

/* ---------------- boot ---------------- */

export function boot() {
  studio = new Studio($('pad'));
  studio.onChange = (info) => {
    $('stSteps').textContent = `${info.steps} stroke${info.steps === 1 ? '' : 's'}`;
    $('btnUndo').disabled = !info.canUndo;
    $('btnRedo').disabled = !info.canRedo;
    updateZoomLabel();
    scheduleSave();
  };

  const restored = tryRestore();
  buildPatterns();
  buildShapes();
  bindControls();
  bindCanvas();
  bindKeys();

  // fit after layout settles
  requestAnimationFrame(() => {
    studio.fitView();
    updateStatus();
    updateZoomLabel();
  });
  window.addEventListener('resize', () => { studio.fitView(); updateZoomLabel(); });

  window.addEventListener('beforeunload', (e) => {
    if (studio.strokes.length > 0 && autosaveOn === false) {
      e.preventDefault();
    }
  });

  if (restored) toast('Restored your last session');
  // expose for automated acceptance tests
  window.__studio = studio;
}
