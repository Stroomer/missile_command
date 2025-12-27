import { BLUE } from '../../constants.mjs';
import { getLineBresenham } from '../../helpers.mjs';

export default class MissileComponent {
  constructor(parent, start, target, speed = 50) {
    this.parent       = parent;
    this.pixels       = getLineBresenham(start.x, start.y, target.x, target.y);
    this.total        = this.pixels.length;
    this.speed        = speed; // pixels per second
    this.progress     = 0; // float, allows smooth accumulation
    this.visibleCount = 0;
    this.color        = BLUE;
    this.index        = null;
    this.nextIndex    = null;
    this.visible      = true;
    
  }

  update(dt) {
      this.progress += this.speed * dt;
      this.nextIndex = this.progress | 0;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
  }
    
  drawRange(ctx, from, to) {
    ctx.fillStyle = this.color;

    const pixels = this.pixels;
    for (let i = from; i < to; i++) {
      const p = pixels[i];
      ctx.fillRect(p.x, p.y, 1, 1);
    }
  }

  drawSingle(ctx, index) {
    const p = this.pixels[index];
    if (!p) return;

    ctx.fillStyle = this.color;
    ctx.fillRect(p.x, p.y, 1, 1);
  }
}
