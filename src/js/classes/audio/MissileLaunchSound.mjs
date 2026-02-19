import Sound from './Sound.mjs';

export default class MissileLaunchSound extends Sound {
  play() {
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
}
