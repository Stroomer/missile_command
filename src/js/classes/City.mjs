
import { cutAndRecolor } from '../canvas.mjs';
import { blue, red } from '../constants.mjs';
import Sprite from './Sprite.mjs';

export default class City extends Sprite {
  constructor(x, y) {
    super(x, y, 16, 8);
    


    this.sprite = cutAndRecolor(this.sheet, 36, 24, this.width, this.height, [
      { from:'#999999', to:blue },
      { from:'#666666', to:red },
    ]);
    this.buffer = this.sprite.getContext('2d');
  }

  update() {}

  draw(ctx) {
    ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
  }
}
