import Explosion from './Explosion.mjs';
import { getLineBresenham } from '../helpers.mjs';
import { game } from '../../main.mjs';
import { BLUE, COLORS } from '../constants.mjs';
import Sprite from './core/Sprite.mjs';
import Target from './Target.mjs';

export default class Missile extends Sprite {
  constructor(props) {
    
    props.name = "missile";

    super(props);

    // console.log(props);
    
    this.parent        = game;
    this.pixels        = getLineBresenham(this.x, this.y, props.destX, props.destY);
    this.lastIndex     = this.pixels.length - 1;
    this.progress      = 0;
    this.visiblePixels = 0;
    this.target        = this.setTarget(props.destX, props.destY);
    this.exploded      = false;
    this.garbage       = false;
    this.explosion     = false;
    
    this.parent.audio.playMissileLaunch();
  }

  setTarget(x, y) {
    this.parent.targets.push(new Target({ x, y }));
    return this.parent.targets[this.parent.targets.length - 1];
  }

  setExplosion(x, y) {
    this.parent.explosions.push(new Explosion({ x, y }));
    return this.parent.explosions[this.parent.explosions.length - 1];
  }

  update(dt) {
    if (this.exploded) {
      this.garbage = this.explosion.garbage;
      return;
    } 
      
    this.progress += (this.speed * dt);
    
    const next    = this.progress | 0;
    const index   = next < this.lastIndex ? next : this.lastIndex;
    const pixel   = this.pixels[index];
    const colorId = this.parent.colorId;  

    this.x             = pixel.x;
    this.y             = pixel.y;    
    this.color         = this.target.color = COLORS[colorId];
    this.visiblePixels = index;    
    
    if (next >= this.lastIndex) {
      this.hit();
    }
  }

  draw(ctx) {
    if (this.garbage || this.visiblePixels === 0) return;

    // draw smoke
    ctx.fillStyle = BLUE;
    for (let i = 0; i < this.visiblePixels; i++) {
      const pixel = this.pixels[i];
      ctx.fillRect(pixel.x, pixel.y, 1, 1);
    }

    // draw missile
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, 1, 1);
  }

  hit() {    
    if (this.exploded) return;

    this.explosion = this.setExplosion(this.x, this.y);
    this.exploded = this.target.garbage = true;
  }
}