import { cutAndRecolor } from '../canvas.mjs';
import { FIXED_DT, colors, enemyMissile, blue, WIDTH, HEIGHT, cyan } from '../constants.mjs';
import { drawPixel } from '../drawing.mjs';
import { drawLineBresenham, getUnitVector, withinBounds } from '../helpers.mjs';
import Sprite from './Sprite.mjs';

export default class Missile extends Sprite {
  constructor(x0, y0, x1, y1, parent) {
    super(x0, y0, 1, 1);
    console.log('construct new Missile', x0, y0, x1, y1);
    
    const { vx, vy } = getUnitVector(x0, y0, x1, y1);

    // remove missile with uid tech

    this.uid        = parent.missiles.length + 1;
    this.game       = parent;
    this.dot        = parent.dot;
    this.smokeColor = blue;

    this.targetX    = x1;
    this.targetY    = y1;
    
    this.prevX      = x0;
    this.prevY      = y0;
    this.vx         = vx;
    this.vy         = vy;
    this.speed      = 230;
    this.smokeColor = blue;
    this.sprite     = cutAndRecolor(this.sheet, 1, 32, this.width, this.height, [ { from: '#999999', to: cyan } ]);
    this.buffer     = this.sprite.getContext('2d');
    this.garbage    = false;
  }

  update(dt) {
    const dx = Math.abs(this.x - this.targetX) | 0;
    const dy = Math.abs(this.y - this.targetY) | 0;

    // console.log('dx, dy', dx, dy);
    

    if (dx === 0 && dy === 0) {
      this.garbage = true;
      console.log('garbage!');
    }    

    this.prevX = this.x;
    this.prevY = this.y;

    

    super.update(dt);

    // console.log(this.x, this.y);
  }

  draw(smoke, missiles) {
    this.drawSmoke(smoke, blue);          // draw smoke trail
    this.drawProjectile(this.dot.color);  // draw missile as a single flashing pixel
    super.draw(missiles);
  }

  drawProjectile(color) {
    this.buffer.fillStyle = color;
    this.buffer.fillRect(0, 0, 1, 1);
  }

  drawSmoke(smoke, color) {
    smoke.fillStyle = color;

    const px = this.prevX | 0;
    const py = this.prevY | 0;
    const nx = this.x | 0;
    const ny = this.y | 0;

    drawLineBresenham(px, py, nx, ny, smoke);
  }
}