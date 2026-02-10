import { COLORS } from '../../constants.mjs';
import Sprite from '../core/Sprite.mjs';

export default class Fuze extends Sprite {
  constructor(props) {
    props.name   = "fuze";
    props.width  = 1;
    props.height = 1;

    super(props);

    this.parent  = props.parent;
    this.color   = props.color;
  }

  update(dt) {
    if (!this.visible) return;

    const colorId  = this.parent.parent.colorId;
    this.color = COLORS[colorId];
  }  
  
  draw(ctx) {
    if (!this.visible) return;

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, 1, 1);
  }

  trigger() {
    if (this.parent.exploded) return;  
    
    this.visible = false;
    this.parent.explode();
  }
}