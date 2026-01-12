import { PURPLE } from '../../constants.mjs';

export default class Smoke {
  constructor(props) {
    this.parent        = props.parent;
    this.speed         = props.speed;
    this.color         = props.color;
    this.pixels        = props.pixels;
    this.lastIndex     = props.pixels.length;
    this.progress      = 0;
    this.visiblePixels = 0;
    this.visible       = true;
  }

  update(dt) {
    const next = (this.progress += this.speed * dt) | 0;
    this.visiblePixels = next < this.lastIndex ? next : this.lastIndex;
  }

  draw(ctx) {
    if (!this.visible || this.visiblePixels === 0) return;

    ctx.fillStyle = this.color;

    const pixels = this.pixels;
    for (let i = 0, n = this.visiblePixels; i < n; i++) {
      const p = pixels[i];
      ctx.fillRect(p.x, p.y, 1, 1);
    }
  }
}
