import '../css/style.css';
import { randomInt, randomVecFromDeg } from './helpers.mjs';

const width    = 256;
const height   = 231;

// const black    = 0x000000ff;  //'#000000';
// const white    = 0xffffffff;  //'#ffffff';
// const red      = 0xff0000ff;  //'#ff0000';
// const green    = 0x00ff00ff;  //'#00ff00';
// const blue     = 0x0000ffff;  //'#0000ff';
// const yellow   = 0xffff00ff;  //'#ffff00';
// const cyan     = 0x00ffffff;  //'#00ffff';

const black    = '#000000';
const white    = '#ffffff';
const red      = '#ff0000';
const green    = '#00ff00';
const blue     = '#0000ff';
const yellow   = '#ffff00';
const cyan     = '#00ffff';

const flashing = [red, white, yellow];

const ctx      = createBuffer('screen',   width, height, false, black, true,  false);  // onscreen context (visible)
const smoke    = createBuffer('smoke',    width, height, true,  null,  false, false);  // effects context (not visible)
const entities = createBuffer('entities', width, height, true,  null,  false, false);  // effects context (not visible)

const missileSpeed = 20;
const missiles = [
    createMissile(),
    createMissile(),
    createMissile(),  
];

// gameloop
let previousTimeMs = 0;
let accumulator    = 0;
let fixedTimestep  = 1 / 60;
let maxUpdates     = 5;
let running        = false;
let requestId      = null;


function createBuffer(id, width, height, alpha, bgcolor, visible, showAttribs) {
    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d', { alpha, willReadFrequently: true, desynchronized: false });

    canvas.id = id;
    canvas.width = width;
    canvas.height = height;
    canvas.style.display = visible ? 'block' : 'none';
    if(bgcolor) canvas.style.backgroundColor = bgcolor;

    ctx.imageSmoothingEnabled = false;
    
    if (visible) document.body.appendChild(canvas);

    if (showAttribs) {
        if (ctx.getContextAttributes) console.log(JSON.stringify(ctx.getContextAttributes()));
        else                          console.log('getContextAttributes() not supported');    
    }
    
    return ctx;
}

const goodAngles = [70, 84];


function createMissile() {
    const x       = (width / 2);
    const y       = (height / 2);
    const colorId = randomInt(0, colors.length - 1); 
    const vector  = randomVecFromDeg(54);
    const speed   = missileSpeed;
    const smoke   = 'todo';
    
    return { x, y, colorId, vector, speed, smoke };
}

function drawMissiles(buffer) {
    for (let i = 0; i < missiles.length; i++) {
        const m = missiles[i];
        const colorId = m.colorId + 1;

        m.colorId = colorId === colors.length ? 0 : colorId;  
        buffer.fillStyle = red;  //colors[colorId];
        buffer.fillRect(m.x | 0, m.y | 0, 1, 1);
    }
    ctx.drawImage(buffer.canvas, 0, 0, width, height);
}

function update(deltaTime) {
    for (let i = 0; i < missiles.length; i++) {
        const m = missiles[i];
        m.x += m.vector.x * m.speed * deltaTime;
        m.y += m.vector.y * m.speed * deltaTime;
    }
}

function draw(ctx) {
    drawMissiles(entities);
}

function start() {
  if (running) {
    console.warning('Cannot start loop, already running!');
    return;
  }
  console.log('loop.start');
  requestId = requestAnimationFrame(loop);
  running = true;  
}

function stop() {
  if (!running) {
    console.warning("Cannot stop loop, it's not running yet!");
    return;    
  }
  console.log('loop.stop');
  cancelAnimationFrame(requestId);
  requestId      = null;
  running        = false;
  previousTimeMs = 0;
  accumulator    = 0;
}

function loop(currentTimeMs) {
  const deltaTimeSec = Math.min((currentTimeMs - previousTimeMs) / 1000, 0.25);

  previousTimeMs = currentTimeMs;
  accumulator += deltaTimeSec;

  let updateCount = 0;
  while (accumulator >= fixedTimestep && updateCount < maxUpdates) {
    update(fixedTimestep);
    accumulator -= fixedTimestep;
    updateCount++;
  }

  draw(ctx);
  requestId = requestAnimationFrame(loop);
}

start();