import { blue, height, red, width } from '../constants.mjs';
import { cutAndRecolor } from '../canvas.mjs';

export default class Alien {
  constructor(x, y, sprites) {
    this.x = x;
    this.y = y;
    this.w = 14;
    this.h = 13;

    this.sprite = cutAndRecolor(sprites, 62, 24, this.w, this.h, [
      { from: '#999999', to: blue },
      { from: '#666666', to: red },
    ]);
  }

  update() {

    console.log('alien');
    
  }

  draw(ctx) {
    const { w, h } = this;
    const x = (this.x - (w/2)) | 0;
    const y = (this.y - (h/2)) | 0;
    ctx.drawImage(this.sprite, x, y, w, h);
  }
}
