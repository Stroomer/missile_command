import Sprite from '../core/Sprite.mjs';

export default class Crate extends Sprite {
  constructor() {
    this.out = false;
    this.low = false;
    this.message = '';

    this.positions = [
      { x: 0, y: 0 },
      { x: -3, y: 3 },
      { x: 3, y: 3 },
      { x: -6, y: 6 },
      { x: 0, y: 6 },
      { x: 6, y: 6 },
      { x: -9, y: 9 },
      { x: -3, y: 9 },
      { x: 3, y: 9 },
      { x: 9, y: 9 },
    ];
  }

  update(dt) {}

  draw(ctx) {
    const a = this.positions;

    for (let i = 0; i < a.length; i++) {
      this.factory.createAmmo({ x: HALF_W - 5 + a[i].x, y: HEIGHT - 17 + a[i].y });
    }
  }
}

// MAKE THE DAMN CRATE VISIBLE
