import Buffer from '../core/Buffer.mjs';

export default class Sprite {
  constructor(props) {
    if (!props.parent) throw new Error(`Sprite "${props.name}" requires a parent reference`); 

    this.parent = props.parent;
    this.name   = props.name    || "no_name";
    this.x      = (props.x | 0);
    this.y      = (props.y | 0);
    this.width  = props.width   || 1;
    this.height = props.height  || 1;
    this.speed  = props.speed   || 0;
    this.dirX   = props.dirX    || 0;
    this.dirY   = props.dirY    || 0;
    this.halfW  = this.width  === 1 ? 0 : Math.floor(this.width/2);
    this.halfH  = this.height === 1 ? 0 : Math.floor(this.height/2);

    this.garbage = false;
    this.sprite  = Buffer.create(this.name, this.width, this.height).canvas;
    this.buffer  = this.sprite.getContext('2d');
    this.box     = { x: this.x, y: this.y, width: this.width, height: this.height };
    this.sheet = document.getElementById('sprites');
  }

  update(dt) {
    this.x += this.dirX * this.speed * dt;
    this.y += this.dirY * this.speed * dt;
  }

  draw(ctx) {
    const x = (this.x - this.halfW) | 0;
    const y = (this.y - this.halfH) | 0;
    const w = this.width;
    const h = this.height;

    ctx.drawImage(this.sprite, x, y, w, h);
  }

  setBox(sprite) {
    this.sprite = sprite;
    this.width  = sprite.width;
    this.height = sprite.height;
    this.halfW  = sprite.width / 2;
    this.halfH  = sprite.height / 2;

    if (this.halfW===0 || this.halfH===0) {
      throw Error("Something went wrong here...");
    }

  }

  getBox() {
    this.box.x      = (this.x - this.halfW) | 0;
    this.box.y      = (this.y - this.halfH) | 0;
    this.box.width  = this.width;
    this.box.height = this.height;

    return this.box;
  }
}
