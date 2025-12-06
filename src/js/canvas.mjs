// helper: convert "#rrggbb" or "rrggbb" to {r,g,b}
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

export function cutSprite(img, sx, sy, w, h) {
  const canvas = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(w, h) : document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, sx, sy, w, h, 0, 0, w, h);

  return canvas; // ready for recolorSprite() or drawing
}

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
  return canvas; // recolored and ready to draw
}
