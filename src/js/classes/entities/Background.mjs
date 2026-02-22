import { YELLOW } from '../../constants.mjs';
import Canvas from '../core/Canvas.mjs';
import Sprite from '../core/Sprite.mjs';

export default class Background extends Sprite {
  constructor(props) {
    super({
      ...props,
      name: 'background',
      width: 256,
      height: 27,
    });

    this.sprite = Canvas.copyAndRecolor(this.sheet, 0, 0, this.width, this.height, [{ from: '#999999', to: YELLOW }]);
    this.buffer = this.sprite.getContext('2d');
  }

  update() {
    super.update();
  }

  draw(ctx) {
    super.draw(ctx);
  }
}
