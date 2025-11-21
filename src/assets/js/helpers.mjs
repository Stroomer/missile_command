export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const DEG2RAD = Math.PI / 180;

export function randomVecFromDeg(deg) {
  const rad = deg * DEG2RAD;
  const x = Math.cos(rad);
  const y = Math.sin(rad);
  return { x, y };
}
