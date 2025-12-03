const LITTLE_ENDIAN = (() => {
  const buf = new ArrayBuffer(4);
  new Uint8Array(buf).set([1, 0, 0, 0]);
  return new Uint32Array(buf)[0] === 1;
})();

function packRGBA(r, g, b, a = 255) {
  return LITTLE_ENDIAN
    ? (a << 24) | (b << 16) | (g << 8) | r    // memory: R,G,B,A in LE order
    : (r << 24) | (g << 16) | (b << 8) | a;   // memory: A,B,G,R in BE order
}

// function hexToPacked(hex) {
//   if (hex[0] === "#") hex = hex.slice(1);
//   const v = parseInt(hex, 16);
//   const r = (v >> 16) & 255;
//   const g = (v >> 8)  & 255;
//   const b =  v        & 255;
//   return packRGBA(r, g, b, 255);
// }

// function extractPalette(img, sx, sy, w, h) {
//   const canvas = new OffscreenCanvas(w, h);
//   const ctx = canvas.getContext("2d", { willReadFrequently: true });
//   ctx.drawImage(img, sx, sy, w, h, 0, 0, w, h);

//   const data = ctx.getImageData(0, 0, w, h).data;
//   const palette = new Set();

//   for (let i = 0; i < data.length; i += 4) {
//     const r = data[i];
//     const g = data[i+1];
//     const b = data[i+2];
//     const a = data[i+3];
//     palette.add(packRGBA(r, g, b, a));
//   }
//   return palette;
// }

export function getSpritePaletteSwapped(img, sx, sy, sw, sh, palette) {
    const off = new OffscreenCanvas(sw, sh);
    const ctx = off.getContext("2d", {
        willReadFrequently: true,
        alpha: true
    });

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

    const imgData = ctx.getImageData(0, 0, sw, sh);
    const buf = imgData.data;

    for (let i = 0; i < buf.length; i += 4) {
        let r = buf[i];
        let g = buf[i + 1];
        let b = buf[i + 2];
        let a = buf[i + 3];

        if (a === 0) continue; // skip fully transparent pixels

        // 1. Un-premultiply alpha
        const af = a / 255;
        const ur = Math.round(r / af);
        const ug = Math.round(g / af);
        const ub = Math.round(b / af);

        // 2. Try to match palette
        for (const p of palette) {
            const [fr, fg, fb] = p.from;

            if (ur === fr && ug === fg && ub === fb) {
                const [tr, tg, tb] = p.to;

                // 3. Premultiply again
                buf[i]     = Math.round(tr * af);
                buf[i + 1] = Math.round(tg * af);
                buf[i + 2] = Math.round(tb * af);
                break;
            }
        }
    }

    ctx.putImageData(imgData, 0, 0);
    return { canvas: off, ctx };
}



// Little-endian packer (correct for ImageData)
function hexToPacked(hex) {
  if (hex.startsWith("#")) hex = hex.slice(1);
  const v = parseInt(hex, 16);
  const r = (v >> 16) & 255;
  const g = (v >> 8) & 255;
  const b = v & 255;
  return (255 << 24) | (b << 16) | (g << 8) | r;
}






// // returns true if platform is little endian
// function isLittleEndian() { 
//   const buf = new ArrayBuffer(4);
//   const u8  = new Uint8Array(buf);
//   const u32 = new Uint32Array(buf);

//   u8[0] = 0x11;
//   u8[1] = 0x22;
//   u8[2] = 0x33;
//   u8[3] = 0x44;

//   return u32[0] === 0x44332211;
// }

// const LITTLE_ENDIAN = isLittleEndian();

// function hexToRGBA32(hex) {
//   if (hex[0] === '#') hex = hex.slice(1);

//   const v = parseInt(hex, 16);
//   const r = (v >> 16) & 0xff;
//   const g = (v >> 8) & 0xff;
//   const b = v & 0xff;
//   const a = 0xff;

//   if (LITTLE_ENDIAN) return (a << 24) | (r << 16) | (g << 8) | b; // memory: [B, G, R, A]
//   else               return (a << 24) | (r << 16) | (g << 8) | b; // memory: [A, R, G, B] (same packing, different meaning)
// }

// /**
//  * getSpriteMulti(img, sx, sy, w, h, [
//  *   { from: "#999999", to: "#ffff00" },
//  *   { from: "#555555", to: "#00ff00" },
//  *   ...
//  * ])
//  */
// export function getSpriteMulti(img, sx, sy, w, h, rules) {
//   // create canvas (offscreen if possible)
//   const canvas = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(w, h) : document.createElement('canvas');

//   canvas.width = w;
//   canvas.height = h;

//   const ctx = canvas.getContext('2d', { willReadFrequently: true });
//   ctx.imageSmoothingEnabled = false;

//   // draw slice
//   ctx.drawImage(img, sx, sy, w, h, 0, 0, w, h);

//   // read pixels quickly
//   const imgData = ctx.getImageData(0, 0, w, h);
//   const buf32 = new Uint32Array(imgData.data.buffer);

//   // pre-pack all color rules for fast comparison
//   const map = rules.map((rule) => ({
//     from: hexToRGBA32(rule.from),
//     to: hexToRGBA32(rule.to),
//   }));

//   // FAST loop: compare & replace in Uint32
//   for (let i = 0; i < buf32.length; i++) {
//     const px = buf32[i];
//     for (let j = 0; j < map.length; j++) {
//       if (px === map[j].from) {
//         buf32[i] = map[j].to;
//         break;
//       }
//     }
//   }

//   // write modified pixels
//   ctx.putImageData(imgData, 0, 0);

//   return canvas;
// }