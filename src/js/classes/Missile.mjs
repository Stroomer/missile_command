import { FIXED_DT, colors, enemyMissile, blue, width, height } from '../constants.mjs';
import { drawPixel } from '../drawing.mjs';
import { toUnitVector, randomInt, unitVector } from '../helpers.mjs';

export default class Missile {
  constructor(x, y) {
    console.log('construct new Missile');
    
    const { minX, minY, maxX, maxY, minSpeed } = enemyMissile; 
    
    this.x          = x || minX;
    this.y          = y || minY;
    this.vx         = toUnitVector(0, 0, width, height).vx;
    this.vy         = toUnitVector(0, 0, width, height).vy;
    this.speed      = minSpeed;
    this.colorId    = randomInt(0, colors.length - 1);
    this.color      = colors[this.colorId];
    this.smokeColor = blue;
  }

  update() {
    this.x += this.vx * this.speed * FIXED_DT;
    this.y += this.vy * this.speed * FIXED_DT;
    
    this.colorId = this.colorId - 1 < 0 ? colors.length - 1 : this.colorId - 1;  
    this.color   = colors[this.colorId];   
  }

  draw(smoke, missiles) {
    const x = this.x | 0;
    const y = this.y | 0;
      
    drawPixel(smoke,    x, y, this.smokeColor);
    drawPixel(missiles, x, y, this.color);
  }
}


