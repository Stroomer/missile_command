import Sprite from '../core/Sprite.mjs';
import { COLORS, HALF_H, HALF_W } from '../../constants.mjs';
import { createBuffer } from '../../buffer.mjs';
import { drawCircle } from '../../canvas.mjs';
import { easeOutQuad, easeInQuad } from '../../functions.mjs';

export default class Explosion extends Sprite {
  constructor(props) {
    super({
      ...props,
      name: 'explosion',
      x: props.x || props.destX || HALF_W,
      y: props.y || props.destY || HALF_H,
      width: 1,
      height: 1,
    });

    this.expandTime = props.expandTime || 0.2;
    this.collapseTime = props.collapseTime || 0.3;
    this.delay = props.delay || 0;
    this.radius = props.radius || Explosion.GIANT;
    this.phase = Explosion.STATE.SLEEP;
    this.time = 0;
    this.maxIndex = this.radius - 1;
  }

  update(dt) {
    if (this.garbage) return;

    this.time += dt;
    let eased;

    if (this.phase === Explosion.STATE.SLEEP) {
      if (this.time >= this.delay) {
        this.time = 0;
        this.parent.audio.playExplosion();
        this.phase = Explosion.STATE.EXPLODE;
      }
      return;
    } else if (this.phase === Explosion.STATE.EXPLODE) {
      const t = Math.min(this.time / this.expandTime, 1);
      eased = easeOutQuad(t);
      if (t >= 1) {
        this.time = 0;
        this.phase = Explosion.STATE.IMPLODE;
      }
    } else if (this.phase === Explosion.STATE.IMPLODE) {
      const t = Math.min(this.time / this.collapseTime, 1);
      eased = 1 - easeInQuad(t);
      if (t >= 1) {
        this.garbage = true;
        return;
      }
    } else return;

    const index = (eased * this.maxIndex) | 0;
    const buffer = Explosion.BUFFERS[this.parent.colorId][index];

    super.setBox(buffer.canvas);
    super.update(dt);
  }

  draw(ctx) {
    if (!this.garbage) super.draw(ctx);
  }
}

Explosion.GET_BUFFERS = function () {
  const GROUP_SIZE = 32;
  const buffers = [];

  for (let c = 0; c < COLORS.length; c++) {
    const group = new Array(GROUP_SIZE);
    const color = COLORS[c];

    for (let b = 0; b < GROUP_SIZE; b++) {
      const size = 2 + b * 2;
      group[b] = createBuffer(`explosion_col${c}_size${b}`, size, size);
      drawCircle(group[b], size, color);
    }

    buffers[c] = group;
  }

  Explosion.MIN_RADIUS = 2;
  Explosion.MAX_RADIUS = GROUP_SIZE;

  return buffers;
};

Explosion.MICRO = 2;
Explosion.SMALL = 8;
Explosion.MEDIUM = 16;
Explosion.LARGE = 24;
Explosion.GIANT = 32;

Explosion.STATE = {
  SLEEP: 0,
  EXPLODE: 1,
  IMPLODE: 2,
};

Explosion.BUFFERS = Explosion.GET_BUFFERS();
