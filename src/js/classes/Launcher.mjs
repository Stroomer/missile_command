import { BLUE, RED, YELLOW } from "../constants.mjs";
import Missile from "./missile/Missile.mjs";

export default class Launcher {
  constructor(parent) {
    this.parent = parent;
  }

  update(mouse) {
    //console.log('yo');
    
    if (!mouse.fire || !mouse.visible) return;

    const parent     = this.parent;
    const start      = { x:123, y:209 };
    const target     = { x:mouse.x, y:mouse.y };
    const speed      = 110;
    const color      = BLUE ;
    const radius     = 40;
    const props      = { parent, start, target, speed, color, radius };

    this.launch(props);

    mouse.fire = false;
  }

  launch(props) {
    props.parent.missiles.push(new Missile(props));
  }
}