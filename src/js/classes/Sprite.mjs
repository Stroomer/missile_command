export default class Sprite {
  constructor(x, y, width, height) {
    this.x       = x;
    this.y       = y;
    this.width   = width;
    this.height  = height;
    this.halfW   = width  / 2;
    this.halfH   = height / 2;
    this.speed   = 0;
    this.dirX    = 0;
    this.dirY    = 0;
    this.visible = true;
    this.sheet   = document.getElementById('sprites');  
  }

  update(dt) {
    this.x += this.dirX * this.speed * dt;
    this.y += this.dirY * this.speed * dt;
  }

  draw(ctx) {
    const x = (this.x-this.halfW) | 0;
    const y = (this.y-this.halfH) | 0;
    const w = this.width;
    const h = this.height;

    ctx.drawImage(this.sprite, x, y, w, h);
  }

  getSprite(sprites, index) {
    const sprite = sprites[index].canvas;
       
    this.width  = sprite.width;
    this.height = sprite.height;
    this.halfW  = sprite.width / 2;
    this.halfH  = sprite.height / 2;
    
    return sprite;
  }
}
