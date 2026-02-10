import { YELLOW } from "../constants.mjs";
import { copyAndRecolor } from "../canvas.mjs";
import Sprite from './core/Sprite.mjs';

export default class Background extends Sprite {
    constructor(props) {
      props.name   = "background";
      props.width  = 256;
      props.height = 23;
      
      super(props);


      this.sprite = copyAndRecolor(this.sheet, 0, 0, this.width, this.height, [ { from:'#999999', to:YELLOW } ]);
      this.buffer = this.sprite.getContext('2d');
    }

    update() {
      super.update();
    }

    draw(ctx) {
      super.draw(ctx);
    }
}