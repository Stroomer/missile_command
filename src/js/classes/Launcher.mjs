import { BLUE, RED, YELLOW } from "../constants.mjs";
import Missile from "./missile/Missile.mjs";

export default class Launcher {
  constructor(parent) {
    this.parent = parent;
  }

  update(mouse) {
    if (!mouse.fire || !mouse.visible) return;

    const parent       = this.parent;
    const start        = { x:123, y:209 };
    const target       = { x:mouse.x, y:mouse.y };
    const speed        = 110;
    const color        = BLUE ;
    const radius       = 32;
    const expandTime   = 3.25;
    const collapseTime = 2.60;
    const props        = { parent, start, target, speed, color, radius, expandTime, collapseTime };

    this.launch(props);

    mouse.fire = false;
  }

  launch(props) {
    this.parent.missiles.push(new Missile(props));
  }
}