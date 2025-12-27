import Missile from "./missile/Missile.mjs";

export default class Launcher {
  constructor(parent, x, y) {
    this.x      = x;
    this.y      = y;
    this.parent = parent;
  }

  update(mouse) {
    if (!mouse.fire || !mouse.visible) return;

    const parent = this.parent;
    const start  = { x:123, y:209 };
    const target = { x:mouse.x, y:mouse.y };
    
    this.launch(parent, start, target);
    mouse.fire = false;
  }

  launch(game, start, target) {
    game.missiles.push(new Missile(game, start, target, 100));
  }
}
