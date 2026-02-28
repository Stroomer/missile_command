import Sound from './Sound.mjs';

export default class DepotOutSound extends Sound {
  play() {
    const t = this.ctx.currentTime;

    const modulator = this.ctx.createOscillator();
    modulator.type = 'sine';
    modulator.frequency.value = 80;

    const modGain = this.ctx.createGain();
    modGain.gain.value = 300;

    const carrier = this.ctx.createOscillator();
    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(220, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(gain);
    gain.connect(this.ctx.destination);

    modulator.start(t);
    modulator.stop(t + 0.25);
    carrier.start(t);
    carrier.stop(t + 0.25);
  }
}
