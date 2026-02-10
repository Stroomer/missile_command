import { copyAndRecolor } from '../canvas.mjs';
import { BLUE, COLORS, RED } from '../constants.mjs';
import Sprite from '../classes/core/Sprite.mjs';

export default class Target extends Sprite {
  constructor(props) {
    props.name = 'target';
    //props.x = props.destX;
    //props.y = props.destY;
    props.width = 5;
    props.height = 5;

    console.log('tarrrrrrget');
    console.log(props);

    super(props); // "target", props.target.x, props.target.y, 5, 5

    this.parent = props.parent;
    this.color = props.color;
    this.sprite = copyAndRecolor(this.sheet, 9, 24, this.width, this.height, [{ from: '#999999', to: BLUE }]);
    this.buffer = this.sprite.getContext('2d');
    this.positions = [0, 0, 4, 0, 1, 1, 3, 1, 2, 2, 1, 3, 3, 3, 0, 4, 4, 4];
  }

  update(dt) {
    //this.color = RED; //COLORS[this.parent.colorId];
  }

  draw(ctx) {
    if (!this.visible) return;

    this.buffer.fillStyle = this.color;
    for (let i = 0; i < this.positions.length; i += 2) {
      const x = this.positions[i];
      const y = this.positions[i + 1];
      this.buffer.fillRect(x, y, 1, 1);
    }

    super.draw(ctx);
  }
}
