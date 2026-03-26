class SoundEngine {
  context: AudioContext | null = null;
  noiseBuffer: AudioBuffer | null = null;
  lastFlapTime = 0;
  enabled = false;

  init() {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  setEnabled(val: boolean) {
    this.enabled = val;
    if (val) {
      this.init();
    }
  }

  private getNoiseBuffer() {
    if (!this.context) return null;
    if (this.noiseBuffer) return this.noiseBuffer;
    const bufferSize = this.context.sampleRate * 0.05; // 50ms
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  playFlap() {
    if (!this.enabled || !this.context) return;
    
    const now = this.context.currentTime;
    // Throttle to max ~60 clicks per second globally to avoid audio distortion/clipping
    // when many flaps are flipping simultaneously
    if (now - this.lastFlapTime < 0.015) return; 
    this.lastFlapTime = now;

    const noiseSource = this.context.createBufferSource();
    noiseSource.buffer = this.getNoiseBuffer();

    const filter = this.context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800 + Math.random() * 400; // 800-1200Hz for plastic clack
    filter.Q.value = 0.5;

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0.015 + Math.random() * 0.01, now); // Very quiet per flap
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.context.destination);

    noiseSource.start(now);
  }

  playUpdate() {
    if (!this.enabled || !this.context) return;
    const now = this.context.currentTime;
    
    // A deeper mechanical "thud" for the board update
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
    
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    osc.connect(gain);
    gain.connect(this.context.destination);
    
    osc.start(now);
    osc.stop(now + 0.15);
  }
}

export const soundEngine = typeof window !== 'undefined' ? new SoundEngine() : null;
