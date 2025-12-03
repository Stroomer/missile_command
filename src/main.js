import '/src/css/style.css';

import { createBuffer } from '/src/js/buffer.mjs';
import { start } from '/src/js/gameloop.mjs';
import { width, height } from '/src/js/constants.mjs';

import Missile from './js/classes/Missile.mjs';
import Background from './js/classes/Background.mjs';
import Alien from './js/classes/Alien.mjs';
import City from './js/classes/City.mjs';

// sprite image
const sprites = document.getElementById('sprites');

// buffers
const onscreen         = createBuffer('screen',     width, height); // main buffer       (onscreen)
const offscreen        = createBuffer('offscreen',  width, height); // main buffer       (offscreen)

const layer_background = createBuffer('background', width, height); // background buffer (offscreen)
const layer_cities     = createBuffer('cities',     width, height); // cities buffer     (offscreen)
const layer_smoke      = createBuffer('smoke',      width, height); // smoke buffer      (offscreen)
const layer_missiles   = createBuffer('missiles',   width, height); // missiles buffer   (offscreen)
const layer_entities   = createBuffer('entities',   width, height); // entities buffer   (offscreen)

// classes
const background = new Background(sprites);
const alien = new Alien(sprites);

const cities = [];

for (let i = 0; i < 6; i++) cities[i] = new City(48+(i*30), 216, sprites, layer_cities);
                
const missiles = [new Missile()];

background.draw(layer_background);
alien.draw(layer_entities);

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
  offscreen.drawImage(layer_cities.canvas,     0, 0, width, height); // draw layer cities     --> offscreen
  offscreen.drawImage(layer_smoke.canvas,      0, 0, width, height); // draw layer smoke      --> offscreen
  offscreen.drawImage(layer_missiles.canvas,   0, 0, width, height); // draw layer missiles   --> offscreen
  offscreen.drawImage(layer_entities.canvas,   0, 0, width, height); // draw layer missiles   --> offscreen
  
  onscreen.drawImage(offscreen.canvas, 0, 0, width, height);         // draw layer offscreen  --> onscreen
}

start();

export { update, draw };