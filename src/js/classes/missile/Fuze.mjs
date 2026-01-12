import { COLORS } from '../../constants.mjs';

export default class Fuze {
  constructor(props) {
    this.parent        = props.parent;
    this.speed         = props.speed;
    this.color         = props.color;
    this.pixels        = props.pixels;
    this.lastIndex     = props.pixels.length - 1;
    this.progress      = 0;
    this.visiblePixels = 0;
    this.index         = 0;
    this.visible       = true;
  }

  update(dt) {
    const next = (this.progress += this.speed * dt) | 0;
    this.index = next < this.lastIndex ? next : this.lastIndex;

    if (this.index === this.lastIndex) {
      this.parent.explode();
      return;
    }

    const parentColor = this.parent.parent.colorId;
    this.color = COLORS[parentColor];
  }

  draw(ctx) {
    if (!this.visible) return;

    const p = this.pixels[this.index];
    if (p === undefined) return;

    ctx.fillStyle = this.color;
    ctx.fillRect(p.x, p.y, 1, 1);
  }
}



 // if (aabb(this.missiles[i].explosion, this.aliens[0])) {
    //   this.aliens[0].freeze = true;
    //   //boem

    // }