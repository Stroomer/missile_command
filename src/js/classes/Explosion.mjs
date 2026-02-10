import Sprite from '../classes/core/Sprite.mjs'; 
import { COLORS, HALF_H, HALF_W } from '../constants.mjs';
import { createBuffer } from '../buffer.mjs';
import { drawCircle } from '../canvas.mjs';
import { easeOutQuad, easeInQuad } from '../helpers.mjs';

export default class Explosion extends Sprite {
  constructor(props = {}) {
    props.name     = "explosion";
    props.x        = props.x || props.destX || HALF_W;
    props.y        = props.y || props.destY || HALF_H;
    props.width    = 1;
    props.height   = 1;
    
    super(props);

    this.expandTime      = props.expandTime   || 0.2;
    this.collapseTime    = props.collapseTime || 0.3;
    this.delay           = props.delay        || 0;
    this.radius          = props.radius       || Explosion.MEDIUM;
    this.phase           = Explosion.STATE.EXPLODE;
    this.time            = 0;
    this.collisionRadius = 0;
    this.garbage         = false;
    this.visible         = true;
    this.box             = { x:this.x, y:this.y, width:this.width, height:this.height };
    this.sprite          = createBuffer('explosion', 1, 1).canvas;
    this.buffer          = this.sprite.getContext('2d');
    this.maxIndex        = Explosion.CALCULATE_MAX_INDEX(Explosion.BUFFERS, props.radius);
  }

  update(dt) {
    if(!this.visible) return;
    
    this.time += dt;
    let t, eased;

    switch (this.phase) {
      case Explosion.STATE.SLEEP:
        //console.log("launch");
        if (this.delay) {

        } else {
          
        }
        break;
      case Explosion.STATE.EXPLODE:
        t = Math.min(this.time / this.expandTime, 1);
        eased = easeOutQuad(t);
        if (t >= 1) {
          this.time = 0;
          this.phase = Explosion.STATE.IMPLODE;
        }
        break;
      case Explosion.STATE.IMPLODE:
        t = Math.min(this.time / this.collapseTime, 1);
        eased = 1 - easeInQuad(t);
        if (t >= 1) {
          this.phase = Explosion.STATE.REMOVE;
          // this.garbage = true;
          

          console.log("REMOVE");
        }
        break;
      case Explosion.STATE.REMOVE:
        this.visible  = false;
        //this.garbage = true;


        //this.parent.garbage = true;

        
        console.log("AAAAAAAAAAAAAAAAAAAAAAAA");
        

        break;
      default: return;    
    }

    
    
    const color  = this.parent.colorId;
    const index  = (eased * this.maxIndex) | 0;
    const buffer = Explosion.BUFFERS[color][index];

    super.setBox(buffer.canvas);
    super.update(dt);
    
    // console.log(this.radius);
    //this.collisionRadius = eased * this.radius;
  }

  draw(ctx) {
    if(!this.visible) return; 
    super.draw(ctx);
  }
}

Explosion.GET_BUFFERS = function () {
  const GROUP_SIZE = 32;
  const COLORS_SIZE = COLORS.length;

  let buffers = [];

  for (let c = 0; c < COLORS_SIZE; c++) {
    const group = new Array(GROUP_SIZE);
    const color = COLORS[c];

    for (let b = 0; b < GROUP_SIZE; b++) {
      const size = 2 + b * 2;
      const buffer = createBuffer(`explosion_col${c}_size${b}`, size, size);
      drawCircle(buffer, size, color);
      //console.log(`${b}.  Buffer ${size} x ${size}`);
      group[b] = buffer;
    }

    buffers[c] = group;
  }

  Explosion.MIN_RADIUS = 2;
  Explosion.MAX_RADIUS = buffers[0][buffers[0].length - 1].canvas.width / 2;

  return buffers;
};

Explosion.CALCULATE_MAX_INDEX = function (buffersCollection, radius) {
  const bufferWidth  = radius * 2;
  const buffers      = buffersCollection[0];
  const buffersCount = buffers.length;

  let max_index = 0;
  for (let i = 0; i < buffersCount; i++) {
    max_index = i;
    if (buffers[i].canvas.width === bufferWidth) {
      console.log(`Buffersize ${buffers[i].canvas.width} is gelijk aan ${bufferWidth}, dus ${i} is de maxIndex!`);
      break;
    }
  }

  return max_index;
};

Explosion.MICRO  = 2;
Explosion.SMALL  = 8;
Explosion.MEDIUM = 16;
Explosion.LARGE  = 24;
Explosion.GIANT  = 32;

Explosion.BUFFERS = Explosion.GET_BUFFERS();

Explosion.STATE = {
  SLEEP:  1,
  EXPLODE: 2, 
  IMPLODE: 3, 
  REMOVE:  4, 
};

// Explosion.VALIDATE = (props) => {
//   const { start, target, expandTime, collapseTime, radius } = props;

//   if (!start)                        throw Error("No start-location specified");
//   if (!target)                       throw Error("No target-location specified");
//   if (!expandTime)                   throw Error('No expandTime specified');
//   if (!collapseTime)                 throw Error('No collapseTime specified');
//   if (!radius)                       throw Error('No radius specified');
//   if (radius > Explosion.MAX_RADIUS) throw Error('Radius is exceeding maximum buffersize of ' + Explosion.MAX_RADIUS);

//   return props;
// };
