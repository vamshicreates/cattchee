// Web Audio API Synthesizer for Cattchee
// Zero external dependencies, zero loading delays, instant mobile sound response!

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private bgmTimeout: number | null = null;
  private bgmStep: number = 0;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isBgmPlaying) {
      this.stopBgm();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Soft UI tap click
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Crisp catch sound with pitch scaling per combo
  public playCatch(combo: number = 1) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Scale pitch based on combo: base 523Hz (C5) up to 1046Hz (C6)
    const baseFreq = 520 + Math.min(combo * 45, 600);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);

    // If combo > 3, add a sparkle overtone
    if (combo >= 3) {
      const sparkle = this.ctx.createOscillator();
      const sparkGain = this.ctx.createGain();
      sparkle.type = 'triangle';
      sparkle.frequency.setValueAtTime(baseFreq * 2, now + 0.04);
      sparkle.frequency.exponentialRampToValueAtTime(baseFreq * 2.5, now + 0.16);

      sparkGain.gain.setValueAtTime(0.15, now + 0.04);
      sparkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      sparkle.connect(sparkGain);
      sparkGain.connect(this.ctx.destination);

      sparkle.start(now + 0.04);
      sparkle.stop(now + 0.18);
    }
  }

  // Wrong tap / buzz error sound
  public playError() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.22);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Combo fanfare chime
  public playCombo() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(659.25, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Golden / Rainbow bonus catch sound
  public playBonus() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = this.ctx.currentTime + idx * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + 0.15);
    });
  }

  // Game over / high score jingle
  public playGameOver() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 493.88, 440.0, 392.0]; // C5, B4, A4, G4
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = this.ctx.currentTime + idx * 0.12;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.25, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + 0.25);
    });
  }

  // Gentle upbeat procedural background chiptune loop
  public startBgm() {
    if (this.isMuted || this.isBgmPlaying) return;
    this.initCtx();
    this.isBgmPlaying = true;
    this.bgmStep = 0;
    this.loopBgm();
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimeout) {
      window.clearTimeout(this.bgmTimeout);
      this.bgmTimeout = null;
    }
  }

  private loopBgm() {
    if (!this.isBgmPlaying || this.isMuted || !this.ctx) return;

    // Cheerful pentatonic melody pattern: C E G A G E D C
    const melody = [261.63, 329.63, 392.00, 440.00, 392.00, 329.63, 293.66, 261.63];
    const bass = [130.81, 130.81, 164.81, 174.61];

    const freq = melody[this.bgmStep % melody.length];
    const bassFreq = bass[Math.floor(this.bgmStep / 2) % bass.length];
    const now = this.ctx.currentTime;

    // Lead note
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 1.5, now);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);

    // Bass note
    if (this.bgmStep % 2 === 0) {
      const bOsc = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      bOsc.type = 'triangle';
      bOsc.frequency.setValueAtTime(bassFreq, now);
      bGain.gain.setValueAtTime(0.05, now);
      bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      bOsc.connect(bGain);
      bGain.connect(this.ctx.destination);
      bOsc.start(now);
      bOsc.stop(now + 0.35);
    }

    this.bgmStep++;
    this.bgmTimeout = window.setTimeout(() => this.loopBgm(), 220);
  }

  // Tactile haptic feedback
  public triggerHaptic(type: 'light' | 'medium' | 'error' | 'success' = 'light') {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        if (type === 'light') navigator.vibrate(15);
        else if (type === 'medium') navigator.vibrate(30);
        else if (type === 'error') navigator.vibrate([60, 40, 60]);
        else if (type === 'success') navigator.vibrate([30, 40, 50]);
      } catch {
        // Ignore if vibrations not supported or blocked
      }
    }
  }
}

export const sound = new SoundEngine();
