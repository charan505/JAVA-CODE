// Web Audio API emergency synthesizer
let audioCtx = null;
let sirenOscillator = null;
let sirenGain = null;
let sirenInterval = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playEmergencySiren(durationMs = 4000) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    stopEmergencySiren();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, ctx.currentTime);

    // Modulate pitch up and down like emergency wail
    let rising = true;
    let freq = 440;
    sirenInterval = setInterval(() => {
      if (rising) {
        freq += 60;
        if (freq >= 880) rising = false;
      } else {
        freq -= 60;
        if (freq <= 440) rising = true;
      }
      if (osc && ctx) {
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
      }
    }, 60);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (durationMs / 1000));

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    sirenOscillator = osc;
    sirenGain = gain;

    setTimeout(() => {
      stopEmergencySiren();
    }, durationMs);
  } catch (e) {
    console.warn("Audio not supported or blocked by browser policy:", e);
  }
}

export function stopEmergencySiren() {
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
  if (sirenOscillator) {
    try {
      sirenOscillator.stop();
      sirenOscillator.disconnect();
    } catch (e) {
      // ignore
    }
    sirenOscillator = null;
  }
}

export function playAcknowledgeSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // ignore
  }
}
