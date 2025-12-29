import MissileComponent from './MissileComponent.mjs';

export default class Smoke extends MissileComponent {
  constructor(parent, start, target, speed = 50) {
    super(parent, start, target, speed);
  }

  update(dt) {
    if (this.parent.exploded) {
      this.visible = false;
      return;
    }

    super.update(dt);
    
    if (this.nextIndex !== this.visibleCount) {
      this.visibleCount = Math.min(this.nextIndex, this.total);
    }

    if (this.visibleCount >= this.total) {
      this.visibleCount = this.total;
    }
  }

  draw(ctx) {
    if (!this.visible) return;
    super.drawRange(ctx, 0, this.visibleCount);
  }
}
