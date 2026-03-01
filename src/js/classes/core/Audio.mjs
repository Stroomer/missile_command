import MissileLaunchSound from '../audio/MissileLaunchSound.mjs';
import ExplosionSound from '../audio/ExplosionSound.mjs';
import IncomingMissileSound from '../audio/IncomingMissileSound.mjs';

export default class Audio {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    this.missileLaunchSound   = new MissileLaunchSound(this.ctx);
    this.explosionSound       = new ExplosionSound(this.ctx);
    this.incomingMissileSound = new IncomingMissileSound(this.ctx);
  }

  playMissileLaunch() {
    this.missileLaunchSound.play();
  }

  playExplosion() {
    this.explosionSound.play();
  }

  playIncomingMissile() {
    this.incomingMissileSound.play();
  }
}
