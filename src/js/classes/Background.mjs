import { HEIGHT, yellow } from "../constants.mjs";
import { cutAndRecolor } from "../canvas.mjs";
import Sprite from './Sprite.mjs';

export default class Background extends Sprite {
    constructor(x, y) {
      super(x, y, 256, 23);

      this.sprite = cutAndRecolor(this.sheet, 0, 0, this.width, this.height, [
        { from:'#999999', to:yellow }
      ]);
    }

    update() {
      super.update();
    }

    draw(ctx) {
      //ctx.drawImage(this.sprite, 0, HEIGHT-this.height);

      super.draw(ctx);
    }
}