import { randomInt }    from '../helpers.mjs';
import { mouse }        from './../mouse.mjs';
import { createBuffer } from './../buffer.mjs';
import { start }        from './../gameloop.mjs';
import { WIDTH, HEIGHT, COLORS, BLACK, BLUE } from '../constants.mjs';

import Crosshair   from './Crosshair.mjs';
import Audio       from './Audio.mjs';
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

  collectGarbage(list) {
    for (let i = 0; i < list.length; ) {
      if (list[i].garbage) {
        list[i] = list[list.length - 1];
        list.pop();
      } else {
        i++;
      }
    }
  }

  update(dt) {
      //this.collectGarbage(this.smoke);
      //this.collectGarbage(this.targets);
      //this.collectGarbage(this.explosions);
    
      this.colorId = randomInt(0, COLORS.length-1);
    
      this.launcher.update(mouse);
      this.crosshair.update(mouse);

      for (let i = 0; i < this.missiles.length; i++)    this.missiles[i].update(dt);  
      for (let i = 0; i < this.aliens.length; i++)      this.aliens[i].update(dt);
      // for (let i = 0; i < this.targets.length; i++)     this.targets[i].update(dt);
      // for (let i = 0; i < this.smoke.length; i++)       this.smoke[i].update(dt);
      // for (let i = 0; i < this.explosions.length; i++)  this.explosions[i].update(dt);
  }

  draw() {    
    const { offscreen, onscreen } = this.buffer;  

    offscreen.clearRect(0, 0, WIDTH, HEIGHT); // clear layer offscreen (dynamic)
        
    offscreen.fillStyle = BLACK;
    offscreen.fillRect(0, 0, WIDTH, HEIGHT);

    for (let i = 0; i < this.missiles.length; i++)    this.missiles[i].draw(offscreen);   // draw missiles
    for (let i = 0; i < this.aliens.length; i++)      this.aliens[i].draw(offscreen);     // draw aliens        
    // for (let i = 0; i < this.targets.length; i++)     this.targets[i].draw(offscreen);    // draw missiles
    // for (let i = 0; i < this.smoke.length; i++)       this.smoke[i].draw(offscreen);      // draw missiles
    // for (let i = 0; i < this.explosions.length; i++)  this.explosions[i].draw(offscreen); // draw missiles
    
    offscreen.drawImage(this.buffer.background.canvas, 0, 0, WIDTH, HEIGHT); // draw layer background --> offscreen    
    offscreen.drawImage(this.buffer.targets.canvas,    0, 0, WIDTH, HEIGHT); // draw layer smoke      --> offscreen
    offscreen.drawImage(this.buffer.smoke.canvas,      0, 0, WIDTH, HEIGHT); // draw layer smoke      --> offscreen
    offscreen.drawImage(this.buffer.explosions.canvas, 0, 0, WIDTH, HEIGHT); // draw layer explosions --> offscreen    
    
    this.crosshair.draw(offscreen);                                          // draw layer crosshair  --> offscreen
    
    onscreen.drawImage(offscreen.canvas, 0, 0, WIDTH, HEIGHT);   // draw layer offscreen  --> onscreen
  }
    
  createBuffers() {
    this.buffer = {};
    this.buffer.onscreen   = createBuffer('onscreen');
    this.buffer.offscreen  = createBuffer('offscreen');
    this.buffer.background = createBuffer('background');
    this.buffer.missiles   = createBuffer('missiles');
    this.buffer.targets    = createBuffer('targets');
    this.buffer.smoke      = createBuffer('smoke');
    this.buffer.explosions = createBuffer('explosions');
  }

  createObjects() {
    this.colorId = randomInt(0, COLORS.length-1);

    this.crosshair  = new Crosshair(BLUE);
    this.background = new Background(128, 220);
    this.launcher   = new Launcher(this, 20, 120);
    
    this.cities = [];
    this.cities.push(new City(48,  215));
    this.cities.push(new City(78,  216));
    this.cities.push(new City(108, 216));
    this.cities.push(new City(138, 216));
    this.cities.push(new City(168, 216));
    this.cities.push(new City(218, 216));  
      
    this.missiles   = [];
    // this.smoke      = [];
    // this.targets    = [];
    // this.explosions = [];
    this.aliens     = [];
    this.aliens.push(new Alien(this, randomInt(50, WIDTH-50), 100));

    this.background.draw(this.buffer.background);

    this.audio = new Audio();
  }


}
