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
    this.x         = props.start.x;
    this.y         = props.start.y;
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
    this.phase = Missile.CRUISING;
    
    this.box       = { x:props.start.x, y:props.start.y, width:1, height:1 };
    
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
    this.parent.audio.playExplosion();
    this.target.visible    = false;
    this.explosion.visible = true;
    this.exploded          = true;
    console.log('EXPLODING!!');
  }

  // setBoundingBox() { 
  //   if(!this.exploded) {
  //     this.box.x      = this.x;
  //     this.box.y      = this.y;
  //     this.box.width  = 
  //     this.box.height =   
  //   } else {
      
  //   }
  // }
}

Missile.LAUNCHING  = 0;
Missile.CRUISING   = 1;
Missile.EXPLODING  = 2;
Missile.IMPLODING  = 3;
Missile.DISSOLVING = 4;

Missile.PHASES = [Missile.LAUNCHING, Missile.CRUISING, Missile.EXPLODING, Missile.IMPLODING, Missile.DISSOLVING];