
import { BLUE, RED } from '../constants.mjs';
import { copyAndRecolor } from '../canvas.mjs';
import Sprite from './core/Sprite.mjs';

export default class City extends Sprite {
  constructor(props) {
    props.name   = "city";
    props.width  = 16;
    props.height = 8;

    super(props);
    
    this.sprite = copyAndRecolor(this.sheet, 36, 24, this.width, this.height, [
      { from:'#999999', to:BLUE },
      { from:'#666666', to:RED },
    ]);
    this.buffer = this.sprite.getContext('2d');
  }

  update() {}

  draw(ctx) {
    ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
  }
}
