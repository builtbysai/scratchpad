/* Revel Pad — procedural scratch/restore sounds via WebAudio.
   No audio assets: filtered noise shaped per stroke speed. */

let ctx = null;
let scratchBuf = null;
let restoreBuf = null;
let enabled = true;
let lastPlay = 0;

function makeNoiseBuffer(seconds, filterType, freq, q) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf; src.loop = true;
  const filt = ctx.createBiquadFilter();
  filt.type = filterType; filt.frequency.value = freq; filt.Q.value = q;
  const gain = ctx.createGain(); gain.gain.value = 0;
  src.connect(filt); filt.connect(gain); gain.connect(ctx.destination);
  src.start();
  return { src, out: gain };
}

export function ensureAudio() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  scratchBuf = makeNoiseBuffer(1.2, 'bandpass', 2600, 0.8);
  restoreBuf = makeNoiseBuffer(1.2, 'lowpass', 900, 0.6);
}

export function setAudioEnabled(v) { enabled = v; }

function blip(buf, speed01) {
  if (!ctx || !enabled || !buf) return;
  const now = performance.now();
  if (now - lastPlay < 40) return; // throttle
  lastPlay = now;
  const t = ctx.currentTime;
  const peak = 0.02 + speed01 * 0.10;
  const param = buf.out.gain;
  param.cancelScheduledValues(t);
  param.setValueAtTime(param.value, t);
  param.linearRampToValueAtTime(peak, t + 0.03);
  param.exponentialRampToValueAtTime(0.0001, t + 0.16);
}

export function playScratch(speed01) { blip(scratchBuf, speed01); }
export function playRestore(speed01) { blip(restoreBuf, speed01); }
