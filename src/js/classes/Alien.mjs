import { BLUE, COLORS, RED, WIDTH, YELLOW } from '../constants.mjs';
import { copyAndRecolor } from '../canvas.mjs';
import Sprite from './Sprite.mjs';
import { randomInt } from '../helpers.mjs';

export default class Alien extends Sprite {
  constructor(parent, x, y) {
    super(x, y, 14, 13);
    
    this.parent = parent;
    this.dirX   = x <= WIDTH / 2 ? 1 : -1;
    this.dirY   = 0;
    this.speed = 10 + randomInt(0, 10);
    this.sprite = copyAndRecolor(this.sheet, 36, 33, this.width, this.height, [
      { from: '#999999', to: BLUE },
      { from: '#666666', to: RED },
    ]);
    this.buffer = this.sprite.getContext('2d');
    this.freeze = false;
  }

  update(dt) {

    if (this.freeze) return;

    this.antennaColor = COLORS[this.parent.colorId];
    super.update(dt);
  }

  draw(ctx) {
    
    ctx.save();
    ctx.fillStyle = YELLOW;
    ctx.fillRect(this.x-this.halfW, (this.y-this.halfH) | 0, this.width, this.height);
    ctx.restore();

    this.drawAntennas(this.antennaColor);    
    super.draw(ctx);
  }

  drawAntennas(color) {
    const { width, height } = this;

    this.buffer.fillStyle = color;
    this.buffer.fillRect(0, 0, 1, 1);
    this.buffer.fillRect(width-1, 0, 1, 1);
    this.buffer.fillRect(width-1, height-1, 1, 1);
    this.buffer.fillRect(0, height-1, 1, 1);
  }
}