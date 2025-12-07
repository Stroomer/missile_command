import { FIXED_DT } from '../constants.mjs';

export default class Sprite {
  constructor(x, y, width, height) {
    this.x           = x;
    this.y           = y;
    this.width       = width;
    this.height      = height;
    this.spritesheet = document.getElementById('sprites');  
  }

  update() {
    this.x += this.vx * this.speed * FIXED_DT;
    this.y += this.vy * this.speed * FIXED_DT;
  }

  draw() {
    
  }
}
