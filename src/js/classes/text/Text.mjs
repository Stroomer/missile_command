import { BLUE, WIDTH, HEIGHT } from '../../constants.mjs';
import Buffer from '../core/Buffer.mjs';
import Sprite from '../core/Sprite.mjs';
import Char from './Char.mjs';

export default class Text extends Sprite {
  constructor(props) {
    const tracking = props.tracking ?? 1;
    const gap      = props.gap ?? 16;

    // Compute initial width before super() since Sprite needs it
    const rawSegs = props.values ?? [props.value];
    const initSegs = rawSegs.map((s) =>
      typeof s === 'string'
        ? { value: s, blink: props.blink ?? false }
        : { value: s.value, blink: s.blink ?? props.blink ?? false }
    );
    const totalWidth = initSegs
      .map((s) => Text.GET_WIDTH(s.value.split(''), tracking))
      .reduce((sum, w) => sum + w, 0) + gap * initSegs.length;

    super({ ...props, name: 'text', width: totalWidth, height: 7 });

    this.tracking  = tracking;
    this.gap       = gap;
    this.color     = props.color ?? BLUE;
    this.align     = props.align ?? Text.ALIGN.LEFT;
    this.valign    = props.valign ?? Text.VALIGN.TOP;
    this.direction = props.direction ?? null;
    this.loop      = props.loop ?? false;
    this.blinkRate = props.blinkRate ?? 2; // Hz
    this.blinkTimer = 0;
    this.blinkOn    = true;

    this._buildSegs(initSegs);
  }

  /**
   * Rebuild rendered segments from a normalised array of { value, blink } objects.
   * Updates this.width, this.segs, and this.hasBlink in-place.
   */
  _buildSegs(segs) {
    const segWidths = segs.map((s) => Text.GET_WIDTH(s.value.split(''), this.tracking));
    this.width = segWidths.reduce((sum, w) => sum + w, 0) + this.gap * segs.length;

    this.segs = [];
    let posX = 0;

    for (let s = 0; s < segs.length; s++) {
      const seg  = segs[s];
      const segW = segWidths[s];
      const chars = seg.value.split('');

      const segCtx = Buffer.create('text_seg', segW, 7);
      let cx = 0;

      for (const ch of chars) {
        if (ch === ' ') {
          cx += Char.GET_RECT(' ').width + this.tracking;
          continue;
        }
        const char = new Char({ parent: this, value: ch, color: this.color });
        segCtx.drawImage(char.sprite, 0, 0, char.width, char.height, cx, 0, char.width, char.height);
        cx += char.width + this.tracking;
      }

      this.segs.push({ canvas: segCtx.canvas, offsetX: posX, width: segW, blink: seg.blink });
      posX += segW + this.gap;
    }

    this.hasBlink = this.segs.some((s) => s.blink);
  }

  /**
   * Replace all segments. Accepts the same format as the constructor's `values` prop:
   * an array of strings or { value, blink } objects.
   */
  setValues(values) {
    const segs = values.map((s) =>
      typeof s === 'string'
        ? { value: s, blink: false }
        : { value: s.value, blink: s.blink ?? false }
    );
    this._buildSegs(segs);
  }

  /** Replace the text with a single plain string. */
  setValue(str) {
    this._buildSegs([{ value: str, blink: false }]);
  }

  update(dt) {
    if (this.hasBlink) {
      this.blinkTimer += dt;
      const half = 0.5 / this.blinkRate;
      if (this.blinkTimer >= half) {
        this.blinkTimer -= half;
        this.blinkOn = !this.blinkOn;
      }
    }

    if (!this.direction || this.speed === 0) return;

    const spd = this.speed * dt;

    if (this.direction === Text.DIRECTION.LEFT)  this.x -= spd;
    if (this.direction === Text.DIRECTION.RIGHT) this.x += spd;
    if (this.direction === Text.DIRECTION.UP)    this.y -= spd;
    if (this.direction === Text.DIRECTION.DOWN)  this.y += spd;

    // Compute effective render edges accounting for alignment
    let left = this.x;
    if (this.align === Text.ALIGN.CENTER)     left -= this.width >> 1;
    else if (this.align === Text.ALIGN.RIGHT) left -= this.width;

    let top = this.y;
    if (this.valign === Text.VALIGN.MIDDLE)    top -= this.height >> 1;
    else if (this.valign === Text.VALIGN.BOTTOM) top -= this.height;

    const right  = left + this.width;
    const bottom = top  + this.height;

    const isOff =
      (this.direction === Text.DIRECTION.LEFT  && right  < 0)    ||
      (this.direction === Text.DIRECTION.RIGHT && left   > WIDTH) ||
      (this.direction === Text.DIRECTION.UP    && bottom < 0)    ||
      (this.direction === Text.DIRECTION.DOWN  && top    > HEIGHT);

    if (isOff) {
      if (this.loop) {
        if (this.direction === Text.DIRECTION.LEFT)  this.x += this.width;
        if (this.direction === Text.DIRECTION.RIGHT) this.x -= this.width;
        if (this.direction === Text.DIRECTION.UP)    this.y += this.height;
        if (this.direction === Text.DIRECTION.DOWN)  this.y -= this.height;
      } else {
        this.garbage = true;
      }
    }
  }

  _drawSegs(ctx, ox, oy) {
    for (const seg of this.segs) {
      if (seg.blink && !this.blinkOn) continue;
      ctx.drawImage(seg.canvas, (ox + seg.offsetX) | 0, oy | 0, seg.width, this.height);
    }
  }

  draw(ctx) {
    let dx = this.x;
    let dy = this.y;

    if (this.align === Text.ALIGN.CENTER)     dx -= this.width >> 1;
    else if (this.align === Text.ALIGN.RIGHT) dx -= this.width;

    if (this.valign === Text.VALIGN.MIDDLE)      dy -= this.height >> 1;
    else if (this.valign === Text.VALIGN.BOTTOM) dy -= this.height;

    if (this.loop && this.direction) {
      const isH = this.direction === Text.DIRECTION.LEFT || this.direction === Text.DIRECTION.RIGHT;

      if (isH) {
        const startX = (((dx % this.width) + this.width) % this.width) - this.width;
        for (let cx = startX; cx < WIDTH; cx += this.width) {
          this._drawSegs(ctx, cx, dy);
        }
      } else {
        const startY = (((dy % this.height) + this.height) % this.height) - this.height;
        for (let cy = startY; cy < HEIGHT; cy += this.height) {
          this._drawSegs(ctx, dx, cy);
        }
      }
    } else {
      this._drawSegs(ctx, dx, dy);
    }
  }
}

Text.GET_WIDTH = (charsArray, tracking) => {
  let w = 0;

  for (let i = 0; i < charsArray.length; i++) {
    const char = charsArray[i];
    const { width } = Char.GET_RECT(char);
    w += width + (i === charsArray.length - 1 ? 0 : tracking);
  }

  return w;
};

Text.ALIGN = {
  LEFT:   'left',
  CENTER: 'center',
  RIGHT:  'right',
};

Text.VALIGN = {
  TOP:    'top',
  MIDDLE: 'middle',
  BOTTOM: 'bottom',
};

Text.DIRECTION = {
  LEFT:  'left',
  RIGHT: 'right',
  UP:    'up',
  DOWN:  'down',
};
