import { update, draw } from '../main.js';
import { FIXED_DT } from './constants.mjs';

let running     = false;
let requestId   = null;
let accumulator = 0;
let last        = 0;

function loop(now) {
  let dt = (now - last) / 1000;
  last = now;
  accumulator += dt;

  while (accumulator >= FIXED_DT ) {
    update();
    accumulator -= FIXED_DT;
  }

  draw();
  requestAnimationFrame(loop);
}

export function start() {
  if (running) {
    console.warning('Cannot start loop, already running!');
    return;
  }
  console.log('loop.start');
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
  running     = false;
}





// let previousTimeMs = 0;
// let accumulator = 0;
// let fixedTimestep = 1 / 60;
// let maxUpdates = 5;
// let running = false;
// let requestId = null;

// export function start() {
//   if (running) {
//     console.warning('Cannot start loop, already running!');
//     return;
//   }
//   console.log('loop.start');
//   requestId = requestAnimationFrame(loop);
//   running = true;
// }

// export function stop() {
//   if (!running) {
//     console.warning("Cannot stop loop, it's not running yet!");
//     return;
//   }
//   console.log('loop.stop');
//   cancelAnimationFrame(requestId);
//   requestId = null;
//   running = false;
//   previousTimeMs = 0;
//   accumulator = 0;
// }

// function loop(currentTimeMs) {
//   const deltaTimeSec = Math.min((currentTimeMs - previousTimeMs) / 1000, 0.25);

//   previousTimeMs = currentTimeMs;
//   accumulator += deltaTimeSec;

//   let updateCount = 0;
//   while (accumulator >= fixedTimestep && updateCount < maxUpdates) {
//     update();
//     accumulator -= fixedTimestep;
//     updateCount++;
//   }

//   draw();
//   requestId = requestAnimationFrame(loop);
// }
