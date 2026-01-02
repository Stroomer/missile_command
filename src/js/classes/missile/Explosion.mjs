import Sprite from "../Sprite.mjs";
import { COLORS, GREY } from '../../constants.mjs';
import { createBuffer, createBufferList } from '../../buffer.mjs';
import { renderBufferList, renderBufferListColors } from '../../canvas.mjs';
import { easeInQuad, easeOutQuad } from '../../helpers.mjs';



export default class Explosion extends Sprite {
  constructor(props) {
    props = Explosion.VALIDATE(props);
    super(props.target.x, props.target.y, props.radius, props.radius);
    
    this.parent       = props.parent;
    this.radius       = props.radius;
    this.expandTime   = props.expandTime;
    this.collapseTime = props.collapseTime;   
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
    const maxIndex = this.radius - 1;
    const slot     = color * this.radius;  
    const index    = slot + ((eased * maxIndex) | 0);
    
    //console.log(Explosion.BUFFERS);
    
    this.sprite = super.getSprite(Explosion.BUFFERS, index);
    this.buffer = this.sprite.getContext('2d');
    this.collisionRadius = eased * this.radius;
    
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
  
Explosion.RADIUS   = { MIN:4,   MAX:40 };
Explosion.EXPAND   = { MIN:0.1, MAX:10.0 };
Explosion.COLLAPSE = { MIN:0.1, MAX:10.0 };

Explosion.BUFFERS  = [];
Explosion.BUFFERS  = createBufferList('explosion', 2, 2, 2*Explosion.RADIUS.MAX, true);  // create a list of empty buffers (context)
Explosion.BUFFERS  = renderBufferList(Explosion.BUFFERS, GREY);
Explosion.BUFFERS  = renderBufferListColors(Explosion.BUFFERS, COLORS);  

Explosion.DEFAULT    = {
  EXPAND:   0.3,
  COLLAPSE: 0.5,
  RADIUS:   Explosion.RADIUS.MAX
};

console.log(`buffers.length = ${Explosion.BUFFERS.length}`);


Explosion.VALIDATE = (props) => {
  const { start, target, radius, expandTime, collapseTime } = props;
  
  if (!start)                                throw Error("No start-location specified");
  if (!target)                               throw Error("No target-location specified");
  
  if (!expandTime)                           props.expandTime = Explosion.DEFAULT.EXPAND;
  if (expandTime < Explosion.EXPAND.MIN)     props.expandTime = Explosion.EXPAND.MIN;  
  if (expandTime > Explosion.EXPAND.MAX)     props.expandTime = Explosion.EXPAND.MAX;  

  if (!collapseTime)                         props.collapseTime = Explosion.DEFAULT.COLLAPSE;
  if (collapseTime < Explosion.COLLAPSE.MIN) props.collapseTime = Explosion.COLLAPSE.MIN;  
  if (collapseTime > Explosion.COLLAPSE.MAX) props.collapseTime = Explosion.COLLAPSE.MAX;
  
  if (!radius)                               props.radius = Explosion.DEFAULT.RADIUS;
  if (radius < Explosion.RADIUS.MIN)         props.radius = Explosion.RADIUS.MIN;
  if (radius > Explosion.RADIUS.MAX)         props.radius = Explosion.RADIUS.MAX;
  
  return props;
}



