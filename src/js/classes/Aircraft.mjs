import { DIRECTION, GREEN, WIDTH } from '../constants.mjs';
import { copyAndRecolor, copySprite } from '../canvas.mjs';
import Sprite from './Sprite.mjs';
import { flip } from '../buffer.mjs';
import { randomInt } from '../helpers.mjs';

export default class Aircraft extends Sprite {
  constructor(parent, x=-8+(randomInt(0, 1)*(WIDTH+16)) , y=120) {
    super(x, y, 16, 11);

    const halfScreen = WIDTH / 2;

    this.parent  = parent;
    this.speed   = 30 + randomInt(0, 30);
    this.dirX    = x < halfScreen ? DIRECTION.RIGHT : DIRECTION.LEFT;
    this.dirY    = 0;
    this.sprite  = copyAndRecolor(this.sheet, 19, 24, this.width, this.height, [{ from: '#999999', to: GREEN }]);
    this.sprites = [copySprite(this.sprite), flip(copySprite(this.sprite))];
    this.sprite  = this.sprites[this.dirX === DIRECTION.LEFT ? 1 : 0];
    this.buffer  = this.sprite.getContext('2d');
  }

  update(dt) {
    this.sprite = this.sprites[this.dirX === DIRECTION.LEFT ? 1 : 0];
    this.buffer = this.sprite.getContext('2d');

    super.update(dt);
  }

  draw(ctx) {
    super.draw(ctx);
  }
}
