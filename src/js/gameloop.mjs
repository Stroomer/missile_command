import { FIXED_DT } from './constants.mjs';

let game;
let running     = false;
let requestId   = null;
let last        = performance.now();  

function loop(now) {
  let dt = (now - last) / 1000;
  last = now;
  
  game.update(dt);
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
  requestId   = null;
  game        = null;
  running     = false;
}