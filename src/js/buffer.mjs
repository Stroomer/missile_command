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

function showBufferAttributes(ctx) {
  const supported = ctx.getContextAttributes;
  const message   = supported ? JSON.stringify(ctx.getContextAttributes()) : 'feature not supported'; 
  console.log(message);
}