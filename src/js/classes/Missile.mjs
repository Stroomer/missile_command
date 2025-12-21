import { cutAndRecolor } from '../canvas.mjs';
import { blue, cyan } from '../constants.mjs';
import { drawLineBresenham, getUnitVector, withinBounds } from '../helpers.mjs';
import Sprite from './Sprite.mjs';

export default class Missile extends Sprite {
  constructor(x0, y0, x1, y1, parent) {
    super(x0, y0, 1, 1);
    console.log('construct new Missile', x0, y0, x1, y1, `id = ${parent.missiles.length}`);

    this.game       = parent;
    this.targetX    = x1;
    this.targetY    = y1;
    this.prevX      = x0;
    this.prevY      = y0;
    this.speed      = 230;
    this.vx         = getUnitVector(x0, y0, x1, y1).vx
    this.vy         = getUnitVector(x0, y0, x1, y1).vy;
    this.sprite     = cutAndRecolor(this.sheet, 1, 32, this.width, this.height, [ { from: '#999999', to: cyan } ]);
    this.buffer     = this.sprite.getContext('2d');
    this.exploded   = false;
    this.garbage    = false;
  }

  update(dt) {    
    const { x, y, targetX, targetY, exploded } = this;
    const distanceX = Math.abs(x - targetX) | 0;
    const distanceY = Math.abs(y - targetY) | 0;
    const triggered = distanceX <= 1 && distanceY <= 1 ? true : false;
       
    if (!exploded) {
      if (triggered) {
        this.explode();
        return;
      }  
    }  
    
    this.prevX = this.x;
    this.prevY = this.y;
    super.update(dt);    
  }

  draw(ctx) {
    this.drawSmoke(this.game.buffer.smoke); // draw smoke trail
    
    // draw missile as a single flashing pixel
    this.buffer.fillStyle = this.game.dot.color;
    this.buffer.fillRect(0, 0, 1, 1);
    this.game.buffer.missiles.drawImage(this.buffer.canvas, this.x | 0, this.y | 0);

    super.draw(ctx); // draw missile sprite
  }

  drawSmoke(smokeBuffer) {
    smokeBuffer.fillStyle = blue;

    const px = this.prevX | 0;
    const py = this.prevY | 0;
    const nx = this.x | 0;
    const ny = this.y | 0;

    drawLineBresenham(px, py, nx, ny, smokeBuffer);
  }
  
  explode() {
    console.log('explode');
    //console.log(this.id);
    // console.log(this.game.targets.length);
    //this.game.targets[this.id].garbage = true;
    this.exploded = true;
    this.game.audio.playExplosion();
  }
}