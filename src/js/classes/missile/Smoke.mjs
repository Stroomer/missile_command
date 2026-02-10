export default class Smoke {
  constructor(props) {
    this.parent        = props.parent;
    this.speed         = props.speed;
    this.color         = props.color;
    this.pixels        = props.pixels;
    this.lastIndex     = props.pixels.length - 1;
    this.progress      = 0;
    this.visiblePixels = 0;
    this.visible       = true;
  }

  update(dt) {
    const progress  = this.progress + (this.speed * dt);
    const next      = progress | 0;
    const index     = next < this.lastIndex ? next : this.lastIndex;
    const pixel     = this.pixels[index];
    const triggered = next >= this.lastIndex;
    //const exploded  = this.parent.explosion.phase==   = Explosion.STATE.EXPLODE;

    this.x = this.parent.fuze.x = pixel.x;
    this.y = this.parent.fuze.y = pixel.y;    

    this.progress      = progress;
    this.visiblePixels = index;    

    if (triggered) this.parent.fuze.trigger(); 
  }

  draw(ctx) {
    if (!this.visible || this.visiblePixels === 0) return;

    ctx.fillStyle = this.color;
    for (let i = 0; i < this.visiblePixels; i++) {
      const pixel = this.pixels[i];
      ctx.fillRect(pixel.x, pixel.y, 1, 1);
    }
  }
}
