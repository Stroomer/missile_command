import Sprite from '../core/Sprite.mjs';
import Char from './Char.mjs';

export default class Text extends Sprite {
  constructor(props) {
    const tracking = props.tracking ?? 1;
    const charsArray = props.value.split('');
    const width = Text.GET_WIDTH(charsArray, tracking);

    super({
      ...props,
      name: 'text',
      width,
      height: 7,
    });

    this.value = props.value;
    this.chars = charsArray;
    this.tracking = tracking;
    this.align = props.align ?? Text.ALIGN.LEFT;
    this.valign = props.valign ?? Text.VALIGN.TOP;

    let posX = 0;
    for (let i = 0; i < this.chars.length; i++) {
      const value = this.chars[i];
      const char = new Char({ parent: this, value });

      this.buffer.drawImage(char.sprite, 0, 0, char.width, char.height, posX, 0, char.width, char.height);
      posX += char.width + tracking;
    }
  }

  update(_dt) {}

  draw(ctx) {
    let dx = this.x;
    let dy = this.y;

    if (this.align === Text.ALIGN.CENTER) dx -= this.width >> 1;
    else if (this.align === Text.ALIGN.RIGHT) dx -= this.width;

    if (this.valign === Text.VALIGN.MIDDLE) dy -= this.height >> 1;
    else if (this.valign === Text.VALIGN.BOTTOM) dy -= this.height;

    ctx.drawImage(this.sprite, dx | 0, dy | 0, this.width, this.height);
  }
}

Text.GET_WIDTH = (charsArray, tracking) => {
  let w = 0;

  for (let i = 0; i < charsArray.length; i++) {
    const char = charsArray[i];
    const { width } = Char.GET_RECT(char);
    w += width + (i === charsArray.length - 1 ? 0 : tracking);
  }

  return w;
};

Text.ALIGN = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
};

Text.VALIGN = {
  TOP: 'top',
  MIDDLE: 'middle',
  BOTTOM: 'bottom',
};
