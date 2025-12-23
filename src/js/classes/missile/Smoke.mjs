export default class Smoke {
  constructor(x, y, parent) {
    this.game = parent;
    this.x = x;
    this.y = y;
    this.garbage = false;
    this.fading = false;
    
  }

  update(dt) {}

  draw(ctx) {
    // smokeBuffer.fillStyle = blue;

    // const px = this.prevX | 0;
    // const py = this.prevY | 0;
    // const nx = this.x | 0;
    // const ny = this.y | 0;

    // drawLineBresenham(px, py, nx, ny, smokeBuffer);
  }
}
