import { getLineBresenham, getRandomColor } from '../../helpers.mjs';

export default class Projectile {
  constructor(parent, start, target, speed = 50) {
    this.game   = parent;
    this.pixels = getLineBresenham(start.x, start.y, target.x, target.y);
    this.total  = this.pixels.length;

    this.speed    = speed;   // pixels per second
    this.progress = 0;
    this.index    = 0;

    // cache color ONCE so it doesn't flicker every frame
    this.color  = getRandomColor();

    this.garbage = false;
  }

  update(dt) {
    this.progress += this.speed * dt;

    const nextIndex = this.progress | 0;

    if (nextIndex !== this.index) {
      this.index = Math.min(nextIndex, this.total - 1);
      this.color = getRandomColor();
    }

    if (this.index >= this.total - 1) {
      this.index = this.total - 1;
      this.garbage = true;
    }
  }

  draw(ctx) {
    const p = this.pixels[this.index];
    if (!p) return;

    ctx.fillStyle = this.color;
    ctx.fillRect(p.x, p.y, 1, 1);
  }
}
