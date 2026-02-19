import MissileLaunchSound from '../audio/MissileLaunchSound.mjs';
import ExplosionSound from '../audio/ExplosionSound.mjs';
import IncomingMissileSound from '../audio/IncomingMissileSound.mjs';

/**
 * AudioFactory - Centralized audio management
 * Benefits:
 * - Single AudioContext shared across all sounds
 * - Consistent sound creation pattern
 * - Easy to extend with new sounds
 * - Cleaner separation of concerns
 */
export default class Audio {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    this.missileLaunchSound = new MissileLaunchSound(this.ctx);
    this.explosionSound = new ExplosionSound(this.ctx);
    this.incomingMissileSound = new IncomingMissileSound(this.ctx);
  }

  playMissileLaunch() {
    console.log('playMissileLaunch');

    this.missileLaunchSound.play();
  }

  playExplosion() {
    console.log('playExplosion');

    this.explosionSound.play();
  }

  playIncomingMissile() {
    console.log('playIncomingMissile');

    this.incomingMissileSound.play();
  }
}
