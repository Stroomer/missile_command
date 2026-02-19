/**
 * Sound - Base class for all game sounds
 * Provides shared audio context and noise buffer generation
 */
export default class Sound {
  constructor(ctx) {
    this.ctx = ctx;
  }

  /**
   * Generate noise buffer for sound effects
   * @param {string} type - 'WHITE' or 'PINK'
   * @returns {AudioBuffer}
   */
  createNoiseBuffer(type = 'WHITE') {
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'WHITE') {
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'PINK') {
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.997 * b0 + white * 0.029;
        b1 = 0.985 * b1 + white * 0.037;
        b2 = 0.95 * b2 + white * 0.11;
        data[i] = b0 + b1 + b2;
      }
    }

    return buffer;
  }

  /**
   * Override this method in subclasses to implement sound behavior
   */
  play() {
    throw new Error('Sound.play() must be implemented by subclass');
  }
}
