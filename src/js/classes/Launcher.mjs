import { BLUE } from "../constants.mjs";
import Explosion from "./Explosion.mjs";
import Missile from "./Missile.mjs";

export default class Launcher {
  constructor(parent) {
    this.parent = parent;
  }

  update(mouse) {
    if (!mouse.fire || !mouse.visible) return;

    const parent       = this.parent;
    const x            = 123
    const y            = 209;
    const target       = { x:mouse.x, y:mouse.y };
    const speed        = 110;
    const color        = BLUE ;
    const radius       = Explosion.GIANT;
    const expandTime   = 0.2;
    const collapseTime = 0.3;
    const props        = { parent, x, y, target, speed, color, radius, expandTime, collapseTime };

    //this.launch(props);

    this.launch({
      parent: this.parent,
      x: 123,
      y: 209,
      destX: mouse.x,
      destY: mouse.y,
      speed: 110,
      color: BLUE,
      radius: Explosion.GIANT,
      expandTime: 0.2,
      collapseTime: 0.3,
    });

    mouse.fire = false;
  }

  launch(props) {
    this.parent.missiles.push(new Missile(props));
  }
}