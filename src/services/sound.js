// Sintetizador de audio nativo via Web Audio API para alertas do Sentinela
// Sons harmônicos polifônicos elegantes (evita ruídos irritantes)

let audioCtx = null;

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

// Toca uma nota com envelope suave (ADSR)
function playTone(freq, type = 'sine', duration = 0.3, gainLevel = 0.15, delay = 0) {
  const ctx = getAudioContext();
  if (!ctx) return;

  setTimeout(() => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Envelope suave
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(gainLevel, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Erro ao tocar tom:', e);
    }
  }, delay * 1000);
}

// Som suave para aviso prévio de 22:15 (Acorde Maior C5 - E5 - G5)
export function playPreAlertSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  playTone(523.25, 'sine', 0.4, 0.12, 0);     // C5
  playTone(659.25, 'sine', 0.45, 0.14, 0.12); // E5
  playTone(783.99, 'sine', 0.6, 0.16, 0.24);  // G5
}

// Som nobre e contundente para alerta crítico de 22:30
// Tríade rítmica de alerta com dois pulsos para chamar a atenção
export function playCriticalNightSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Primeiro pulso
  playTone(440.0, 'triangle', 0.25, 0.22, 0);    // A4
  playTone(554.37, 'triangle', 0.25, 0.22, 0.1); // C#5
  playTone(659.25, 'sine', 0.35, 0.26, 0.2);     // E5
  playTone(880.0, 'sine', 0.5, 0.28, 0.3);       // A5

  // Segundo pulso de reforco
  playTone(554.37, 'triangle', 0.25, 0.22, 0.6); // C#5
  playTone(880.0, 'sine', 0.6, 0.3, 0.7);        // A5
}

// Som de sucesso e confirmacao (ao registrar aviso ou homenagem)
export function playSuccessChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  playTone(587.33, 'sine', 0.3, 0.15, 0);    // D5
  playTone(739.99, 'sine', 0.3, 0.18, 0.1);  // F#5
  playTone(880.0, 'sine', 0.45, 0.2, 0.2);   // A5
  playTone(1174.66, 'sine', 0.6, 0.22, 0.3); // D6
}
