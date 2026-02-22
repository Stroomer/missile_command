import Canvas from '../core/Canvas.mjs';
import { BLACK, BLUE } from '../../constants.mjs';
import Sprite from '../core/Sprite.mjs';

export default class Char extends Sprite {
  constructor(props = {}) {
    const { x, y, width, height } = Char.GET_RECT(props.value);

    super({
      ...props,
      name: 'char',
      x,
      y,
      width,
      height,
    });

    this.value = props.value ?? 'x';
    this.color = props.color ?? BLUE;
    this.sprite = Canvas.copyAndRecolor(this.sheet, x, y, width, height, [{ from: BLACK, to: this.color }]);
    this.buffer = this.sprite.getContext('2d');
  }
}

Char.GET_RECT = (ch) => {
  if (ch === ' ') return { x: 0, y: 0, width: 4, height: 7 };

  const x0 = 62,
    y0 = 28,
    width = 7,
    height = 7,
    s = width + 1;
  const rows = ['abcdefghijklmnopqrstuvwx', 'yz0123456789!↑↓←→'];
  const w2 = { i: 6, l: 6, t: 6, y: 6, 1: 6, '!': 5 };

  for (let r = 0; r < rows.length; r++) {
    const c = rows[r].indexOf(ch);
    if (c > -1) return { x: x0 + c * s, y: y0 + r * s, width: w2[ch] ?? width, height };
  }
};
