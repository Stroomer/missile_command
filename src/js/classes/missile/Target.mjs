import { copyAndRecolor } from '../../canvas.mjs';
import { BLUE } from '../../constants.mjs';
import { getRandomColor } from '../../helpers.mjs';
import Sprite from '../Sprite.mjs';

export default class Target extends Sprite {
  constructor(props) {
    super(props.target.x, props.target.y, 5, 5);
    
    this.parent    = props.parent;
    this.sprite    = copyAndRecolor(this.sheet, 9, 24, this.width, this.height, [{ from:'#999999', to:BLUE }]);
    this.buffer    = this.sprite.getContext('2d');
    this.color     = BLUE;
    this.positions = [0, 0, 4, 0, 1, 1, 3, 1, 2, 2, 1, 3, 3, 3, 0, 4, 4, 4];
  }

  update(dt) {
    if (this.parent.exploded || this.parent.isEnemy) {
      this.visible = false;
      return;
    }

    this.color = getRandomColor();
  }

  draw(ctx) {    
    if (!this.visible) return;

    this.redrawColor(this.color);
    super.draw(ctx);
  }

  redrawColor(color) {
    const { buffer, positions } = this;
    buffer.fillStyle = color;  
    for (let i = 0; i < positions.length; i+=2) {
      const x = positions[i];
      const y = positions[i + 1];
      buffer.fillRect(x, y, 1, 1);
    }
  }
}
