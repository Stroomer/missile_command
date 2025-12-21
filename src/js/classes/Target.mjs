import { cutAndRecolor } from '../canvas.mjs';
import { blue } from '../constants.mjs';
import Sprite from './Sprite.mjs';

export default class Target extends Sprite {
  constructor(x, y, parent) {
    super(x, y, 5, 5);
    
    this.game      = parent;
    this.sprite    = cutAndRecolor(this.sheet, 9, 24, this.width, this.height, [{ from:'#999999', to:blue }]);
    this.buffer    = this.sprite.getContext('2d');
    this.color     = blue;
    this.visible   = true;
    this.positions = [0, 0, 4, 0, 1, 1, 3, 1, 2, 2, 1, 3, 3, 3, 0, 4, 4, 4];
    this.garbage   = false;
  }

  update(dt) {
    this.color = this.game.dot.color;
  }

  draw(ctx) {
    if (this.garbage) return; 
    const { buffer, positions, color } = this;
    // draw flash on local buffer
    buffer.fillStyle = color;  
    for (let i = 0; i < positions.length; i+=2) {
      const x = positions[i];
      const y = positions[i + 1];
      buffer.fillRect(x, y, 1, 1);
    }

    super.draw(ctx);
  }
}
