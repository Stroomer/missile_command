import { cutAndRecolor } from '../../canvas.mjs';
import { BLUE } from '../../constants.mjs';
import { getRandomColor } from '../../helpers.mjs';
import Sprite from '../Sprite.mjs';

export default class Target extends Sprite {
  constructor(parent, target) {
    super(target.x + 1, target.y + 1, 5, 5);
    
    this.parent    = parent;
    this.sprite    = cutAndRecolor(this.sheet, 9, 24, this.width, this.height, [{ from:'#999999', to:BLUE }]);
    this.buffer    = this.sprite.getContext('2d');
    this.color     = BLUE;
    this.positions = [0, 0, 4, 0, 1, 1, 3, 1, 2, 2, 1, 3, 3, 3, 0, 4, 4, 4];
  }

  update(dt) {
    this.color = getRandomColor();
    if (this.parent.exploded) this.visible = false;
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
