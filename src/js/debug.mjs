import { YELLOW } from './constants.mjs';

export function drawBoundingBox(ctx, obj) {
  const { x, y, halfW, halfH, width, height } = obj;
  ctx.save();
  ctx.fillStyle = YELLOW;
  ctx.fillRect(x - halfW, y - halfH, width, height);
  ctx.restore();
}
