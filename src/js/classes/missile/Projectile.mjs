import { getRandomColor } from '../../helpers.mjs';
import MissileComponent from './MissileComponent.mjs';

export default class Projectile extends MissileComponent {
  constructor(parent, start, target, speed = 50) {
    super(parent, start, target, speed);
  }

  update(dt) {
    super.update(dt);

    if (this.nextIndex !== this.index) {
      this.index = Math.min(this.nextIndex, this.total - 1);
      this.color = getRandomColor();
    }

    if (this.index >= this.total - 1) {
      this.index = this.total - 1;
      this.parent.explode();
    }
  }

  draw(ctx) {
    super.drawSingle(ctx, this.index);
  }
}
