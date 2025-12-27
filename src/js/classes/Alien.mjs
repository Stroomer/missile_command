import { BLUE, COLORS, RED, WIDTH } from '../constants.mjs';
import { cutAndRecolor } from '../canvas.mjs';
import Sprite from './Sprite.mjs';

export default class Alien extends Sprite {
  constructor(parent, x, y) {
    super(x, y, 14, 13);
    
    console.log("alien", this.x, this.y, this.width, this.height);

    this.parent = parent;
    this.speed  = 50;
    this.vx     = x <= WIDTH / 2 ? 1 : -1;
    this.vy     = 0;
    this.sprite = cutAndRecolor(this.sheet, 36, 33, this.width, this.height, [
      { from: '#999999', to: BLUE },
      { from: '#666666', to: RED },
    ]);
    this.buffer = this.sprite.getContext('2d');    
  }

  update(dt) {
    this.antennaColor = COLORS[this.parent.colorId];

    super.update(dt);
  }

  draw(ctx) {
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