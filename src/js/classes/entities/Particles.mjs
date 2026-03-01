import { randomInt } from '../../functions.mjs';

const GRAVITY = 150; // px/s²
const PHASE_COLOR = 0.5; // seconds: RED → YELLOW
const PHASE_FADE = 0.5; // seconds: YELLOW fading out
const TOTAL_LIFE = PHASE_COLOR + PHASE_FADE;

export default class Particles {
  constructor(props) {
    this.parent = props.parent;
    this.garbage = false;

    const count = props.count ?? randomInt(12, 16);
    this.particles = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 30 + Math.random() * 60;
      this.particles.push({
        x: props.x,
        y: props.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
      });
    }
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;

      if (p.life >= TOTAL_LIFE) {
        this.particles.splice(i, 1);
        continue;
      }

      p.vy += GRAVITY * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }

    if (this.particles.length === 0) this.garbage = true;
  }

  draw(ctx) {
    for (const p of this.particles) {
      let alpha, g;

      if (p.life < PHASE_COLOR) {
        // RED → YELLOW: green channel 0 → 255
        alpha = 1;
        g = (p.life / PHASE_COLOR) * 255;
      } else {
        // YELLOW fading out: alpha 1 → 0
        alpha = 1 - (p.life - PHASE_COLOR) / PHASE_FADE;
        g = 255;
      }

      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgb(255,${g | 0},0)`;
      ctx.fillRect(p.x | 0, p.y | 0, 1, 1);
    }

    ctx.globalAlpha = 1;
  }
}
