import { BLUE, COLORS, ORANGE, RED, WIDTH, YELLOW } from '../constants.mjs';
import { copyAndRecolor } from '../canvas.mjs';
import SpritesheetSprite from './core/SpritesheetSprite.mjs';
import { randomInt } from '../helpers.mjs';
import Explosion from './missile/Explosion.mjs';

export default class Alien extends SpritesheetSprite {
  constructor(parent, x, y, width=14, height=13, speed=50) {
    super(x | 0, y | 0, width, height);
    
    this.parent = parent;
    this.dirX      = x <= WIDTH / 2 ? 1 : -1;
    this.dirY      = 0;
    this.speed     = 10 + randomInt(0, 10);
    this.sprite    = copyAndRecolor(this.sheet, 36, 33, width, height, [
      { from: '#999999', to: BLUE },
      { from: '#666666', to: RED },
    ]);
    this.buffer    = this.sprite.getContext('2d');
    this.antenna   = new Antenna(this, width, height);
    //this.explosion = new Explosion({ parent:this, x, y, radius:2*this.body.width, expandTime:3.25, collapseTime:2.60 });
    this.phase     = 0;
    this.speed     = speed;
    this.freeze    = false;
    this.exploded  = false;
    this.garbage   = false;
  }

  update(dt) {
    

    this.antenna.update(dt);
    if(!this.freeze) super.update(dt);

    //this.explosion.update(dt);
  }

  draw(ctx) {

    this.antenna.draw(this.buffer);    
    super.draw(ctx);

    //this.body.draw(ctx);
    //this.explosion.draw(ctx);
  }
}

class Body extends SpritesheetSprite {
  constructor(parent, x, y, width, height) {
    super(x, y, width, height);
    console.log(x, y);
  }

  update(dt) {     
    // this.parent.antenna.update(dt);
    // if(!this.parent.freeze) super.update(dt);
  }

  draw(ctx) {
    // ctx.save();
    // ctx.fillStyle = YELLOW;
    // ctx.fillRect(this.x-this.halfW, (this.y-this.halfH) | 0, this.width, this.height);
    // ctx.restore();
    // this.parent.antenna.draw(this.buffer);    
    // super.draw(ctx);
  }
}

class Antenna {
  constructor(parent, width, height) {
    this.parent = parent;
    this.width  = width;
    this.height = height;
    this.color  = null;
  }

  update(dt) {
    this.color = COLORS[this.parent.parent.colorId];
  }

  draw(buffer) {
    const w = this.width  - 1;
    const h = this.height - 1;

    buffer.fillStyle = this.color;
    buffer.fillRect(0, 0, 1, 1);
    buffer.fillRect(w, 0, 1, 1);
    buffer.fillRect(w, h, 1, 1);
    buffer.fillRect(0, h, 1, 1);
  }
}