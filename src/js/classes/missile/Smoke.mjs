import { BLUE } from '../../constants.mjs';
import { getLineBresenham } from '../../helpers.mjs';

export default class Smoke {
  constructor(parent, start, target, speed = 50) {
    this.game    = parent;
    this.pixels  = getLineBresenham(start.x, start.y, target.x, target.y);
    this.total   = this.pixels.length;

    this.speed   = speed;          // pixels per second
    this.progress = 0;             // float, allows smooth accumulation
    this.visibleCount = 0;

    this.garbage = false;
  }

  update(dt) {
    // advance in pixels
    this.progress += this.speed * dt;

    // clamp & convert to integer only once
    const nextCount = this.progress | 0;

    if (nextCount !== this.visibleCount) {
      this.visibleCount = Math.min(nextCount, this.total);
    }

    if (this.visibleCount >= this.total) {
      this.visibleCount = this.total;
      this.garbage = true;
    }
  }

  draw(ctx) {
    ctx.fillStyle = BLUE;

    // tight loop, no branching inside
    const pixels = this.pixels;
    for (let i = 0, n = this.visibleCount; i < n; i++) {
      const p = pixels[i];
      ctx.fillRect(p.x, p.y, 1, 1);
    }
  }
}
