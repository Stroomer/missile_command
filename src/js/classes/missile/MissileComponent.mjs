import { getLineBresenham } from '../../helpers.mjs';

export default class MissileComponent {
  constructor(props) {    
    this.parent       = props.parent;
    this.speed        = props.speed; // pixels per second
    this.color        = props.color;
    this.pixels       = getLineBresenham(props.start.x, props.start.y, props.target.x, props.target.y);
    this.total        = this.pixels.length;
    this.progress     = 0;
    this.visibleCount = 0;
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
