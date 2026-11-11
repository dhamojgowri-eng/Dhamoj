// Web Audio API interactive sound synthesizers

let audioCtx: AudioContext | null = null;

export function playChime(freq = 520, duration = 0.09, enabled = true) {
  if (!enabled) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch {
    // Ignore audio errors in sandboxed iframes
  }
}

export function playSuccessChime(enabled = true) {
  if (!enabled) return;
  playChime(523.25, 0.1, enabled); // C5
  setTimeout(() => playChime(659.25, 0.1, enabled), 80); // E5
  setTimeout(() => playChime(783.99, 0.2, enabled), 160); // G5
}

export function playTeacherStepChime(stepNumber: number, enabled = true) {
  if (!enabled) return;
  const scale = [440, 493.88, 554.37, 587.33, 659.25];
  const freq = scale[stepNumber % scale.length];
  playChime(freq, 0.12, enabled);
}
