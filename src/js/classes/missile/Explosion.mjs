import SpritesheetSprite from '../core/SpritesheetSprite.mjs';
import { COLORS, DEBUG } from '../../constants.mjs';
import { createBuffer } from '../../buffer.mjs';
import { drawCircle } from '../../canvas.mjs';
import { easeOutQuad, easeInQuad } from '../../helpers.mjs';
import { drawBoundingBox } from '../../debug.mjs';

export default class Explosion extends SpritesheetSprite {
  constructor(props) {

    props = Explosion.VALIDATE(props);

    super(props.target.x, props.target.y, 1, 1);

    this.parent          = props.parent;
    this.expandTime      = props.expandTime;
    this.collapseTime    = props.collapseTime;
    this.radius          = props.radius;
    this.maxIndex        = Explosion.CALCULATE_MAX_INDEX(Explosion.BUFFERS, props.radius);
    this.sprite          = createBuffer('explosion', 1, 1).canvas;
    this.buffer          = this.sprite.getContext('2d');
    this.garbage         = false;
    this.time            = 0;
    this.phase           = 0; // 0 = expand, 1 = collapse
    this.collisionRadius = 0;
    this.debug           = true;
  }

  update(dt) {
    if (!this.parent.exploded) return;

    this.time += dt;
    let t, eased;

    if (this.phase === 0) {
      t = Math.min(this.time / this.expandTime, 1);
      eased = easeOutQuad(t);
      if (t >= 1) {
        this.phase = 1;
        this.time = 0;
      }
    } else {
      t = Math.min(this.time / this.collapseTime, 1);
      eased = 1 - easeInQuad(t);
      if (t >= 1) {
        this.parent.garbage = true;
        return;
      }
    }

    const color = this.parent.parent.colorId;
    const index = (eased * this.maxIndex) | 0;
    const buffer = Explosion.BUFFERS[color][index];

    this.sprite = super.getSprite(buffer.canvas);
    this.collisionRadius = eased * this.radius;

    super.update(dt);
  }

  draw(ctx) {
    if(!this.parent.exploded) return; 

    // if (DEBUG) {  
    //   drawBoundingBox(ctx, this);
    // }

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
      console.log(`Buffer ${size} x ${size}`);
      group[b] = buffer;
    }

    buffers[c] = group;
  }

  Explosion.MIN_RADIUS = 2;
  Explosion.MAX_RADIUS = buffers[0][buffers[0].length - 1].canvas.width / 2;

  console.log(Explosion.MAX_RADIUS);

  return buffers;
};

Explosion.CALCULATE_MAX_INDEX = function (buffersCollection, radius) {
  const bufferWidth = radius * 2;
  const buffers = buffersCollection[0];
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

Explosion.SMALL = 8;
Explosion.MEDIUM = 16;
Explosion.LARGE = 24;
Explosion.GIANT = 32;

Explosion.BUFFERS = Explosion.GET_BUFFERS();

Explosion.VALIDATE = (props) => {
  const { start, target, expandTime, collapseTime, radius } = props;

  if (!start)                        throw Error("No start-location specified");
  if (!target)                       throw Error("No target-location specified");
  if (!expandTime)                   throw Error('No expandTime specified');
  if (!collapseTime)                 throw Error('No collapseTime specified');
  if (!radius)                       throw Error('No radius specified');
  if (radius > Explosion.MAX_RADIUS) throw Error('Radius is exceeding maximum buffersize of ' + Explosion.MAX_RADIUS);

  return props;
};
