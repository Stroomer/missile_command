import '/src/css/style.css';
import { randomInt } from '/src/js/helpers.mjs';
import { createBuffer } from '/src/js/buffer.mjs';
import { start } from '/src/js/gameloop.mjs';
import { width, height, black, grey, green, blue } from '/src/js/constants.mjs';
import { drawPixel } from '/src/js/drawing.mjs';
import Missile from './js/classes/Missile.mjs';
import { recoloredLandscape } from './js/blit.mjs';
import Background from './js/classes/Background.mjs';

// sprite image
const sprites = document.getElementById('sprites');

// buffers
const onscreen         = createBuffer('screen',     width, height); // main buffer       (onscreen)
const offscreen        = createBuffer('offscreen',  width, height); // main buffer       (offscreen)

const layer_background = createBuffer('background', width, height); // background buffer (offscreen)
const layer_smoke      = createBuffer('smoke',      width, height); // smoke buffer      (offscreen)
const layer_missiles   = createBuffer('missiles',   width, height); // missiles buffer   (offscreen)
const layer_entities   = createBuffer('entities',   width, height); // entities buffer   (offscreen)

// classes
const background = new Background(sprites);
const missiles   = [new Missile()];

background.draw(layer_background);  

//layer_background.drawImage(recoloredLandscape.canvas, 0, height/2, recoloredLandscape.width, recoloredLandscape.height);

function update() {
  for (let i = 0; i < missiles.length; i++) {
     missiles[i].update();
  }
}

function draw() {
  layer_missiles.clearRect(0, 0, width, height);                     // clear layer missiles
    
  for (let i = 0; i < missiles.length; i++) {
    missiles[i].draw(layer_smoke, layer_missiles);                   // draw missile + smoke
  }
  
  offscreen.drawImage(layer_background.canvas, 0, 0, width, height); // draw layer background --> offscreen
  offscreen.drawImage(layer_smoke.canvas,      0, 0, width, height); // draw layer smoke      --> offscreen
  offscreen.drawImage(layer_missiles.canvas, 0, 0, width, height); // draw layer missiles   --> offscreen
  
  onscreen.drawImage(offscreen.canvas, 0, 0, width, height);         // draw layer offscreen  --> onscreen
}

start();

export { update, draw };
 
  
// function init() {
//   const landscape = getSprite(sprites, 0, 0, 256, 23, grey, blue);

//   screen.imageSmoothingEnabled = false;
//   screen.drawImage(landscape, 0, height - landscape.height, landscape.width, landscape.height);
// }
