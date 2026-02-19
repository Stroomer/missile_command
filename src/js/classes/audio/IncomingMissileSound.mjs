import Sound from './Sound.mjs';

export default class IncomingMissileSound extends Sound {
  play() {
    const src = this.ctx.createBufferSource();
    src.buffer = this.createNoiseBuffer('PINK');

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
