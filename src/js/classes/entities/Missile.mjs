import { getLineBresenham } from '../../functions.mjs';
import { BLUE, COLORS } from '../../constants.mjs';
import Sprite from '../core/Sprite.mjs';

export default class Missile extends Sprite {
  constructor(props) {
    super({
      ...props,
      name: 'missile',
      speed: 110,
    });

    this.pixels = getLineBresenham(this.x, this.y, props.destX, props.destY);
    this.lastIndex = this.pixels.length - 1;
    this.progress = 0;
    this.visiblePixels = 0;
    this.target = this.setTarget(props.destX, props.destY);
    this.exploded = false;
    this.garbage = false;
    this.explosion = false;

    this.parent.audio.playMissileLaunch();
  }

  setTarget(x, y) {
    return this.parent.factory.createTarget({ x, y });
  }

  setExplosion(x, y) {
    return this.parent.factory.createExplosion({ x, y });
  }

  update(dt) {
    if (this.exploded) {
      this.garbage = this.explosion.garbage;
      return;
    }

    this.progress += this.speed * dt;

    const next = this.progress | 0;
    const index = next < this.lastIndex ? next : this.lastIndex;
    const pixel = this.pixels[index];
    const colorId = this.parent.colorId;

    this.x = pixel.x;
    this.y = pixel.y;
    this.color = this.target.color = COLORS[colorId];
    this.visiblePixels = index;

    if (next >= this.lastIndex) {
      this.hit();
    }
  }

  draw(ctx) {
    if (this.garbage || this.visiblePixels === 0) return;

    // draw smoke
    ctx.fillStyle = BLUE;
    for (let i = 0; i < this.visiblePixels; i++) {
      const pixel = this.pixels[i];
      ctx.fillRect(pixel.x, pixel.y, 1, 1);
    }

    // draw missile
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, 1, 1);
  }

  hit() {
    if (this.exploded) return;

    this.explosion = this.setExplosion(this.x, this.y);
    this.exploded = this.target.garbage = true;
  }
}
