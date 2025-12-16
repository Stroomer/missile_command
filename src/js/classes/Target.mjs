import { cutAndRecolor } from '../canvas.mjs';
import { blue } from '../constants.mjs';
import Sprite from './Sprite.mjs';

export default class Target extends Sprite {
  constructor(x, y, dot) {
    super(x, y, 5, 5);
    
    console.log('TARGET', x, y);
    

    this.dot       = dot;
    this.sprite    = cutAndRecolor(this.sheet, 9, 24, this.width, this.height, [{ from:'#999999', to:blue }]);
    this.buffer    = this.sprite.getContext('2d');
    this.color     = blue;
    this.visible   = true;
    this.positions = [0, 0, 4, 0, 1, 1, 3, 1, 2, 2, 1, 3, 3, 3, 0, 4, 4, 4];  
  }

  update(mouse) {
    //super.update();
  }

  draw(ctx) {
    //if (!this.visible) return;
    this.drawFlash(this.buffer, this.positions, this.positions.length, this.dot.color);  
    super.draw(ctx);
    // const size = 10;
    // const half = size / 2;
  }
    
  drawFlash(buffer, positions, posCount, color) {
    buffer.fillStyle = color;  
    for (let i = 0; i < posCount; i+=2) {
      const x = positions[i];
      const y = positions[i + 1];
      buffer.fillRect(x, y, 1, 1);
    }
  }
}
