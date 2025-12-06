import { FIXED_DT } from './constants.mjs';

let game;
let running     = false;
let requestId   = null;
let accumulator = 0;
let last        = 0;

function loop(now) {
  let dt = (now - last) / 1000;
  last = now;
  accumulator += dt;

  while (accumulator >= FIXED_DT ) {
    game.update();
    accumulator -= FIXED_DT;
  }

  game.draw();
  requestAnimationFrame(loop);
}

export function start(parent) {
  if (running) {
    console.warning('Cannot start loop, already running!');
    return;
  }
  console.log('loop.start');
  game      = parent;
  last      = performance.now();
  requestId = requestAnimationFrame(loop);
  running   = true;
}

export function stop() {
  if (!running) {
    console.warning("Cannot stop loop, it's not running yet!");
    return;
  }
  console.log('loop.stop');
  cancelAnimationFrame(requestId);
  last        = 0;
  accumulator = 0;
  requestId   = null;
  game        = null;
  running     = false;
}