# Revel Pad — Scratch-Off Studio

Paint a foil cover over hidden artwork, then scratch it away with 71 shaped
brushes to reveal what's beneath. Every stroke erases foil; nothing paints —
except Restore mode, which lays foil back down.

## Run it

Any static server from this folder:

```sh
python3 -m http.server 8124
```

then open http://localhost:8124. No build step, no dependencies, works offline.

## What's inside

- `index.html` — app shell
- `css/studio.css` — the whole visual design (warm dark studio, brass accent)
- `js/shapes.js` — 71 brush shape painters (Basic, Stars, Organic, Artistic, Motion, Cute, Symbols, Patterns)
- `js/patterns.js` — 29 artwork patterns (rainbow stripes, metallics, nature, space, geometric) + uploaded-image mode
- `js/engine.js` — foil/art layers, stroke model, smoothing, undo/redo, zoom/pan, particles, autosave, PNG export
- `js/audio.js` — procedural WebAudio scratch/restore sounds (no audio files)
- `js/ui.js` — panel, toolbar, gestures, keyboard shortcuts, persistence
- `js/rng.js` — seeded RNG so patterns and stroke replay are deterministic

## The driver

A foil-covered artwork you reveal by scratching with shaped brushes.
Foil starts fully opaque; scratching erases it via `destination-out`
compositing; undo restores exact foil snapshots; autosave replays the
stroke log deterministically.

## Shortcuts

`X` scratch/restore · `[` `]` size · `R` rotate · `Ctrl+Z`/`Ctrl+Shift+Z`
undo/redo · `+`/`-`/`0` zoom · `Space`+drag pan · `?` help
