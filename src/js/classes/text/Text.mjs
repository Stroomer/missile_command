import { BLUE, WIDTH, HEIGHT } from '../../constants.mjs';
import Sprite from '../core/Sprite.mjs';
import Char from './Char.mjs';

export default class Text extends Sprite {
  constructor(props) {
    const tracking = props.tracking ?? 1;
    const gap = props.gap ?? 16;
    const segments = props.values ?? [props.value];

    const segWidths = segments.map(s => Text.GET_WIDTH(s.split(''), tracking));
    const totalWidth = segWidths.reduce((sum, w) => sum + w, 0) + gap * segments.length;

    super({
      ...props,
      name: 'text',
      width: totalWidth,
      height: 7,
    });

    this.tracking = tracking;
    this.color = props.color ?? BLUE;
    this.align = props.align ?? Text.ALIGN.LEFT;
    this.valign = props.valign ?? Text.VALIGN.TOP;
    this.direction = props.direction ?? null;
    this.loop = props.loop ?? false;

    let posX = 0;
    for (let s = 0; s < segments.length; s++) {
      const chars = segments[s].split('');
      for (let i = 0; i < chars.length; i++) {
        const value = chars[i];
        if (value === ' ') {
          posX += Char.GET_RECT(' ').width + tracking;
          continue;
        }
        const char = new Char({ parent: this, value, color: this.color });
        this.buffer.drawImage(char.sprite, 0, 0, char.width, char.height, posX, 0, char.width, char.height);
        posX += char.width + tracking;
      }
      if (s < segments.length - 1) posX += gap;
    }
  }

  update(dt) {
    if (!this.direction || this.speed === 0) return;

    const spd = this.speed * dt;

    if (this.direction === Text.DIRECTION.LEFT) this.x -= spd;
    if (this.direction === Text.DIRECTION.RIGHT) this.x += spd;
    if (this.direction === Text.DIRECTION.UP) this.y -= spd;
    if (this.direction === Text.DIRECTION.DOWN) this.y += spd;

    // Compute effective render edges accounting for alignment
    let left = this.x;
    if (this.align === Text.ALIGN.CENTER) left -= this.width >> 1;
    else if (this.align === Text.ALIGN.RIGHT) left -= this.width;

    let top = this.y;
    if (this.valign === Text.VALIGN.MIDDLE) top -= this.height >> 1;
    else if (this.valign === Text.VALIGN.BOTTOM) top -= this.height;

    const right = left + this.width;
    const bottom = top + this.height;

    const isOff =
      (this.direction === Text.DIRECTION.LEFT && right < 0) ||
      (this.direction === Text.DIRECTION.RIGHT && left > WIDTH) ||
      (this.direction === Text.DIRECTION.UP && bottom < 0) ||
      (this.direction === Text.DIRECTION.DOWN && top > HEIGHT);

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

  draw(ctx) {
    let dx = this.x;
    let dy = this.y;

    if (this.align === Text.ALIGN.CENTER) dx -= this.width >> 1;
    else if (this.align === Text.ALIGN.RIGHT) dx -= this.width;

    if (this.valign === Text.VALIGN.MIDDLE) dy -= this.height >> 1;
    else if (this.valign === Text.VALIGN.BOTTOM) dy -= this.height;

    if (this.loop && this.direction) {
      const isH = this.direction === Text.DIRECTION.LEFT || this.direction === Text.DIRECTION.RIGHT;

      if (isH) {
        // Normalize dx so the first copy starts just off the left edge
        const startX = ((dx % this.width) + this.width) % this.width - this.width;
        for (let cx = startX; cx < WIDTH; cx += this.width) {
          ctx.drawImage(this.sprite, cx | 0, dy | 0, this.width, this.height);
        }
      } else {
        // Normalize dy so the first copy starts just off the top edge
        const startY = ((dy % this.height) + this.height) % this.height - this.height;
        for (let cy = startY; cy < HEIGHT; cy += this.height) {
          ctx.drawImage(this.sprite, dx | 0, cy | 0, this.width, this.height);
        }
      }
    } else {
      ctx.drawImage(this.sprite, dx | 0, dy | 0, this.width, this.height);
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
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
};

Text.VALIGN = {
  TOP: 'top',
  MIDDLE: 'middle',
  BOTTOM: 'bottom',
};

Text.DIRECTION = {
  LEFT: 'left',
  RIGHT: 'right',
  UP: 'up',
  DOWN: 'down',
};
