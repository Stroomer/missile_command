import Sprite from "../Sprite.mjs";
import { COLORS, GREY } from '../../constants.mjs';
import { createBuffer, createBufferList } from '../../buffer.mjs';
import { renderBufferList, renderBufferListColors } from '../../canvas.mjs';
import { easeInQuad, easeOutQuad } from '../../helpers.mjs';



export default class Explosion extends Sprite {
  static BUFFERS       = [];
  static MAX_SIZE      = 80;
  static MAX_RADIUS    = Explosion.MAX_SIZE / 2;
  static DEFAULT_PROPS = {};

  constructor(props) {  
    super(props.target.x, props.target.y, props.radius, props.radius);
    
    this.parent       = props.parent;
    this.radius       = props.radius;
    this.expandTime   = props.expandTime   || Explosion.DEFAULT_PROPS.expandTime;
    this.collapseTime = props.collapseTime || Explosion.DEFAULT_PROPS.collapseTime;
    this.maxRadius    = props.radius       || Explosion.DEFAULT_PROPS.maxRadius;   
    this.time         = 0;
    this.phase        = 0; // 0 = expand, 1 = collapse
    this.sprite       = createBuffer('explosion', props.radius, props.radius).canvas;
    this.buffer       = this.sprite.getContext('2d'); 
    this.garbage      = false;
  }

  update(dt) {
    if (!this.parent.exploded) return;

    this.time += dt;
    let t, eased;
    
    if (this.phase === 0) {
      t = Math.min(this.time / this.expandTime, 1);
      eased = easeOutQuad(t);
      if (t >= 1) {
        this.phase = 1;
        this.time = 0;
      }
    } else {
      t = Math.min(this.time / this.collapseTime, 1);
      eased = 1 - easeInQuad(t);
      if (t >= 1) {
        this.parent.garbage = true;
        return;
      }
    }
    
    const color    = this.parent.parent.colorId;
    const maxIndex = Explosion.MAX_RADIUS - 1;
    const slot     = color * Explosion.MAX_RADIUS; 
    const index    = slot + ((eased * maxIndex) | 0);
    
    this.sprite = super.getSprite(Explosion.BUFFERS, index);
    this.buffer = this.sprite.getContext('2d');
    this.collisionRadius = eased * this.maxRadius;
    
    super.update(dt);
  }

  hit(obj) {
    const dx = obj.x - this.x;
    const dy = obj.y - this.y;
    const r  = this.collisionRadius + obj.radius;

    return dx * dx + dy * dy <= r * r;
  }


  draw(ctx) {
    super.draw(ctx);
  }

  
}

Explosion.BUFFERS = createBufferList('explosion', 2, 2, Explosion.MAX_SIZE, true);  // create a list of empty buffers (context)
Explosion.BUFFERS = renderBufferList(Explosion.BUFFERS, GREY);
Explosion.BUFFERS = renderBufferListColors(Explosion.BUFFERS, COLORS);

console.log(`buffers.length = ${Explosion.BUFFERS.length}`);

Explosion.DEFAULT_PROPS = {
  expandTime:   0.3,
  collapseTime: 0.5,
  maxRadius:    Explosion.MAX_RADIUS,
};



