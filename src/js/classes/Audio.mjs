export default class Audio {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  // ------------------------------------------
  // Random noise buffer generator
  // ------------------------------------------
  createNoiseBuffer(type = 'WHITE') {
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'WHITE') {
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    } else if (type === 'pink') {
      // quick pink noise approximation
      let b0 = 0,
        b1 = 0,
        b2 = 0;
      for (let i = 0; i < data.length; i++) {
        const WHITE = Math.random() * 2 - 1;
        b0 = 0.997 * b0 + WHITE * 0.029;
        b1 = 0.985 * b1 + WHITE * 0.037;
        b2 = 0.95 * b2 + WHITE * 0.11;
        data[i] = b0 + b1 + b2;
      }
    }

    return buffer;
  }

  // ------------------------------------------
  // Missile launch sound (WHITE noise + fast decay)
  // ------------------------------------------
  playMissileLaunch() {
    console.log('play launch sound');

    const src = this.ctx.createBufferSource();
    src.buffer = this.createNoiseBuffer('WHITE');

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 500;
    filter.Q.value = 2;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    src.start();
    src.stop(this.ctx.currentTime + 0.25);
  }

  // ------------------------------------------
  // Explosion (low-pass + sweeping pitch)
  // ------------------------------------------
  playExplosion() {
    console.log('play explosion sound');

    const src = this.ctx.createBufferSource();
    src.buffer = this.createNoiseBuffer('WHITE');

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(1.0, this.ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    src.start();
    src.stop(this.ctx.currentTime + 0.65);
  }

  // ------------------------------------------
  // Incoming missile whoosh (pink noise + hi-pass)
  // ------------------------------------------
  playIncomingMissile() {
    const src = this.ctx.createBufferSource();
    src.buffer = this.createNoiseBuffer('pink');

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1200;
    filter.Q.value = 1;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    src.start();
    src.stop(this.ctx.currentTime + 0.2);
  }
}
