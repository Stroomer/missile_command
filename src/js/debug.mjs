import { DEBUG, YELLOW } from './constants.mjs';

export function drawBoundingBox(ctx, obj) {
  if (!DEBUG) return;

  //console.log(obj);

  const x = obj.x;
  const y = obj.y;
  const width = obj.width;
  const height = obj.height;

  //console.log(`color [${x}, ${y}, ${width}, ${height}] in ${YELLOW}`);

  ctx.save();
  ctx.fillStyle = YELLOW;
  ctx.fillRect(x, y, width, height);
  ctx.restore();
}
