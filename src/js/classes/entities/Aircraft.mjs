import { DIRECTION, GREEN, WIDTH } from '../../constants.mjs';
import Canvas from '../core/Canvas.mjs';
import Buffer from '../core/Buffer.mjs';
import Sprite from '../core/Sprite.mjs';
import { randomInt, randomPick } from '../../functions.mjs';

export default class Aircraft extends Sprite {
  constructor(props) {
    const randomPosX = randomPick([-16, WIDTH + 16]);
    const randomPosY = randomInt(30, 120);
    const randomSpeed = randomPick([25, 50, 75]);
    const dirX = randomPosX < 0 ? 1 : -1;

    super({
      ...props,
      name: 'aircraft',
      x: randomPosX,
      y: randomPosY,
      width: 16,
      height: 11,
      speed: randomSpeed,
      dirX,
    });

    console.log(`Aircraft: x=${this.x}, y=${this.y}, speed=${this.speed}, dirX=${this.dirX}`);

    this.freeze = false;
    this.time = 0;
    this.freezeTime = 0.7;

    this.sprite = Canvas.copyAndRecolor(this.sheet, 19, 24, this.width, this.height, [{ from: '#999999', to: GREEN }]);
    this.sprites = [Canvas.copySprite(this.sprite), Buffer.flip(Canvas.copySprite(this.sprite))];
    this.sprite = this.sprites[this.dirX === DIRECTION.LEFT ? 1 : 0];
    this.buffer = this.sprite.getContext('2d');
  }

  update(dt) {
    if (this.garbage) return;

    this.sprite = this.sprites[this.dirX === DIRECTION.LEFT ? 1 : 0];
    this.buffer = this.sprite.getContext('2d');

    if (!this.freeze) {
      super.update(dt);
    } else {
      this.time += dt;
      if (this.time > this.freezeTime) this.garbage = true;
    }
  }

  draw(ctx) {
    if (this.garbage) return;

    super.draw(ctx);
  }

  hit() {
    if (this.freeze) return;

    this.freeze = true;
    this.parent.spawnExplosionBatch(this);
  }
}
