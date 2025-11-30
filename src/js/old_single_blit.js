// helper: convert "#rrggbb" or "rrggbb" to {r,g,b}
function hexToRgb(hex) {
  if (hex[0] === '#') hex = hex.slice(1);
  if (hex.length === 3) {
    // short form like "f0a"
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

/**
 * Extract a sprite from an image, recolor all pixels that match fromColorHex to toColorHex,
 * return a Canvas (OffscreenCanvas if supported) ready to draw with ctx.drawImage(sprite, x, y).
 *
 * img: HTMLImageElement or other drawable
 * sx,sy,w,h: source rectangle in the spritesheet
 * fromColorHex, toColorHex: strings like "#999999", "#ffff00"
 */
export function getSprite(img, sx, sy, w, h, fromColorHex, toColorHex) {
  const FROM = hexToRgb(fromColorHex);
  const TO = hexToRgb(toColorHex);

  // Create canvas (use OffscreenCanvas when available, fallback to DOM canvas)
  const canvas = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(w, h) : document.createElement('canvas');

  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingEnabled = false;

  // draw the sprite slice onto the temporary canvas
  ctx.drawImage(img, sx, sy, w, h, 0, 0, w, h);

  // read pixels
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data; // Uint8ClampedArray, [R,G,B,A,...]

  // Loop per pixel and replace matching RGB
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // const a = data[i + 3]; // preserved

    if (r === FROM.r && g === FROM.g && b === FROM.b) {
      data[i] = TO.r;
      data[i + 1] = TO.g;
      data[i + 2] = TO.b;
      // keep alpha as-is (data[i+3])
    }
  }

  // write back and return the canvas
  ctx.putImageData(imgData, 0, 0);
  return canvas;
}
