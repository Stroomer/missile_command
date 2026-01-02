import MissileComponent from './MissileComponent.mjs';

export default class Smoke extends MissileComponent {
  constructor(props) {
    super(props);
  }

  update(dt) {
    if (this.parent.garbage) {
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
