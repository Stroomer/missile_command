import { WIDTH, HEIGHT, COLORS } from '../js/constants.mjs';

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomColor() {
  const n = randomInt(0, COLORS.length - 1);
  const color = COLORS[n];
  return color;
}

export function getUnitVector(x1, y1, x2, y2) {
  const dx  = x2 - x1;
  const dy  = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const vx  = len === 0 ? 0 : dx / len;
  const vy  = len === 0 ? 0 : dy / len;

  return { vx, vy };
}

export function snap(obj) {
  obj.x = obj.x | 0;  
  obj.y = obj.y | 0;
  return obj;
}

export function getLineBresenham(x0, y0, x1, y1) {
  const points = [];

  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  let sx = x0 < x1 ? 1 : -1;
  let sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    points.push({ x: x0, y: y0 });

    if (x0 === x1 && y0 === y1) break;

    const e2 = err * 2;
    if (e2 > -dy) { err -= dy; x0 += sx; }
    if (e2 <  dx) { err += dx; y0 += sy; }
  }

  return points;
}


export function withinBounds(x, y) {
  return x >= 0 && y >= 0 && x < WIDTH && y < HEIGHT ? true : false;
}

export function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t);
}

export function easeInQuad(t) {
  return t * t;
}

export function even(num) {
  return (num & 1) === 0
}

export function aabb(a, b) {
  return (
    Math.abs(a.x - b.x) < (a.halfW + b.halfW) &&
    Math.abs(a.y - b.y) < (a.halfH + b.halfH)
  );
}
