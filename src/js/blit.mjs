// returns true if platform is little endian
function isLittleEndian() { 
  const buf = new ArrayBuffer(4);
  const u8  = new Uint8Array(buf);
  const u32 = new Uint32Array(buf);

  u8[0] = 0x11;
  u8[1] = 0x22;
  u8[2] = 0x33;
  u8[3] = 0x44;

  return u32[0] === 0x44332211;
}

const LITTLE_ENDIAN = isLittleEndian();

function hexToRGBA32(hex) {
  if (hex[0] === '#') hex = hex.slice(1);

  const v = parseInt(hex, 16);
  const r = (v >> 16) & 0xff;
  const g = (v >> 8) & 0xff;
  const b = v & 0xff;
  const a = 0xff;

  if (LITTLE_ENDIAN) return (a << 24) | (r << 16) | (g << 8) | b; // memory: [B, G, R, A]
  else               return (a << 24) | (r << 16) | (g << 8) | b; // memory: [A, R, G, B] (same packing, different meaning)
}

/**
 * getSpriteMulti(img, sx, sy, w, h, [
 *   { from: "#999999", to: "#ffff00" },
 *   { from: "#555555", to: "#00ff00" },
 *   ...
 * ])
 */
export function getSpriteMulti(img, sx, sy, w, h, rules) {
  // create canvas (offscreen if possible)
  const canvas = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(w, h) : document.createElement('canvas');

  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingEnabled = false;

  // draw slice
  ctx.drawImage(img, sx, sy, w, h, 0, 0, w, h);

  // read pixels quickly
  const imgData = ctx.getImageData(0, 0, w, h);
  const buf32 = new Uint32Array(imgData.data.buffer);

  // pre-pack all color rules for fast comparison
  const map = rules.map((rule) => ({
    from: hexToRGBA32(rule.from),
    to: hexToRGBA32(rule.to),
  }));

  // FAST loop: compare & replace in Uint32
  for (let i = 0; i < buf32.length; i++) {
    const px = buf32[i];
    for (let j = 0; j < map.length; j++) {
      if (px === map[j].from) {
        buf32[i] = map[j].to;
        break;
      }
    }
  }

  // write modified pixels
  ctx.putImageData(imgData, 0, 0);

  return canvas;
}

export const recoloredLandscape = getSpriteMulti(document.getElementById('sprites'), 0, 0, 23, 256, [
  { from: '#999999', to: '#ffff00' }, // grey → yellow
  { from: '#444444', to: '#ff0000' }, // dark grey → red
  { from: '#00ffff', to: '#00ff00' }, // cyan → green
]);