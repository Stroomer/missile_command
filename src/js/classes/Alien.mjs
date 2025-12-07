import { blue, colors, red, WIDTH, yellow } from '../constants.mjs';
import { cutAndRecolor } from '../canvas.mjs';
import { randomInt } from '../helpers.mjs';
import Sprite from './Sprite.mjs';

export default class Alien extends Sprite {
  constructor(x, y, dot) {
    super(x, y, 14, 13);
    
    this.dot = dot;
    this.speed = 10;
    this.vx = x <= WIDTH / 2 ? 1 : -1;
    this.vy = 0;
    this.sprite = cutAndRecolor(this.spritesheet, 62, 24, this.width, this.height, [
      { from: '#999999', to: blue },
      { from: '#666666', to: red },
    ]);
    this.buffer = this.sprite.getContext('2d');
  }

  update() {
    super.update();
  }

  draw(ctx) {
    //super.draw();

    console.log(this.buffer.canvas);
    
    this.drawAntenna(this.dot.color);

    const w = this.width;
    const h = this.height;
    const x = (this.x-(w/2)) | 0;
    const y = (this.y-(h/2)) | 0;
    
    ctx.drawImage(this.sprite, x, y, w, h);

    // WAAROM WORDT DE BUFFER NIET LEEGGEGOOID??????
  }

  drawAntenna(color) {
    const w = this.width;
    const h = this.height;

    this.buffer.fillStyle = color;
    this.buffer.fillRect(0,   0,   1, 1);
    this.buffer.fillRect(w-1, 0,   1, 1);
    this.buffer.fillRect(w-1, h-1, 1, 1);
    this.buffer.fillRect(0,   h-1, 1, 1);
  }
}