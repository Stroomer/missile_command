import { height, red, width, yellow } from '../constants.mjs';
import { getSpriteMulti } from '../canvas.mjs';

export default class Alien {
  constructor(sprites) {
    this.sprite = getSpriteMulti(sprites, 62, 24, 14, 13, [
      { from: '#999999', to: '#ffff00' },
      { from: '#666666', to: '#00ff00' },
    ]);
  }

  update() {}

  draw(ctx) {
    const x = (-50 + width / 2) | 0;
    const y = (50 + height / 2) | 0;
    ctx.drawImage(this.sprite, x, y, 14, 13);
  }
}
