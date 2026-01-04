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



export function createBufferList(id, sizes) {
  const buffers = [];

  for (let i = 0; i < sizes.length; i++) {
    const label  = `${id}_${i}`;
    const size   = sizes[i];  
    const buffer = createBuffer(label, size, size);
    
    buffers.push(buffer);
    console.log(`label = ${label}, size = ${size} x ${size}`); 
  }

  return buffers;
}

function showBufferAttributes(ctx) {
  const supported = ctx.getContextAttributes;
  const message   = supported ? JSON.stringify(ctx.getContextAttributes()) : 'feature not supported'; 
  console.log(message);
}

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
