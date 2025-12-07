import { FIXED_DT, colors, enemyMissile, blue, WIDTH, HEIGHT } from '../constants.mjs';
import { drawPixel } from '../drawing.mjs';
import { toUnitVector, randomInt, unitVector } from '../helpers.mjs';
import Sprite from './Sprite.mjs';

export default class Missile extends Sprite {
  constructor(x, y, dot) {
    super(x, y, 1, 1);
    console.log('construct new Missile');
    
    this.dot        = dot;
    this.vx         = toUnitVector(0, 0, WIDTH, HEIGHT).vx;
    this.vy         = toUnitVector(0, 0, WIDTH, HEIGHT).vy;
    this.speed      = 30;
    
    this.colorId = randomInt(0, colors.length - 1);
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


