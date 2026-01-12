
import { BLUE, RED } from '../constants.mjs';
import { copyAndRecolor } from '../canvas.mjs';
import SpritesheetSprite from './core/SpritesheetSprite.mjs';

export default class City extends SpritesheetSprite {
  constructor(x, y) {
    super(x, y, 16, 8);
    
    this.sprite = copyAndRecolor(this.sheet, 36, 24, this.width, this.height, [
      { from:'#999999', to:BLUE },
      { from:'#666666', to:RED },
    ]);
    this.buffer = this.sprite.getContext('2d');
  }

  update() {}

  draw(ctx) {
    ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
  }
}
