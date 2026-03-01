import { BLUE, CYAN } from '../../constants.mjs';
import Sprite from '../core/Sprite.mjs';
import Silo from './Silo.mjs';
import Explosion from './Explosion.mjs';
import Text from '../text/Text.mjs';
import Canvas from '../core/Canvas.mjs';
import Buffer from '../core/Buffer.mjs';

const BLINK_CYCLE = 0.25; // full fade cycle in seconds (BLUE → CYAN → BLUE)
// Source rect of a single silo on the sprite sheet (matches Silo constructor)
const SILO_SX = 15,
  SILO_SY = 28,
  SILO_W = 3,
  SILO_H = 5;

export default class Depot extends Sprite {
  constructor(props) {
    super({
      ...props,
      name: 'depot',
      width: 21,
      height: 14,
    });

    this.id = props.parent.depots.length;
    this.out = false;
    this.low = false;
    this.selected = false;
    this.blinkTimer = 0;
    this.blinkAlpha = 0;

    this.positions = [
      { x: 0, y: 0 },
      { x: -3, y: 3 },
      { x: 3, y: 3 },
      { x: -6, y: 6 },
      { x: 0, y: 6 },
      { x: 6, y: 6 },
      { x: -9, y: 9 },
      { x: -3, y: 9 },
      { x: 3, y: 9 },
      { x: 9, y: 9 },
    ];

    this.silos = [];

    for (let i = 0; i < 10; i++) {
      const silo = new Silo({ parent: this, x: 9 + this.positions[i].x, y: this.positions[i].y });
      this.silos.push(silo);
    }

    // Pre-render a CYAN-coloured silo stamp (shared across all positions)
    this.cyanSiloSprite = Canvas.copyAndRecolor(this.sheet, SILO_SX, SILO_SY, SILO_W, SILO_H, [{ from: '#999999', to: CYAN }]);

    // Canvas that holds only the next-to-fire silo rendered in CYAN
    const nextCtx = Buffer.create('depot_next', this.width, this.height);
    this.nextSiloSprite = nextCtx.canvas;
    this.nextSiloBuffer = nextCtx;

    this.label = new Text({
      parent: this.parent,
      x: 0,
      y: 0,
      values: [{ value: 'low', blink: false }],
      color: BLUE,
      align: Text.ALIGN.CENTER,
      valign: Text.VALIGN.TOP,
    });

    this.drawBuffer();
  }

  setSelected(value) {
    this.selected = value;
  }

  /** Attempt to fire toward (destX, destY). Returns true if a missile was launched. */
  launch(destX, destY) {
    if (this.out) return false;

    this.silos.pop();
    this.out = this.silos.length === 0;
    this.low = !this.out && this.silos.length <= 3;
    this.drawBuffer();

    this.parent.factory.createMissile({
      parent: this.parent,
      x: this.x + (this.width >> 1),
      y: this.y,
      destX,
      destY,
      speed: 110,
      color: BLUE,
      radius: Explosion.GIANT,
      expandTime: 0.2,
      collapseTime: 0.3,
    });

    return true;
  }

  drawBuffer() {
    this.buffer.clearRect(0, 0, this.width, this.height);
    this.nextSiloBuffer.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.silos.length; i++) {
      const silo = this.silos[i];
      this.buffer.drawImage(silo.sprite, silo.x, silo.y, silo.width, silo.height);
    }

    // Highlight only the next silo to be fired (last in array)
    if (this.silos.length > 0) {
      const next = this.silos[this.silos.length - 1];
      this.nextSiloBuffer.drawImage(this.cyanSiloSprite, 0, 0, SILO_W, SILO_H, next.x, next.y, next.width, next.height);
    }
  }

  update(dt) {
    if (!this.selected) {
      this.blinkTimer = 0;
      this.blinkAlpha = 0;
      return;
    }

    this.blinkTimer += dt;
    if (this.blinkTimer >= BLINK_CYCLE) this.blinkTimer -= BLINK_CYCLE;
    this.blinkAlpha = 0.5 * (1 - Math.cos((2 * Math.PI * this.blinkTimer) / BLINK_CYCLE));
  }

  draw(ctx) {
    ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);

    if (this.blinkAlpha > 0) {
      ctx.globalAlpha = this.blinkAlpha;
      ctx.drawImage(this.nextSiloSprite, this.x, this.y, this.width, this.height);
      ctx.globalAlpha = 1;
    }

    if (this.low || this.out) {
      this.label.setValue(this.out ? 'out' : 'low');
      this.label.x = 8 + this.x + (this.width >> 1);
      this.label.y = this.y + this.height + 2;
      this.label.draw(ctx);
    }
  }
}
