import { getUnitVector } from '../../helpers.mjs';
import Sprite from '../Sprite.mjs';

export default class Projectile extends Sprite {
  constructor(missile, start, target) {
      super(start.x, start.y, 1, 1);
      
      console.log('projectile');
      const { vx, vy } = getUnitVector(start.x, start.y, target.x, target.y);

      this.missile = missile;
      
  }

  update(dt) {}

  draw(ctx) {}
}
