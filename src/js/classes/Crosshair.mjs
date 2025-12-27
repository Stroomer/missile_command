import { cutAndRecolor } from '../canvas.mjs';
import { BLUE } from '../constants.mjs';
import Sprite from './Sprite.mjs';

export default class Crosshair extends Sprite {
  constructor(color) {
    super(30, 30, 7, 7);
    this.sprite = cutAndRecolor(this.sheet, 1, 24, this.width, this.height, [
      { from:'#999999', to:BLUE }
    ]);
    this.buffer = this.sprite.getContext('2d');
    this.color = color;
    this.visible = false;
  }

  update(mouse) {    
    if (!mouse.visible) {
      this.visible = false;
      return;
    }
    
    this.visible = true;
    this.x = mouse.x + 1;
    this.y = mouse.y + 1;
  }

  draw(ctx) {
    if (!this.visible) return;

    super.draw(ctx);
  }
}
