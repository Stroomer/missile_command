import Missile from './Missile.mjs';
import Target from './Target.mjs';

export default class Launcher {
  constructor(x, y, parent) {
    this.x = x;
    this.y = y;
    this.game = parent;
  }

  update(mouse) {
    if (!mouse.fire) return;
    this.launch(123, 209, mouse.x, mouse.y);
    this.game.audio.playMissileLaunch();
    mouse.fire = false;
  }

  launch(x0, y0, x1, y1) {
    console.log('launch');

    this.game.missiles.push(new Missile(x0, y0, x1, y1, this.game));
    this.game.targets.push(new Target(x1, y1, this.game));
  }
}
