export function createBuffer(id, width, height, alpha, bgcolor, visible, showAttribs) {
  const canvas = document.createElement('canvas');
  const ctx    = canvas.getContext('2d', { alpha, willReadFrequently: true, desynchronized: false });

  ctx.imageSmoothingEnabled = false;

  canvas.id = id;
  canvas.width = width;
  canvas.height = height;
  canvas.style.display = visible ? 'block' : 'none';

  if (bgcolor)     canvas.style.backgroundColor = bgcolor;
  if (visible)     document.body.appendChild(canvas);
  if (showAttribs) showBufferAttributes(ctx);

  return ctx;
}

function showBufferAttributes(ctx) {
  const supported = ctx.getContextAttributes;
  console.log(supported ? JSON.stringify(ctx.getContextAttributes()) : 'feature not supported');
}