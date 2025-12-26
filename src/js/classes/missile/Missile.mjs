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

    this.game       = parent;
    this.start      = start;
    this.target     = target;
    this.speed      = speed;
    this.phase      = 0;
    
    this.projectile = new Projectile(this, start, target);
    this.target     = new Target(this, target);
    this.smoke      = new Smoke(this, start, target);
    //this.explosion  = new Explosion(this, target, 40);
  
    this.garbage    = false;
  }

  update(dt) {
    this.smoke.update(dt);    
    this.target.update(dt);
    this.projectile.update(dt);
    // this.explosion.update(dt);
  }

  draw(ctx) {
    this.smoke.draw(ctx);
    this.target.draw(ctx);
    this.projectile.draw(ctx);
    // this.explosion.draw(ctx);
  }
  
  launch() {
    console.log('--launch');   
  }

  explode() {
    console.log('--explode');
    this.exploded = true;
    this.game.audio.playExplosion();
  }

  setTarget(bool) {

  }

  setSmoke(bool) {

  }
}