#!/usr/bin/env python3
"""Acceptance tests for Revel Pad: foil opacity, scratch erase, undo/redo,
export, and registry render checks. Fails loudly on any miss."""
from playwright.sync_api import sync_playwright

BASE = "http://localhost:8129/"
EXE = "/tmp/cft/chrome-headless-shell-linux64/chrome-headless-shell"
fails = []

def check(name, cond, extra=""):
    print(("PASS " if cond else "FAIL ") + name + (" " + extra if extra else ""))
    if not cond:
        fails.append(name)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=EXE, args=["--no-sandbox", "--disable-gpu"])
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    errors = []
    pg.on("pageerror", lambda e: errors.append(str(e)[:160]))
    pg.on("console", lambda m: errors.append(m.text[:160]) if m.type == "error" else None)
    pg.goto(BASE, wait_until="networkidle")
    pg.wait_for_timeout(1500)

    check("boots without JS errors", len(errors) == 0, "; ".join(errors[:3]))
    check("studio exposed", pg.evaluate("!!window.__studio"))

    # 1. foil starts fully opaque
    r0 = pg.evaluate("window.__studio.clearedRatio()")
    check("foil starts opaque", r0 < 0.005, f"cleared={r0:.4f}")

    # 2. scripted stroke erases foil (world coords: canvas is 1200x800, centered)
    pg.evaluate("""() => {
      const st = window.__studio;
      const box = document.getElementById('pad').getBoundingClientRect();
      const v = st.view_, dpr = st.dpr || 1;
      const toClient = (wx, wy) => [box.left + (wx * v.scale + v.tx) / dpr,
                                    box.top + (wy * v.scale + v.ty) / dpr];
      st.brush.shape = 'circle'; st.brush.size = 120;
      st.beginStroke(300, 400);
      for (let i = 1; i <= 20; i++) st.addPoint(300 + i * 30, 400);
      st.endStroke();
    }""")
    pg.wait_for_timeout(400)
    r1 = pg.evaluate("window.__studio.clearedRatio()")
    check("stroke erases foil", r1 > 0.01, f"cleared={r1:.4f}")

    # 3. undo restores
    pg.evaluate("window.__studio.undo()")
    r2 = pg.evaluate("window.__studio.clearedRatio()")
    check("undo restores foil", abs(r2 - r0) < 0.002, f"before={r0:.4f} after={r2:.4f}")

    # 4. redo re-applies
    pg.evaluate("window.__studio.redo()")
    r3 = pg.evaluate("window.__studio.clearedRatio()")
    check("redo re-applies", abs(r3 - r1) < 0.002, f"redo={r3:.4f} stroke={r1:.4f}")

    # 5. restore mode paints foil back
    pg.evaluate("""() => {
      const st = window.__studio;
      st.mode = 'restore';
      st.beginStroke(400, 400);
      for (let i = 1; i <= 10; i++) st.addPoint(400 + i * 20, 400);
      st.endStroke();
      st.mode = 'scratch';
    }""")
    r4 = pg.evaluate("window.__studio.clearedRatio()")
    check("restore paints foil back", r4 < r3, f"before={r3:.4f} after={r4:.4f}")

    # 6. export produces a real PNG blob
    sz = pg.evaluate("""async () => {
      const blob = await window.__studio.exportBlob();
      return blob ? blob.size : 0;
    }""")
    check("export PNG blob", sz > 50000, f"{sz} bytes")

    # 7. all 71 shapes render without throwing, non-empty
    shp = pg.evaluate("""() => {
      const out = [];
      return import('./js/shapes.js').then(m => {
        const c = document.createElement('canvas'); c.width = c.height = 64;
        const ctx = c.getContext('2d');
        let seed = 7;
        const rng = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
        for (const [k, s] of Object.entries(m.SHAPES)) {
          try {
            ctx.clearRect(0, 0, 64, 64);
            ctx.fillStyle = '#fff';
            ctx.save(); ctx.translate(32, 32);
            s.draw(ctx, 56, rng);
            ctx.restore();
            const d = ctx.getImageData(0, 0, 64, 64).data;
            let n = 0;
            for (let i = 3; i < d.length; i += 16) if (d[i] > 0) n++;
            if (n === 0) out.push(k + ':empty');
          } catch (e) { out.push(k + ':' + e.message.slice(0, 40)); }
        }
        return { total: Object.keys(m.SHAPES).length, bad: out };
      });
    }""")
    check("71 shapes render non-empty", shp["total"] == 71 and len(shp["bad"]) == 0,
          f"total={shp['total']} bad={shp['bad'][:5]}")

    # 8. all patterns render without throwing, non-black
    pat = pg.evaluate("""() => {
      return import('./js/patterns.js').then(m => {
        const out = [];
        const c = document.createElement('canvas'); c.width = 120; c.height = 80;
        const ctx = c.getContext('2d');
        let seed = 99;
        const rng = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
        for (const [k, p] of Object.entries(m.PATTERNS)) {
          if (p.custom) continue;
          try {
            p.paint(ctx, 120, 80, rng);
            const d = ctx.getImageData(0, 0, 120, 80).data;
            let sum = 0;
            for (let i = 0; i < d.length; i += 40) sum += d[i] + d[i+1] + d[i+2];
            if (sum === 0) out.push(k + ':black');
          } catch (e) { out.push(k + ':' + e.message.slice(0, 40)); }
        }
        return { total: Object.keys(m.PATTERNS).length, bad: out };
      });
    }""")
    check("patterns render non-black", pat["total"] == 29 and len(pat["bad"]) == 0,
          f"total={pat['total']} bad={pat['bad'][:5]}")

    # 9. autosave round-trip
    pg.evaluate("localStorage.clear()")
    pg.evaluate("""() => {
      const st = window.__studio;
      st.beginStroke(600, 400);
      for (let i = 1; i <= 8; i++) st.addPoint(600 + i * 25, 400);
      st.endStroke();
    }""")
    pg.wait_for_timeout(900)  # debounce 600ms
    saved = pg.evaluate("!!localStorage.getItem('revel-pad-v1')")
    check("autosave writes", saved)
    pg.reload(wait_until="networkidle")
    pg.wait_for_timeout(1500)
    r5 = pg.evaluate("window.__studio.clearedRatio()")
    check("reload restores strokes", r5 > 0.005, f"cleared={r5:.4f}")

    check("no JS errors after everything", len(errors) == 0, "; ".join(errors[:3]))
    b.close()

print()
print("FAILURES:", fails if fails else "none")
raise SystemExit(1 if fails else 0)
