import { getRandomColor } from '../../helpers.mjs';
import MissileComponent from './MissileComponent.mjs';

export default class Projectile extends MissileComponent {
  constructor(props) {
    super(props);
  }

  update(dt) {
    if (this.parent.exploded) {
      this.visible = false;
      return;
    }
    
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
    if (!this.visible) return;
    super.drawSingle(ctx, this.index);
  }
}
