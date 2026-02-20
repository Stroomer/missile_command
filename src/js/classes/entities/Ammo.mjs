import { BLUE, HEIGHT, WIDTH } from '../../constants.mjs';
import Canvas from '../core/Canvas.mjs';
import Buffer from '../core/Buffer.mjs';
import Sprite from '../core/Sprite.mjs';

export default class Ammo extends Sprite {
  constructor(props = {}) {
    super({
      ...props,
      name: 'ammo',
      width: 3,
      height: 5,
    });

    this.sprite = Canvas.copyAndRecolor(this.sheet, 15, 24, this.width, this.height, [{ from: '#999999', to: BLUE }]);
    this.buffer = this.sprite.getContext('2d');
  }

  update(dt) {
    super.update(dt);
  }

  draw(ctx) {
    super.draw(ctx);
  }
}

//15, 24, 3, 5
