import Projectile from './Projectile.mjs';
import Target from './Target.mjs';
import Smoke from './Smoke.mjs';
import Explosion from './Explosion.mjs';
import { YELLOW } from '../../constants.mjs';

// missile has:
// 1. rocket
// 2. smoke trail
// 3. target coordinates
// 4. explosion effect

export default class Missile {
  constructor(props) {
    const { parent, start, target, speed, color, radius, isEnemyMissile } = props;
    
    this.parent     = parent;
    this.name       = 'missile';
    this.start      = start;
    this.target     = target;
    this.speed      = speed;
    this.radius     = radius;
    
    this.smoke      = new Smoke({ parent:this, start, target, speed, color });
    this.projectile = new Projectile({ parent:this, start, target, speed, color });
    this.target     = new Target({ parent:this, target });
    this.explosion  = new Explosion({ parent:this, start, target, radius });
    this.phase      = 0;
    this.exploded   = false;
    this.garbage    = false;
    
    this.isEnemyMissile = isEnemyMissile;
    
    parent.audio.playMissileLaunch();
  }

  update(dt) {
    this.smoke.update(dt);    
    this.projectile.update(dt);
    this.target.update(dt);
    this.explosion.update(dt);
  }

  draw(ctx) {
    this.smoke.draw(ctx);
    this.projectile.draw(ctx);
    this.target.draw(ctx);
    this.explosion.draw(ctx);
  }

  explode() {
    if (this.exploded) return;
    this.parent.audio.playExplosion();
    this.exploded = true;
  }

  
}