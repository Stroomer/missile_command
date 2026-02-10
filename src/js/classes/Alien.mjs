import { BLUE, COLORS, RED, WIDTH } from '../constants.mjs';
import { copyAndRecolor } from '../canvas.mjs';
import Sprite from './core/Sprite.mjs';
import { randomInt, randomPick } from '../helpers.mjs';
import { game } from '../../main.mjs';

export default class Alien extends Sprite {
  constructor(props = {}) {
    props.name   = "alien";
    props.x      = randomPick([-14, WIDTH + 14]);
    props.y      = randomInt(30, 120);
    props.width  = 14;
    props.height = 13;
    props.speed  = randomPick([10, 20, 30]);
    props.dirX   = props.x < 0 ? 1 : -1;

    super(props);
    
    this.antenna    = new Antenna(this, this.width, this.height);
    this.freeze     = false;
    this.exploded   = false;
    this.garbage    = false;
    this.time       = 0;
    this.freezeTime = 1.5;

    this.sprite     = copyAndRecolor(this.sheet, 36, 33, this.width, this.height, [
      { from: '#999999', to: BLUE },
      { from: '#666666', to: RED },
    ]);
    this.buffer     = this.sprite.getContext('2d');
  }

  update(dt) {
    if (!this.visible) return; 

    this.antenna.update(dt);
    
    if (!this.freeze) {
      super.update(dt);
    } else if (!this.exploded) {
      // this.cluster.x = this.x;
      // this.cluster.y = this.y;
      // this.cluster.exploded = true;
      
      console.log(this.parent);
      
     


      this.exploded = true;
    } else {
      //this.cluster.update(dt);

      

      this.time += dt;
      if (this.time > this.freezeTime) this.garbage = true;  
    }
  }

  draw(ctx) {
    if (!this.visible) return; 

    this.antenna.draw(this.buffer);
    super.draw(ctx);

    if (!this.exploded) return;
    //this.cluster.draw(ctx);
  }

  hit() {
    this.freeze = true;
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
    const colorId = this.parent.parent.colorId;
    this.color = COLORS[colorId];
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