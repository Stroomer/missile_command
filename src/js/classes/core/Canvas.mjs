export default class Canvas {
  // convert "#rrggbb" or "rrggbb" to {r,g,b}
  static hexToRgb(hex) {
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

  static copyAndRecolor(img, sx, sy, w, h, palette) {
    const slice = Canvas.copySprite(img, sx, sy, w, h);
    const recolored = Canvas.recolorSprite(slice, palette);
    return recolored;
  }

  static copySprite(source, sx = 0, sy = 0, w, h) {
    let srcCanvas; // --- Normalize source ---

    if (source instanceof CanvasRenderingContext2D) srcCanvas = source.canvas;
    else if (source instanceof OffscreenCanvasRenderingContext2D) srcCanvas = source.canvas;
    else srcCanvas = source;

    if (!srcCanvas) throw new TypeError('Invalid source provided to copySprite');

    const srcW = srcCanvas.width || srcCanvas.naturalWidth; // --- Resolve width / height ---
    const srcH = srcCanvas.height || srcCanvas.naturalHeight;

    if (w == null) w = srcW;
    if (h == null) h = srcH;

    const sprite = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(w, h) : Object.assign(document.createElement('canvas'), { width: w, height: h }); // --- Create target canvas ---
    const ctx = sprite.getContext('2d', { willReadFrequently: true });
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(srcCanvas, sx, sy, w, h, 0, 0, w, h); // --- Draw ---

    return sprite;
  }

  // recolor sprite from grey(s) to color(s)
  static recolorSprite(canvas, palette) {
    const rules = palette.map((p) => ({
      from: Canvas.hexToRgb(p.from),
      to: Canvas.hexToRgb(p.to),
    }));

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const w = canvas.width;
    const h = canvas.height;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      for (let j = 0; j < rules.length; j++) {
        const { from, to } = rules[j];
        if (r === from.r && g === from.g && b === from.b) {
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

  static drawCircle(ctx, size, color) {
    const cx = size / 2 - 0.5;
    const cy = size / 2 - 0.5;
    const r = size / 2 - 0.5;

    ctx.fillStyle = color;

    for (let y = 0; y < size; y++) {
      const dy = y - cy;
      const dx = Math.sqrt(r * r - dy * dy);
      const x1 = Math.ceil(cx - dx);
      const x2 = Math.floor(cx + dx);

      ctx.fillRect(x1, y, x2 - x1 + 1, 1);
    }
  }
}
