import { DIRECTION, GREEN, WIDTH } from '../constants.mjs';
import { copyAndRecolor, copySprite } from '../canvas.mjs';
import Sprite from './core/Sprite.mjs';
import { flip } from '../buffer.mjs';
import { randomInt, randomPick } from '../helpers.mjs';

export default class Aircraft extends Sprite {
  constructor(props = {}) {
    props.name   = "aircraft";
    props.x      = randomPick([-16, WIDTH + 16]);
    props.y      = randomInt(30, 120);
    props.width  = 16;
    props.height = 11;
    props.speed  = randomPick([25, 50, 75]);
    props.dirX   = props.x < 0 ? 1 : -1;
    
    super(props);

    this.freeze     = false;
    this.time = 0;
    this.freezeTime = 0.7;
    
    this.sprite     = copyAndRecolor(this.sheet, 19, 24, this.width, this.height, [{ from: '#999999', to: GREEN }]);
    this.sprites    = [copySprite(this.sprite), flip(copySprite(this.sprite))];
    this.sprite     = this.sprites[this.dirX === DIRECTION.LEFT ? 1 : 0];
    this.buffer     = this.sprite.getContext('2d');
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
