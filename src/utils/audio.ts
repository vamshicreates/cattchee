// Web Audio API Synthesizer for Cattchee
// High-gain, zero-latency mobile audio engine with iOS/Safari & Android unlock

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private bgmTimeout: number | null = null;
  private bgmStep: number = 0;
  private isUnlocked: boolean = false;

  constructor() {
    // Listen for the very first interaction to unlock mobile audio pipeline
    if (typeof window !== 'undefined') {
      const unlockHandler = () => {
        this.unlock();
      };
      ['touchstart', 'touchend', 'pointerdown', 'click'].forEach((evt) => {
        window.addEventListener(evt, unlockHandler, { passive: true });
      });
    }
  }

  // Explicitly unlock AudioContext on mobile (iOS Safari & Chrome)
  public unlock() {
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }

      if (this.ctx) {
        if (!this.masterGain) {
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);
        }

        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }

        if (!this.isUnlocked) {
          // Play a 1-sample silent buffer directly to unlock iOS Safari audio pipeline
          const buffer = this.ctx.createBuffer(1, 1, 22050);
          const source = this.ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(this.ctx.destination);
          source.start(0);
          this.isUnlocked = true;
        }
      }
    } catch (e) {
      console.warn('AudioContext unlock failed:', e);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.85, this.ctx.currentTime);
    }
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
    this.unlock();
    if (!this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.06);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Ignore audio glitches
    }
  }

  // Crisp catch sound with pitch scaling per combo (punchy & audible on mobile speakers)
  public playCatch(combo: number = 1) {
    if (this.isMuted) return;
    this.unlock();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Base 550Hz up to 1100Hz with combo
      const baseFreq = 540 + Math.min(combo * 50, 650);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.6, now + 0.14);

      gain.gain.setValueAtTime(0.65, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.16);

      // Extra sparkle chime on combo
      if (combo >= 2) {
        const sparkle = this.ctx.createOscillator();
        const sparkGain = this.ctx.createGain();
        sparkle.type = 'triangle';
        sparkle.frequency.setValueAtTime(baseFreq * 2, now + 0.03);
        sparkle.frequency.exponentialRampToValueAtTime(baseFreq * 2.8, now + 0.16);

        sparkGain.gain.setValueAtTime(0.3, now + 0.03);
        sparkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        sparkle.connect(sparkGain);
        sparkGain.connect(this.masterGain);

        sparkle.start(now + 0.03);
        sparkle.stop(now + 0.18);
      }
    } catch {
      // Ignore
    }
  }

  // Wrong tap / buzz error sound
  public playError() {
    if (this.isMuted) return;
    this.unlock();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.25);

      gain.gain.setValueAtTime(0.55, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch {
      // Ignore
    }
  }

  // Combo fanfare chime
  public playCombo() {
    if (this.isMuted) return;
    this.unlock();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.18);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Ignore
    }
  }

  // Golden / Rainbow bonus catch sound
  public playBonus() {
    if (this.isMuted) return;
    this.unlock();
    if (!this.ctx || !this.masterGain) return;

    try {
      const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + idx * 0.07;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.4, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(start);
        osc.stop(start + 0.18);
      });
    } catch {
      // Ignore
    }
  }

  // Game over / high score jingle
  public playGameOver() {
    if (this.isMuted) return;
    this.unlock();
    if (!this.ctx || !this.masterGain) return;

    try {
      const notes = [523.25, 493.88, 440.0, 392.0]; // C5, B4, A4, G4
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + idx * 0.12;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.45, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(start);
        osc.stop(start + 0.28);
      });
    } catch {
      // Ignore
    }
  }

  // Upbeat hypercasual background melody loop
  public startBgm() {
    if (this.isMuted || this.isBgmPlaying) return;
    this.unlock();
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
    if (!this.isBgmPlaying || this.isMuted || !this.ctx || !this.masterGain) return;

    try {
      // Cheerful upbeat pentatonic melody pattern: C E G A G E D C
      const melody = [261.63, 329.63, 392.0, 440.0, 392.0, 329.63, 293.66, 261.63];
      const bass = [130.81, 130.81, 164.81, 174.61];

      const freq = melody[this.bgmStep % melody.length];
      const bassFreq = bass[Math.floor(this.bgmStep / 2) % bass.length];
      const now = this.ctx.currentTime;

      // Lead note
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 1.5, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.19);

      // Bass note
      if (this.bgmStep % 2 === 0) {
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        bOsc.type = 'triangle';
        bOsc.frequency.setValueAtTime(bassFreq, now);
        bGain.gain.setValueAtTime(0.15, now);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
        bOsc.connect(bGain);
        bGain.connect(this.masterGain);
        bOsc.start(now);
        bOsc.stop(now + 0.36);
      }

      this.bgmStep++;
    } catch {
      // Ignore
    }

    this.bgmTimeout = window.setTimeout(() => this.loopBgm(), 220);
  }

  // Tactile haptic feedback
  public triggerHaptic(type: 'light' | 'medium' | 'error' | 'success' = 'light') {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        if (type === 'light') navigator.vibrate(18);
        else if (type === 'medium') navigator.vibrate(35);
        else if (type === 'error') navigator.vibrate([70, 40, 70]);
        else if (type === 'success') navigator.vibrate([35, 45, 55]);
      } catch {
        // Ignore if vibrations not supported or blocked
      }
    }
  }
}

export const sound = new SoundEngine();
