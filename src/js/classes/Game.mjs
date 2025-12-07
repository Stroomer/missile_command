import { createBuffer } from './../buffer.mjs';
import { start } from './../gameloop.mjs';
import { WIDTH, HEIGHT, colors, black } from '../constants.mjs';

import FlashingDot from './FlashingDot.mjs';
import Missile     from './Missile.mjs';
import Background  from './Background.mjs';
import Alien       from './Alien.mjs';
import City        from './City.mjs';
import { randomInt } from '../helpers.mjs';

const sprites = document.getElementById('sprites');


export default class Game {
  constructor() {
    this.createBuffers(); 
    this.createObjects();
          
    start(this);  
  }

  update() {
      this.dot.update();
    
      const missileCount = this.missiles.length;
      for (let i = 0; i < missileCount; i++) {
        this.missiles[i].update();
      }
    
      const alienCount = this.aliens.length;
      for (let i = 0; i < alienCount; i++) {
        this.aliens[i].update();
      }      
  }

  draw() {      
    this.bufferMissiles.clearRect(0, 0, WIDTH, HEIGHT); // clear layer missiles
    this.bufferEntities.clearRect(0, 0, WIDTH, HEIGHT); // clear layer entities
    this.bufferOffscreen.clearRect(0, 0, WIDTH, HEIGHT); // clear layer offscreen

    const missileCount = this.missiles.length;
    for (let i = 0; i < missileCount; i++) {
      this.missiles[i].draw(this.bufferSmoke, this.bufferMissiles); // draw missile + smoke
    }

    const alienCount = this.aliens.length;
    for (let i = 0; i < alienCount; i++) {
      this.aliens[i].draw(this.bufferEntities); // draw alien
    }

    this.bufferOffscreen.fillStyle = black;
    this.bufferOffscreen.fillRect(0, 0, WIDTH, HEIGHT);

    this.bufferOffscreen.drawImage(this.bufferBackground.canvas, 0, 0, WIDTH, HEIGHT); // draw layer background --> offscreen
    this.bufferOffscreen.drawImage(this.bufferCities.canvas,     0, 0, WIDTH, HEIGHT); // draw layer cities     --> offscreen
    this.bufferOffscreen.drawImage(this.bufferSmoke.canvas,      0, 0, WIDTH, HEIGHT); // draw layer smoke      --> offscreen
    this.bufferOffscreen.drawImage(this.bufferMissiles.canvas,   0, 0, WIDTH, HEIGHT); // draw layer missiles   --> offscreen
    this.bufferOffscreen.drawImage(this.bufferEntities.canvas,   0, 0, WIDTH, HEIGHT); // draw layer missiles   --> offscreen

    this.bufferOnscreen.drawImage(this.bufferOffscreen.canvas,   0, 0, WIDTH, HEIGHT); // draw layer offscreen  --> onscreen
  }
    
  createBuffers() {
    this.bufferOnscreen   = createBuffer('onscreen'); 
    this.bufferOffscreen  = createBuffer('offscreen'); 
    this.bufferBackground = createBuffer('background'); 
    this.bufferCities     = createBuffer('cities'); 
    this.bufferSmoke      = createBuffer('smoke'); 
    this.bufferMissiles   = createBuffer('missiles'); 
    this.bufferEntities   = createBuffer('entities'); 
  }

  createObjects() {
    this.background = new Background(128, 220);
    
    this.dot = new FlashingDot(colors);
    
    this.cities = [];
    this.cities.push(new City(48,  215));
    this.cities.push(new City(78,  216));
    this.cities.push(new City(108, 216));
    this.cities.push(new City(138, 216));
    this.cities.push(new City(168, 216)); //this.bufferCities
    this.cities.push(new City(218, 216));  
      
    this.missiles = [];
    this.missiles.push(new Missile(10, 10));
    
    this.aliens = [];
    this.aliens.push(new Alien(randomInt(50, WIDTH-50), 140, this.dot));

    this.background.draw(this.bufferBackground);
  }
}
