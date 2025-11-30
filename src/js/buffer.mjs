import { black, DEBUG } from "./constants.mjs";

export function createBuffer(id, width, height) {
  const screen             = id === 'screen' ? true : false;         // check if this is the visible screen buffer
  const alpha              = screen ? false : true;            // check if buffer should have alpha capabilities
  const offscreen          = typeof OffscreenCanvas !== 'undefined'; // check if offscreencanvas is available
  const willReadFrequently = true;                                   // canvas magic...?
  const desynchronized     = false;                                  // canvas magic...?
  const canvas             = offscreen && !screen ? new OffscreenCanvas(width, height) : document.createElement('canvas');
  const ctx                = canvas.getContext('2d', { alpha, willReadFrequently, desynchronized });

  ctx.imageSmoothingEnabled = false;

  canvas.id = id;
  canvas.width = width;
  canvas.height = height;
    
  if (DEBUG) showBufferAttributes(ctx);
  
  if (screen) {
    canvas.style.display = 'block';
    canvas.style.backgroundColor = black;
    document.body.appendChild(canvas);
  }
  
  return ctx;
}

function showBufferAttributes(ctx) {
  const supported = ctx.getContextAttributes;
  const message   = supported ? JSON.stringify(ctx.getContextAttributes()) : 'feature not supported'; 
  console.log(message);
}