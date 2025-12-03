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

export function getSpriteMulti(img, sx, sy, w, h, palette) {
  // Convert palette to RGB upfront for speed
  const rules = palette.map((p) => ({
    fr: hexToRgb(p.from),
    to: hexToRgb(p.to),
  }));

  const canvas = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(w, h) : document.createElement('canvas');

  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingEnabled = false;

  // Draw the slice
  ctx.drawImage(img, sx, sy, w, h, 0, 0, w, h);

  // Read pixels
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // Per pixel
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Find a matching rule
    for (let j = 0; j < rules.length; j++) {
      const { fr, to } = rules[j];

      if (r === fr.r && g === fr.g && b === fr.b) {
        data[i] = to.r;
        data[i + 1] = to.g;
        data[i + 2] = to.b;
        break;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}
