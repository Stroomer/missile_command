import { YELLOW } from "../constants.mjs";
import { copyAndRecolor } from "../canvas.mjs";
import SpritesheetSprite from './core/SpritesheetSprite.mjs';

export default class Background extends SpritesheetSprite {
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