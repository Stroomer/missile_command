import { height, width, yellow } from "../constants.mjs";
import { getSpriteMulti } from "../canvas.mjs";

export default class Background {
    constructor(sprites) {
        this.sprite = getSpriteMulti(sprites, 0, 0, 256, 23, [{ from: '#999999', to: '#ffff00' },]);    
    }

    update() {

    }

    draw(ctx) {
      ctx.drawImage(this.sprite, 0, height-23, width, 23);
    }
}