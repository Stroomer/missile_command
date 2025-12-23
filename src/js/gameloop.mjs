import { STEP } from "./constants.mjs";

let game;
let running     = false;
let requestId   = null;
let lastTime    = 0;
let accumulator = 0;

function loop(now) {
  if (!running) return;

  let frameTime = (now - lastTime) / 1000;
  lastTime = now;

  // Prevent spiral of death
  if (frameTime > 0.25) frameTime = 0.25;

  accumulator += frameTime;

  // Run fixed updates
  while (accumulator >= STEP) {
    game.update(STEP);
    accumulator -= STEP;
  }

  // Render once per frame
  game.draw();

  requestId = requestAnimationFrame(loop);
}


export function start(parent) {
  if (running) {
    console.warn('Cannot start loop, already running!');
    return;
  }

  console.log('loop.start');
  game        = parent;
  running     = true;
  accumulator = 0;
  lastTime    = performance.now();
  requestId   = requestAnimationFrame(loop);
}

export function stop() {
  if (!running) {
    console.warn("Cannot stop loop, it's not running yet!");
    return;
  }

  console.log('loop.stop');
  cancelAnimationFrame(requestId);

  running     = false;
  requestId   = null;
  game        = null;
  accumulator = 0;
  lastTime    = 0;
}
