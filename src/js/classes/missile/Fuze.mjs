import { COLORS } from '../../constants.mjs';

export default class Fuze {
  constructor(props) {
    this.parent        = props.parent;
    this.speed         = props.speed;
    this.color         = props.color;
    this.pixels        = props.pixels;
    this.lastIndex     = props.pixels.length - 1;
    this.progress      = 0;
    this.visiblePixels = 0;
    this.index         = 0;
    this.x             = null;
    this.y             = null;
    this.width         = null;
    this.height        = null;
    this.exploded      = false;
  }

  update(dt) {
    if (this.exploded) return;

    const next    = (this.progress += this.speed * dt) | 0;
    const colorId = this.parent.parent.colorId;
    
    this.color = COLORS[colorId];

    if (next < this.lastIndex) {
      this.index = next;
      
      const pixel = this.pixels[next];
      const box   = this.parent.box;
    
      box.x      = pixel.x;
      box.y      = pixel.y;
      box.width  = 1;
      box.height = 1;     
    } else {
      this.index    = this.lastIndex;
      this.exploded = true;
      
      this.parent.explode();
    }
    
  }  
  
  draw(ctx) {
    if (this.exploded) return;

    const p = this.pixels[this.index];
    if (p === undefined) return;

    ctx.fillStyle = this.color;
    ctx.fillRect(p.x, p.y, 1, 1);
  }
}



 // if (aabb(this.missiles[i].explosion, this.aliens[0])) {
    //   this.aliens[0].freeze = true;
    //   //boem

    // }