
import { cityBottomColor, cityTopColor, red } from '../constants.mjs';

export default class City {
  constructor(x, y, sprites, layer) {
    this.width  = 16;
    this.height = 8;
    this.x      = x - this.width / 2;
    this.y      = y - this.height / 2;

    // this.sprite = getSpriteMulti(sprites, 36, 24, this.width, this.height, [
    //   { from: '#999999', to: cityTopColor },
    //   { from: '#cccccc', to: cityBottomColor },
    // ]);

    // this.draw(layer);
  }

  update() {}

  draw(ctx) {
    //ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
  }
}
