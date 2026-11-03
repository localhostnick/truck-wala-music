let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays an authentic, brassy dual-tone Indian Truck Air Pressure Horn
 * "POOOOO - POOOOO" / Pneumatic high-pressure horn blast!
 */
export function playIndianTruckHorn() {
  try {
    // Also try playing audio file
    const audio = new Audio('/horn.mp3');
    audio.volume = 0.9;
    audio.play().catch(() => {});
  } catch {}

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Master horn gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.7, now + 0.04);
    masterGain.gain.setValueAtTime(0.7, now + 0.35);
    masterGain.gain.linearRampToValueAtTime(0.01, now + 0.42);
    // Second blast
    masterGain.gain.linearRampToValueAtTime(0.75, now + 0.48);
    masterGain.gain.setValueAtTime(0.75, now + 0.95);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.15);

    // Resonant low-pass filter (simulates truck horn brass horn bell)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2600, now);
    filter.Q.setValueAtTime(3.5, now);

    // Tone 1: Low pneumatic horn (250 Hz - B3)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(248, now);
    osc1.frequency.linearRampToValueAtTime(252, now + 0.3);
    osc1.frequency.setValueAtTime(248, now + 0.45);
    osc1.frequency.linearRampToValueAtTime(252, now + 1.0);

    // Tone 2: Mid-high horn (370 Hz - F#4, classic truck harmonic)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(370, now);
    osc2.frequency.linearRampToValueAtTime(374, now + 0.3);
    osc2.frequency.setValueAtTime(370, now + 0.45);
    osc2.frequency.linearRampToValueAtTime(374, now + 1.0);

    // Tone 3: Sub-bass body pressure (125 Hz)
    const osc3 = ctx.createOscillator();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(124, now);

    // Mix together
    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    // Start & stop oscillators
    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    osc1.stop(now + 1.2);
    osc2.stop(now + 1.2);
    osc3.stop(now + 1.2);
  } catch (err) {
    console.warn('Could not synthesize horn:', err);
  }
}
