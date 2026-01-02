import { YELLOW } from "../constants.mjs";
import { copyAndRecolor } from "../canvas.mjs";
import Sprite from './Sprite.mjs';

export default class Background extends Sprite {
    constructor(x, y) {
      super(x, y, 256, 23);

      this.sprite = copyAndRecolor(this.sheet, 0, 0, this.width, this.height, [ { from:'#999999', to:YELLOW } ]);
      this.buffer = this.sprite.getContext('2d');
    }

    update() {
      super.update();
    }

    draw(ctx) {
      super.draw(ctx);
    }
}