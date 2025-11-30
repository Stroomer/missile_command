import { DEG } from '../js/constants.mjs';

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomVec(min, max) {

}

export function unitVector(degrees) {
  const a = degrees * DEG;
  const vx = Math.cos(a);
  const vy = Math.sin(a);

  return { vx, vy };
}

export function toUnitVector(x1, y1, x2, y2) {
  const dx  = x2 - x1;
  const dy  = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const vx  = len === 0 ? 0 : dx / len;
  const vy  = len === 0 ? 0 : dy / len;

  return { vx, vy };
}
