import { BLACK, DEBUG, WIDTH, HEIGHT } from "./constants.mjs";

export function createBuffer(id, w=null, h=null) {
  let canvas, ctx;
  const isScreenBuffer     = id === 'onscreen' ? true : false;       // check if this is the visible screen buffer
  const isAlphaBuffer      = isScreenBuffer ? false : true;          // check if buffer should have alpha capabilities
  const offscreen          = typeof OffscreenCanvas !== 'undefined'; // check if offscreencanvas is available
  const willReadFrequently = true;                                   // canvas magic...?
  const desynchronized     = false;                                  // canvas magic...?
  const bufferWidth        = w || WIDTH;
  const bufferHeight       = h || HEIGHT;

  if (isScreenBuffer) {
    canvas                       = document.getElementById(id);
    canvas.width                 = bufferWidth;
    canvas.height                = bufferHeight;
    canvas.style.display         = 'block';
    canvas.style.backgroundColor = BLACK;
  } else {
    canvas = offscreen ? new OffscreenCanvas(bufferWidth, bufferHeight) : document.createElement('canvas');
  }

  ctx = canvas.getContext('2d', { alpha:isAlphaBuffer, willReadFrequently, desynchronized });
  ctx.imageSmoothingEnabled = false;
  if (DEBUG) showBufferAttributes(ctx);
  return ctx;
}

export function createBufferList(id, step, min, max, context=false) {
  const buffers = [];
  const frames  = max / step;

  for (let i = 0; i < frames; i++) {
    const size = min + (i * step);  
    const buffer = createBuffer(`${id}_${i}`, size, size);
    console.log(`size = ${size} x ${size}`);

    buffers.push(context ? buffer : buffer.canvas);
  }

  return buffers;
}

function showBufferAttributes(ctx) {
  const supported = ctx.getContextAttributes;
  const message   = supported ? JSON.stringify(ctx.getContextAttributes()) : 'feature not supported'; 
  console.log(message);
}

// export function flip(ctx) {



//   const { width, height } = ctx.canvas;
//   const srcImg            = ctx.getImageData(0, 0, width, height);
//   const src               = new Uint32Array(srcImg.data.buffer);
//   const out               = new Uint32Array(src.length);

//   for (let y = 0; y < height; y++) {
//     const row = y * width;
//     for (let x = 0; x < width; x++) {
//       out[row + x] = src[row + (width - 1 - x)];
//     }
//   }

//   const outCanvas = new OffscreenCanvas(width, height);
//   const outCtx = outCanvas.getContext('2d');
//   const outImg = new ImageData(new Uint8ClampedArray(out.buffer), width, height);

//   outCtx.putImageData(outImg, 0, 0);
//   return outCanvas;
// }

export function flip(canvas) {
  const width  = canvas.width;
  const height = canvas.height;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  const srcImg = ctx.getImageData(0, 0, width, height);
  const src    = new Uint32Array(srcImg.data.buffer);
  const dst    = new Uint32Array(src.length);

  for (let y = 0; y < height; y++) {
    const row = y * width;
    let left  = row;
    let right = row + width - 1;

    while (left <= right) {
      const a = src[left];
      const b = src[right];
      dst[left++]  = b;
      dst[right--] = a;
    }
  }

  const outCanvas = new OffscreenCanvas(width, height);
  const outCtx    = outCanvas.getContext('2d');

  outCtx.putImageData(
    new ImageData(new Uint8ClampedArray(dst.buffer), width, height),
    0,
    0
  );

  return outCanvas;
}
