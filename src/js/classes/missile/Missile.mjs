import { cutAndRecolor } from '../../canvas.mjs';
import { BLUE, CYAN } from '../../constants.mjs';
import { drawLineBresenham, getUnitVector, withinBounds } from '../../helpers.mjs';
import Projectile from './Projectile.mjs';
import Target from './Target.mjs';
import Smoke from './Smoke.mjs';
import Explosion from './Explosion.mjs';

// missile has:
// 1. rocket
// 2. smoke trail
// 3. explosion effect
// 4. target coordinates

const AIM     = 0;
const FLY     = 1;
const EXPLODE = 2;

export default class Missile {
  constructor(parent, start, target, speed) {
    console.log('construct new Missile', start.x, start.y, target.x, target.y);

    this.parent     = parent;
    this.start      = start;
    this.target     = target;
    this.speed      = speed;
    this.phase      = 0;
    this.smoke      = new Smoke(this, start, target);
    this.projectile = new Projectile(this, start, target);
    this.target     = new Target(this, target);
    this.exploded   = false;
    
    parent.audio.playMissileLaunch();

    //this.explosion  = new Explosion(this, target, 40);
    //this.garbage    = false;
  }

  update(dt) {
    // if (this.projectile.hit) {
    //   this.target.garbage = this.projectile.garbage = true;
    // }

    this.smoke.update(dt);    
    this.projectile.update(dt);
    this.target.update(dt);
    // this.explosion.update(dt);
  }

  draw(ctx) {
    this.smoke.draw(ctx);
    this.projectile.draw(ctx);
    this.target.draw(ctx);
    // this.explosion.draw(ctx);
  }

  explode() {
    if (this.exploded) return;
    
    this.parent.audio.playExplosion();
    this.exploded = true;
  }
}