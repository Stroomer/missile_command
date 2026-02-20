import { BLUE } from '../../constants.mjs';
import Explosion from '../entities/Explosion.mjs';

export default class Launcher {
  constructor(parent) {
    this.parent = parent;
  }

  update(mouse) {
    if (!this.parent.mouse.fire || !this.parent.mouse.visible) return;

    const parent = this.parent;
    const x = 123;
    const y = 209;
    const target = { x: this.parent.mouse.x, y: this.parent.mouse.y };
    const speed = 110;
    const color = BLUE;
    const radius = Explosion.GIANT;
    const expandTime = 0.2;
    const collapseTime = 0.3;
    const props = { parent, x, y, target, speed, color, radius, expandTime, collapseTime };

    //this.launch(props);

    this.launch({
      parent: this.parent,
      x: 123,
      y: 211,
      destX: this.parent.mouse.x,
      destY: this.parent.mouse.y,
      speed: 110,
      color: BLUE,
      radius: Explosion.GIANT,
      expandTime: 0.2,
      collapseTime: 0.3,
    });

    this.parent.mouse.fire = false;
  }

  launch(props) {
    this.parent.factory.createMissile(props);
  }
}
