import { height, yellow } from "../constants.mjs";
import { cutAndRecolor } from "../canvas.mjs";

export default class Background {
    constructor(sprites) {
      this.sprite = cutAndRecolor(sprites, 0, 0, 256, 23, [
        { from:'#999999', to:yellow }
      ]);
    }

    update() {

    }

    draw(ctx) {
      ctx.drawImage(this.sprite, 0, height-23);
    }
}