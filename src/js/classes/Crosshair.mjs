import { copyAndRecolor } from '../canvas.mjs';
import { BLUE } from '../constants.mjs';
import Sprite from './core/Sprite.mjs';

export default class Crosshair extends Sprite {
  constructor(props) {
    props.name = "crosshair";
    props.x      = -10;
    props.y      = -10;
    props.width  = 7;
    props.height = 7;
    
    super(props);
    
    this.sprite = copyAndRecolor(this.sheet, 1, 24, this.width, this.height, [
      { from:'#999999', to:BLUE }
    ]);
    this.buffer = this.sprite.getContext('2d');
    this.color = props.color;
  }

  update(mouse) {    
    if (!mouse.visible) {
      this.visible = false;
      return;
    }
    
    this.visible = true;
    this.x = mouse.x;
    this.y = mouse.y;
  }

  draw(ctx) {
    if (!this.visible) return;

    super.draw(ctx);
  }
}
