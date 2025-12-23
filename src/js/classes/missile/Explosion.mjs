import { cutAndRecolor } from '../../canvas.mjs';
import { colors } from '../../constants.mjs';
import { randomInt } from '../../helpers.mjs';
import Sprite from "../Sprite.mjs";
import { easeInQuad, easeOutQuad } from '../../helpers.mjs';

function getSizes() {
  return [
      { x:211, y:24, r:3  },
      { x:205, y:24, r:5  },
      { x:197, y:24, r:7  },
      { x:187, y:24, r:9  },
      { x:175, y:24, r:11 },
      { x:161, y:24, r:13 },
      { x:145, y:24, r:15 },
      { x:127, y:24, r:17 },
      { x:107, y:24, r:19 },
      { x: 85, y:24, r:21 },
    ];
}

export default class Explosion extends Sprite {
  constructor(game, x, y, radius) {
    super(x, y, radius, radius);
    
    this.sizeF      = 0;          // float
    this.sizeIndex  = 0;          // int (sprite index)
    this.sizeSpeed  = 20;         // sprites per seconde
    this.expanding  = true;

    this.time       = 0;
    this.expandTime = 0.18;
    this.collapseTime = 0.22;
    this.maxRadius  = radius;
    this.phase      = 0; // 0 = expand, 1 = collapse

    this.game    = game;
    this.radius  = radius;
    this.sizes = getSizes();
    this.sprites = [];
    for (let s = 0; s < this.sizes.length; s++) {
      const { x, y, r } = this.sizes[s];
      for (let i = 0; i < colors.length; i++) {
        this.sprites.push(cutAndRecolor(this.sheet, x, y, r, r, [{ from: '#999999', to: colors[i] }]));
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

    console.log('aaa');
    
    
    // 🔥 SPRITE INDEX
    const maxIndex = this.sizes.length - 1;
    const idx = eased * maxIndex | 0;
    
    
    this.sprite = this.getSprite(this.sprites, idx, this.game.colorId, colors.length);
    
    // 💥 COLLISION RADIUS = VISUAL RADIUS
    this.collisionRadius = eased * this.maxRadius;
    
    console.log('bbb');

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
    if (this.expanding && size >= this.sizes.length - 1) this.expanding = false;
    else if (size <= 0)                                  this.size = size = 0;

    const sprite = sprites[(size * colorsCnt) + colorId];
    
    this.width  = sprite.width;
    this.height = sprite.height;
    this.halfW  = sprite.width / 2;
    this.halfH  = sprite.height / 2;
    
    return sprite;
  }
}

