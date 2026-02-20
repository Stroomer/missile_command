import Canvas from '../core/Canvas.mjs';
import { BLUE } from '../../constants.mjs';
import Sprite from '../core/Sprite.mjs';

export default class Crosshair extends Sprite {
  constructor(props) {
    super({
      ...props,
      name: 'crosshair',
      x: -10,
      y: -10,
      width: 7,
      height: 7,
    });

    this.sprite = Canvas.copyAndRecolor(this.sheet, 1, 24, this.width, this.height, [{ from: '#999999', to: BLUE }]);
    this.buffer = this.sprite.getContext('2d');
    this.color = props.color;
  }

  update() {
    if (!this.parent.mouse.visible) {
      this.visible = false;
      return;
    }

    this.visible = true;
    this.x = this.parent.mouse.x;
    this.y = this.parent.mouse.y;
  }

  draw(ctx) {
    if (!this.visible) return;

    super.draw(ctx);
  }
}
