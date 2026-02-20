import { withinBounds } from '../../functions.mjs';

export default class Mouse {
  constructor(canvasElement) {
    this.x = 0;
    this.y = 0;
    this.visible = false;
    this.down = false;
    this.fire = false;

    this._canvas = canvasElement.canvas;
    this._bindEvents();
  }

  _bindEvents() {
    const canvas = this._canvas;

    canvas.addEventListener('mousedown', (e) => {
      if (!this.down) {
        this.down = true;
        if (this.visible) {
          this.fire = true;
        }
      }
    });

    canvas.addEventListener('mouseup', (e) => {
      this.down = false;
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = ((e.clientX - rect.left) * scaleX) | 0;
      const y = ((e.clientY - rect.top) * scaleY) | 0;

      if (withinBounds(x, y)) {
        this.x = x;
        this.y = y;
        this.visible = true;
      } else {
        this.visible = false;
      }
    });

    canvas.addEventListener('mouseout', (e) => {
      this.visible = false;
      canvas.style.cursor = 'arrow';
    });

    canvas.addEventListener('mouseover', (e) => {
      this.visible = true;
      canvas.style.cursor = 'none';
    });
  }
}
