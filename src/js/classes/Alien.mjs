import { blue, red, WIDTH } from '../constants.mjs';
import { cutAndRecolor } from '../canvas.mjs';
import Sprite from './Sprite.mjs';

export default class Alien extends Sprite {
  constructor(x, y, dot) {
    super(x, y, 14, 13);
    
    this.dot    = dot;
    this.speed  = 50;
    this.vx     = x <= WIDTH / 2 ? 1 : -1;
    this.vy     = 0;
    this.sprite = cutAndRecolor(this.sheet, 62, 24, this.width, this.height, [
      { from: '#999999', to: blue },
      { from: '#666666', to: red },
    ]);
    this.buffer = this.sprite.getContext('2d');
  }

  update(dt) {
    super.update(dt);
  }

  draw(ctx) {
    this.drawAntennas(this.dot.color);
    super.draw(ctx);
  }

  drawAntennas(color) {
    const w = this.width;
    const h = this.height;

    this.buffer.fillStyle = color;
    this.buffer.fillRect(0,   0,   1, 1);
    this.buffer.fillRect(w-1, 0,   1, 1);
    this.buffer.fillRect(w-1, h-1, 1, 1);
    this.buffer.fillRect(0,   h-1, 1, 1);
  }
}