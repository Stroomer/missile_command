import { BLACK, DEBUG, WIDTH, HEIGHT } from '../../constants.mjs';

export default class Buffer {
  static create(id, w = null, h = null) {
    let canvas, ctx;
    const isScreenBuffer = id === 'onscreen' ? true : false;
    const isAlphaBuffer = isScreenBuffer ? false : true;
    const offscreen = typeof OffscreenCanvas !== 'undefined';
    const willReadFrequently = true;
    const desynchronized = false;
    const bufferWidth = w || WIDTH;
    const bufferHeight = h || HEIGHT;

    if (isScreenBuffer) {
      //console.log(`create screenbuffer: ${id}`);
      canvas = document.getElementById(id);
      canvas.width = bufferWidth;
      canvas.height = bufferHeight;
      canvas.style.display = 'block';
      canvas.style.backgroundColor = BLACK;
    } else {
      //console.log(`create offscreenbuffer: ${id}`);
      canvas = offscreen ? new OffscreenCanvas(bufferWidth, bufferHeight) : document.createElement('canvas');
    }

    ctx = canvas.getContext('2d', { alpha: isAlphaBuffer, willReadFrequently, desynchronized });
    ctx.imageSmoothingEnabled = false;
    if (DEBUG) Buffer._showAttributes(ctx);

    return ctx;
  }

  static _showAttributes(ctx) {
    const supported = ctx.getContextAttributes;
    const message = supported ? JSON.stringify(ctx.getContextAttributes()) : 'feature not supported';
  }

  static flip(canvas) {
    const width = canvas.width;
    const height = canvas.height;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const srcImg = ctx.getImageData(0, 0, width, height);
    const src = new Uint32Array(srcImg.data.buffer);
    const dst = new Uint32Array(src.length);

    for (let y = 0; y < height; y++) {
      const row = y * width;
      let left = row;
      let right = row + width - 1;

      while (left <= right) {
        const a = src[left];
        const b = src[right];
        dst[left++] = b;
        dst[right--] = a;
      }
    }

    const outCanvas = new OffscreenCanvas(width, height);
    const outCtx = outCanvas.getContext('2d');

    outCtx.putImageData(new ImageData(new Uint8ClampedArray(dst.buffer), width, height), 0, 0);

    return outCanvas;
  }
}
