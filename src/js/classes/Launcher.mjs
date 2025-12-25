import Explosion from "./missile/Explosion.mjs";
import Missile from "./missile/Missile.mjs";
import Smoke from "./missile/Smoke.mjs";

export default class Launcher {
  constructor(x, y, parent) {
    this.x = x;
    this.y = y;
    this.game = parent;
  }

  update(mouse) {
    if (!mouse.fire) return;
    const { game } = this;
    const start    = { x:123, y:209 };
    const target   = { x:mouse.x, y:mouse.y };
    
    this.launch(game, start, target);
    game.audio.playMissileLaunch();
    mouse.fire = false;
  }

  launch(game, start, target) {
    //game.missiles.push(new Missile(game, start, target));
    
    //game.explosions.push(new Explosion(game, target.x, target.y, 20));

    game.smoke.push(new Smoke(game, start, target));
    
  }
}
