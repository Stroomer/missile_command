export function drawPixel(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x | 0, y | 0, 1, 1);
}

export function drawRect(ctx, x, y, w, h, color) {
    const halfW = w / 2; 
    const halfH = h / 2; 

    ctx.fillStyle = color;
    ctx.fillRect((x - halfW) | 0, (y - halfH) | 0, w | 0, h | 0);
}

export function drawCircle(ctx, cx, cy, r, color) {
    cx |= 0;
    cy |= 0;
    r  |= 0;

    ctx.fillStyle = color;

    let x = r;
    let y = 0;
    let err = 1 - x;

    while (x >= y) {
        // 8-way symmetry – filled circle
        drawPixel(ctx, cx + x, cy + y, color);
        drawPixel(ctx, cx + y, cy + x, color);
        drawPixel(ctx, cx - y, cy + x, color);
        drawPixel(ctx, cx - x, cy + y, color);
        drawPixel(ctx, cx - x, cy - y, color);
        drawPixel(ctx, cx - y, cy - x, color);
        drawPixel(ctx, cx + y, cy - x, color);
        drawPixel(ctx, cx + x, cy - y, color);

        y++;
        if (err < 0) {
            err += 2 * y + 1;
        } else {
            x--;
            err += 2 * (y - x + 1);
        }
    }
}

export function drawCircleFill(ctx, cx, cy, r, color) {
  cx |= 0;
  cy |= 0;
  r |= 0;

  ctx.fillStyle = color;

  let x = r;
  let y = 0;
  let err = 1 - x;

  while (x >= y) { // Draw horizontal spans for each Y
    ctx.fillRect(cx - x, cy + y, x * 2 + 1, 1); // Upper half
    ctx.fillRect(cx - y, cy + x, y * 2 + 1, 1); // Upper half
    ctx.fillRect(cx - x, cy - y, x * 2 + 1, 1); // Lower half
    ctx.fillRect(cx - y, cy - x, y * 2 + 1, 1); // Lower half
      
    y++;
    if (err < 0) {
      err += 2 * y + 1;
    } else {
      x--;
      err += 2 * (y - x + 1);
    }
  }
}

export function drawSprite(ctx, src, sx, sy, dx, dy, w, h) {
    dx |= 0;
    dy |= 0;
    sx |= 0;
    sy |= 0;
    w  |= 0;
    h  |= 0;

    ctx.imageSmoothingEnabled = false; // safety
    ctx.drawImage(src, sx, sy, w, h, dx, dy, w, h);
}