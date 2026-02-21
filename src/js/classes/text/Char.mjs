import Canvas from '../core/Canvas.mjs';
import { BLACK, WHITE } from '../../constants.mjs';
import Sprite from '../core/Sprite.mjs';

export default class Char extends Sprite {
  constructor(props = {}) {
    super({
      ...props,
      name: 'char',
      width: 7,
      height: 7,
    });

    const sx = props.sx ?? 62;
    const sy = props.sy ?? 24;
    const color = props.color ?? WHITE;

    this.sprite = Canvas.copyAndRecolor(this.sheet, sx, sy, this.width, this.height, [{ from: BLACK, to: color }]);
    this.buffer = this.sprite.getContext('2d');
  }
}
