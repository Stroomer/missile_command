import { FIXED_DT } from '../constants.mjs';

export default class Sprite {
  constructor(x, y, width, height) {
    this.x      = x;
    this.y      = y;
    this.width  = width;
    this.height = height;
    this.halfW  = width / 2;
    this.halfH  = height / 2;
    this.speed  = 0;
    this.vx     = 0;
    this.vy     = 0;
    this.sheet  = document.getElementById('sprites');  
  }

  update() {
    this.x += this.vx * this.speed * FIXED_DT;
    this.y += this.vy * this.speed * FIXED_DT;
  }

  draw(ctx) {
    const x = (this.x-this.halfW ) | 0;
    const y = (this.y-this.halfH)  | 0;
    const w = this.width;
    const h = this.height;

    ctx.drawImage(this.sprite, x, y, w, h);
  }
}
