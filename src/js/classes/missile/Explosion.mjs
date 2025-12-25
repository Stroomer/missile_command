import { cutAndRecolor } from '../../canvas.mjs';
import { COLORS } from '../../constants.mjs';
import { randomInt } from '../../helpers.mjs';
import Sprite from "../Sprite.mjs";
import { easeInQuad, easeOutQuad } from '../../helpers.mjs';

export default class Explosion extends Sprite {
  constructor(game, x, y, radius) {
    super(x, y, radius, radius);
    
    this.time         = 0;
    this.expandTime   = 0.3;
    this.collapseTime = 0.5;
    this.maxRadius    = Explosion.SPRITESHEET_SLICES[Explosion.SPRITESHEET_SLICES.length-1].r;
    this.phase        = 0; // 0 = expand, 1 = collapse
    this.game         = game;
    this.radius       = radius;
    this.sprites      = [];
    
    for (let s = 0; s < Explosion.SPRITESHEET_SLICES.length; s++) {
      const { x, y, r } = Explosion.SPRITESHEET_SLICES[s];
      for (let i = 0; i < COLORS.length; i++) {
        this.sprites.push(cutAndRecolor(this.sheet, x, y, r, r, [{ from: '#999999', to: COLORS[i] }]));
      }
    }

    this.sprite = this.sprites[this.game.colorId];
    this.buffer = this.sprite.getContext('2d');
    this.garbage = false;
  }

  update(dt) {
    this.time += dt;
    let t, eased;

    if (this.phase === 0) {
      t = Math.min(this.time / this.expandTime, 1);
      eased = easeOutQuad(t);
      if (t >= 1) {
        this.phase = 1;
        this.time = 0;
      }
    } else {
      t = Math.min(this.time / this.collapseTime, 1);
      eased = 1 - easeInQuad(t);
      if (t >= 1) {
        this.garbage = true;
        return;
      }
    }

    const { sprites } = this;
    const { colorId } = this.game;
    const maxIndex = Explosion.SPRITESHEET_SLICES.length - 1; // 🔥 SPRITE INDEX
    const idx = eased * maxIndex | 0;
    
    this.sprite = this.getSprite(sprites, idx, colorId, COLORS.length);
    this.collisionRadius = eased * this.maxRadius;

    super.update(dt);
  }

  hit(obj) {
    const dx = obj.x - this.x;
    const dy = obj.y - this.y;
    const r  = this.collisionRadius + obj.radius;

    return dx * dx + dy * dy <= r * r;
  }


  draw(ctx) {
    super.draw(ctx);
  }

  getSprite(sprites, size, colorId, colorsCnt) {
    const sprite = sprites[(size * colorsCnt) + colorId];
    
    this.width  = sprite.width;
    this.height = sprite.height;
    this.halfW  = sprite.width / 2;
    this.halfH  = sprite.height / 2;
    
    return sprite;
  }
}

Explosion.SPRITESHEET_SLICES =  [
    { x: 250, y: 24, r:  5 },
    { x: 242, y: 24, r:  7 },
    { x: 232, y: 24, r:  9 },
    { x: 220, y: 24, r: 11 },
    { x: 206, y: 24, r: 13 },
    { x: 190, y: 24, r: 15 },
    { x: 172, y: 24, r: 17 },
    { x: 152, y: 24, r: 19 },
    { x: 130, y: 24, r: 21 },
    { x: 106, y: 24, r: 23 },
    { x:  80, y: 24, r: 25 },
];




// EXPLOSION CLEAR BUFFER OF SMOKETRAIL AND STUFF??

/**
 * Clears multiple explosion areas from a canvas in ONE operation.
 *
 * @param {CanvasRenderingContext2D} ctx - target canvas context
 * @param {OffscreenCanvas|HTMLCanvasElement} maskCanvas - reusable mask canvas
 * @param {Array} explosions - array of explosion objects
 */
// export function clearExplosionsBatch(ctx, maskCanvas, explosions) {
//   if (!explosions.length) return;

//   const mctx = maskCanvas.getContext('2d');

//   // 1️⃣ Clear mask
//   mctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);

//   // 2️⃣ Draw all explosion sprites into mask
//   for (let i = 0; i < explosions.length; i++) {
//     const e = explosions[i];
//     mctx.drawImage(
//       e.sprite,
//       e.x - e.halfW,
//       e.y - e.halfH
//     );
//   }

//   // 3️⃣ Clear target canvas using mask (ONE CALL)
//   ctx.save();
//   ctx.globalCompositeOperation = 'destination-out';
//   ctx.drawImage(maskCanvas, 0, 0);
//   ctx.restore();
// }
