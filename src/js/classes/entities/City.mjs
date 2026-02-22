import { BLUE, RED } from '../../constants.mjs';
import Canvas from '../core/Canvas.mjs';
import Sprite from '../core/Sprite.mjs';

export default class City extends Sprite {
  constructor(props) {
    super({
      ...props,
      name: 'city',
      width: 16,
      height: 8,
    });

    this.sprite = Canvas.copyAndRecolor(this.sheet, 36, 28, this.width, this.height, [
      { from: '#999999', to: BLUE },
      { from: '#666666', to: RED },
    ]);
    this.buffer = this.sprite.getContext('2d');
  }

  update() {}

  draw(ctx) {
    ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
  }
}
