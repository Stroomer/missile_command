import { randomInt } from '../helpers.mjs';

export default class FlashingDot {
  constructor(colors) {
    console.log('FlashingPixel');

    this.colors = colors;
    this.index = randomInt(0, this.colors.length - 1);
    this.color = this.colors[this.index];
    this.frame = 0;
    this.flashInterval = 3;
  }

  update() {
    if (++this.frame % this.flashInterval) return;
    if (++this.index >= this.colors.length) this.index = 0;
    this.color = this.colors[this.index];
  }
}
