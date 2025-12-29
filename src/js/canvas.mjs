import { BLUE, CIRCLE, COLORS, GREY } from "./constants.mjs";

// convert "#rrggbb" or "rrggbb" to {r,g,b}
function hexToRgb(hex) {
  if (hex[0] === '#') hex = hex.slice(1);
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const v = parseInt(hex, 16);
  return {
    r: (v >> 16) & 0xff,
    g: (v >> 8) & 0xff,
    b: v & 0xff,
  };
}

export function cutAndRecolor(img, sx, sy, w, h, palette) {
  const slice     = cutSprite(img, sx, sy, w, h);
  const recolored = recolorSprite(slice, palette);
  return recolored;
}

// cut sprite from spritesheet
export function cutSprite(img, sx, sy, w, h) {
  const canvas = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(w, h) : document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, sx, sy, w, h, 0, 0, w, h);

  return canvas;
}

// recolor sprite from grey(s) to color(s)
export function recolorSprite(canvas, palette) {
  const rules = palette.map(p => ({
    from: hexToRgb(p.from),
    to:   hexToRgb(p.to)
  }));

  const ctx     = canvas.getContext('2d', { willReadFrequently: true });
  const w       = canvas.width;
  const h       = canvas.height;
  const imgData = ctx.getImageData(0, 0, w, h);
  const data    = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    for (let j = 0; j < rules.length; j++) {
      const { from, to } = rules[j];
      if (r === from.r && g === from.g && b === from.b) {
        data[i]     = to.r;
        data[i + 1] = to.g;
        data[i + 2] = to.b;
        break;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  return canvas;
}

export function drawCircle(ctx, size, color) {  
  const cx     = size / 2 - 0.5;
  const cy     = size / 2 - 0.5;
  const r      = size / 2 - 0.5;

  ctx.fillStyle = color;

  for (let y = 0; y < size; y++) {
    const dy = y - cy;
    const dx = Math.sqrt(r * r - dy * dy);
    const x1 = Math.ceil(cx - dx);
    const x2 = Math.floor(cx + dx);

    ctx.fillRect(x1, y, x2 - x1 + 1, 1);
  }  
}

export function renderBufferList(buffers, color=GREY) {
  for (let i = 0; i < buffers.length; i++) {
    const buffer = buffers[i];
    const radius = buffer.canvas.width;   
    drawCircle(buffer, radius, color);
  }

  return buffers;
}

export function renderBufferListColors(buffers, colors) {
  const arr = [];
  for (let i = 0; i < colors.length; i++) {
    arr.push(...buffers);
  }
  
  const from = '#999999';
  for (let i = 0; i < arr.length; i++) {
    const sprite = arr[i].canvas;
    const to     = COLORS[i % colors.length];
    recolorSprite(sprite, [ { from, to } ]);
  }

  return arr;
}
