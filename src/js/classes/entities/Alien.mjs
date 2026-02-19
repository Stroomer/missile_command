import { BLUE, COLORS, RED, WIDTH } from '../../constants.mjs';
import { copyAndRecolor } from '../../canvas.mjs';
import Sprite from '../core/Sprite.mjs';
import { randomInt, randomPick } from '../../functions.mjs';

export default class Alien extends Sprite {
  constructor(props) {
    super({
      ...props,
      name: 'alien',
      x: randomPick([-14, WIDTH + 14]),
      y: randomInt(30, 120),
      width: 14,
      height: 13,
      speed: randomPick([10, 20, 30]),
      dirX: props.x < 0 ? 1 : -1,
    });

    this.antenna = new Antenna(this, this.width, this.height);
    this.freeze = false;
    this.time = 0;
    this.freezeTime = 0.7;

    this.sprite = copyAndRecolor(this.sheet, 36, 33, this.width, this.height, [
      { from: '#999999', to: BLUE },
      { from: '#666666', to: RED },
    ]);
    this.buffer = this.sprite.getContext('2d');
  }

  update(dt) {
    if (this.garbage) return;

    this.antenna.update(dt);

    if (!this.freeze) {
      super.update(dt);
    } else if (!this.exploded) {
      this.exploded = true;
    } else {
      this.time += dt;
      if (this.time > this.freezeTime) this.garbage = true;
    }
  }

  draw(ctx) {
    if (this.garbage) return;

    this.antenna.draw(this.buffer);
    super.draw(ctx);
  }

  hit() {
    if (this.freeze) return;

    this.freeze = true;
    this.parent.spawnExplosionBatch(this);
  }
}

class Antenna {
  constructor(parent, width, height) {
    this.parent = parent;
    this.width = width;
    this.height = height;
    this.color = null;
  }

  update(dt) {
    const colorId = this.parent.parent.colorId;
    this.color = COLORS[colorId];
  }

  draw(buffer) {
    const w = this.width - 1;
    const h = this.height - 1;

    buffer.fillStyle = this.color;
    buffer.fillRect(0, 0, 1, 1);
    buffer.fillRect(w, 0, 1, 1);
    buffer.fillRect(w, h, 1, 1);
    buffer.fillRect(0, h, 1, 1);
  }
}
