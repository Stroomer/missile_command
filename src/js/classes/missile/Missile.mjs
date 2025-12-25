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
  
  
  constructor(parent, start, target) {
    console.log('construct new Missile', start.x, start.y, target.x, target.y);

    this.game       = parent;
    this.start      = start;
    this.target     = target;
    this.state      = FLY;
    this.projectile = new Projectile(this, start, target);
    this.target     = new Target(this, target);
    //this.smoke      = new Smoke(this, start, target);
    //this.explosion  = new Explosion(this, target, 40);
  
    

    // this.targetX    = target.x;
    // this.targetY    = target.y;
    // this.prevX      = start.x;
    // this.prevY      = start.y;
    // this.speed      = 100;
    // this.vx         = vx
    // this.vy         = vy;
    // this.sprite     = cutAndRecolor(this.sheet, 1, 32, this.width, this.height, [ { from: '#999999', to: CYAN } ]);
    // this.buffer     = this.sprite.getContext('2d');
    
    this.garbage    = false;
  }

  update(dt) {
    // this.projectile.update(dt);
    // this.target.update(dt);
    // this.smoke.update(dt);    
    
    
    
    this.explosion.update(dt);

    // switch (this.state) {
    //   case AIM:
    //     this.state = Missile.FLY;      
    //     break;
    //   case FLY:
    //     this.prevX = this.x;
    //     this.prevY = this.y;
    //     super.update(dt);
    //     break;
    //   case EXPLODE:

    //   break;
    // }
    
    
    


    
    
    // const { x, y, targetX, targetY, exploded } = this;
    // const distanceX = Math.abs(x - targetX) | 0;
    // const distanceY = Math.abs(y - targetY) | 0;
    // const triggeRED = distanceX <= 1 && distanceY <= 1 ? true : false;
       
    // if (!exploded) {
    //   if (triggeRED) {
    //     this.explode();
    //     return;
    //   }  
    // }  
    
    
    
    
        
  }

  draw(ctx) {
    // this.projectile.draw(ctx);
    // this.target.draw(ctx);
    // this.smoke.draw(this.game.buffer.smoke);

    this.explosion.draw(this.game.buffer.smoke);
    
    
    //this.drawSmoke(this.game.buffer.smoke); // draw smoke trail
    
    // switch (this.state) {
    //   case Missile.AIM:
    //     this.state = Missile.FLY;      
    //     break;
    //   case Missile.FLY:
    //     this.buffer.fillStyle = this.game.dot.color;
    //     this.buffer.fillRect(0, 0, 1, 1);
    //     this.game.buffer.missiles.drawImage(this.buffer.canvas, this.x | 0, this.y | 0);  // draw missile buffer
    //     super.draw(ctx); // draw missile sprite
    //     break;
    //   case Missile.EXPLODE:

    //   break;
    // }



    
    
  }

  drawSmoke(smokeBuffer) {
    smokeBuffer.fillStyle = BLUE;
    const px = this.prevX | 0;
    const py = this.prevY | 0;
    const nx = this.x     | 0;
    const ny = this.y     | 0;

    drawLineBresenham(px, py, nx, ny, smokeBuffer);
  }
  
  explode() {
    console.log('explode');
    //console.log(this.id);
    // console.log(this.game.targets.length);
    //this.game.targets[this.id].garbage = true;
    this.exploded = true;
    this.game.audio.playExplosion();
  }
}