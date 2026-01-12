import Fuze from '../missile/Fuze.mjs';
import Target from '../missile/Target.mjs';
import Smoke from '../missile/Smoke.mjs';
import Explosion from '../missile/Explosion.mjs';
import { getLineBresenham } from '../../helpers.mjs';

// WERK DE "MISSILE_COMPONENT" EN DE PROJECTILE WEG
// CHECK DE COLLISION IN MISSILE
// FOCUS OP 1 PIXEL EN NA EXPLODEREN OP N PIXELS TER GROOTTE VAN EXPLOSION-RADIUS

export default class Missile {
  constructor(props) {
    this.parent    = props.parent; 
    this.pixels    = getLineBresenham(props.start.x, props.start.y, props.target.x, props.target.y); 
    this.start     = props.start;
    this.target    = props.target;
    this.speed     = props.speed;
    this.radius    = props.radius;
        
    props.parent   = this;
    props.pixels   = this.pixels;
    
    this.fuze      = new Fuze(props);
    this.smoke     = new Smoke(props);
    this.target    = new Target(props);
    this.explosion = new Explosion(props);
    this.elements  = [this.smoke, this.fuze, this.target, this.explosion];
    this.exploded  = false;
    this.garbage   = false;
    this.isEnemy   = false;
    
    //this.phase = 1;
    
    //console.log(Missile.PHASES[0]);
        
    this.parent.audio.playMissileLaunch();
  }

  update(dt) {
    for (const element of this.elements) {
      element.update(dt);  
    }
  }

  draw(ctx) {
    for (const element of this.elements) {
      element.draw(ctx);  
    }
  }

  explode() {
    if (this.exploded) return;
    this.parent.audio.playExplosion();
    this.exploded = true;
  }
}

Missile.PHASES = ['launch', 'cruise', 'detonate', 'explode', 'implode', 'gone'];