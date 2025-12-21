import { randomInt }    from '../helpers.mjs';
import { mouse }        from './../mouse.mjs';
import { createBuffer } from './../buffer.mjs';
import { start }        from './../gameloop.mjs';
import { WIDTH, HEIGHT, colors, black, blue } from '../constants.mjs';

import Crosshair from './Crosshair.mjs';
import Audio       from './Audio.mjs';

import FlashingDot from './FlashingDot.mjs';
import Background  from './Background.mjs';
import Alien       from './Alien.mjs';
import City        from './City.mjs';
import Launcher    from './Launcher.mjs';


const sprites = document.getElementById('sprites');

export default class Game {
  constructor() {
    this.createBuffers(); 
    this.createObjects();
          
    start(this);  
  }

  collectGarbage() {
    for (let i = 0; i< this.missiles.length; i++) {
      if (this.missiles[i].garbage && this.targets[i].garbage) {
        this.missiles.splice(i, 1);
        this.targets.splice(i, 1);
        i--;
      }
    }
  }

  update(dt) {
      this.collectGarbage();
    
      this.launcher.update(mouse);
      this.crosshair.update(mouse);
      this.dot.update();

      for (let i = 0; i < this.missiles.length; i++) this.missiles[i].update(dt);  
      for (let i = 0; i < this.targets.length; i++)  this.targets[i].update(dt);
      for (let i = 0; i < this.aliens.length; i++)   this.aliens[i].update(dt);
  }

  draw() {    
    const { offscreen, onscreen } = this.buffer;  

    offscreen.clearRect(0, 0, WIDTH, HEIGHT); // clear layer offscreen (dynamic)
        
    offscreen.fillStyle = black;
    offscreen.fillRect(0, 0, WIDTH, HEIGHT);

    for (let i = 0; i < this.missiles.length; i++) this.missiles[i].draw(offscreen); // draw missiles
    for (let i = 0; i < this.targets.length; i++)  this.targets[i].draw(offscreen); // draw targets

    for (let i = 0; i < this.aliens.length; i++)   this.aliens[i].draw(offscreen); // draw aliens        
    

    offscreen.drawImage(this.buffer.background.canvas, 0, 0, WIDTH, HEIGHT); // draw layer background --> offscreen    
    offscreen.drawImage(this.buffer.smoke.canvas,      0, 0, WIDTH, HEIGHT); // draw layer smoke      --> offscreen
    
    //offscreen.drawImage(this.buffer.missiles.canvas,   0, 0, WIDTH, HEIGHT); // draw layer missiles   --> offscreen
    //offscreen.drawImage(this.buffer.entities.canvas,   0, 0, WIDTH, HEIGHT); // draw layer entities   --> offscreen    
    
    this.crosshair.draw(offscreen);                                          // draw layer crosshair  --> offscreen
    
    onscreen.drawImage(offscreen.canvas, 0, 0, WIDTH, HEIGHT);   // draw layer offscreen  --> onscreen
  }
    
  createBuffers() {
    this.buffer = {};
    this.buffer.onscreen   = createBuffer('onscreen');
    this.buffer.offscreen  = createBuffer('offscreen');
    this.buffer.background = createBuffer('background');
    this.buffer.missiles   = createBuffer('missiles');
    this.buffer.smoke      = createBuffer('smoke');
    this.buffer.entities   = createBuffer('entities');    
  }

  createObjects() {
    this.dot        = new FlashingDot(colors);
    this.crosshair  = new Crosshair(blue);
    this.background = new Background(128, 220);
    this.launcher   = new Launcher(20, 120, this);
    
    this.cities = [];
    this.cities.push(new City(48,  215));
    this.cities.push(new City(78,  216));
    this.cities.push(new City(108, 216));
    this.cities.push(new City(138, 216));
    this.cities.push(new City(168, 216));
    this.cities.push(new City(218, 216));  
      
    this.missiles = [];
    this.smoke    = [];
    this.targets  = [];
    
    this.aliens = [];
    this.aliens.push(new Alien(randomInt(50, WIDTH-50), 140, this.dot));

    this.background.draw(this.buffer.background);

    this.audio = new Audio();
  }


}
