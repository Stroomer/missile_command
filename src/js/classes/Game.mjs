import { aabb, randomInt }    from '../helpers.mjs';
import { mouse }        from './../mouse.mjs';
import { createBuffer } from './../buffer.mjs';
import { start }        from './../gameloop.mjs';
import { WIDTH, HEIGHT, COLORS, BLACK, BLUE } from '../constants.mjs';

import Crosshair   from './Crosshair.mjs';
import Audio       from './Audio.mjs';
import Background  from './Background.mjs';
import Alien       from './Alien.mjs';
import Aircraft    from './Aircraft.mjs';
import City        from './City.mjs';
import Launcher    from './Launcher.mjs';
import Enemy from './Enemy.mjs';
import { drawBoundingBox } from '../debug.mjs';
import Explosion from './Explosion.mjs';



const sprites = document.getElementById('sprites');


export default class Game {
  constructor() {
    console.log("Create Game-object");
  }

  init() {
    console.log("Init Game-object");

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
    this.collectGarbage(this.missiles);
    this.collectGarbage(this.aliens);
    this.collectGarbage(this.aircrafts);
    this.collectGarbage(this.explosions);
    this.collectGarbage(this.targets);

    this.clearScreen();

    this.colorId = randomInt(0, COLORS.length-1);
  
    this.launcher.update(mouse);
    this.crosshair.update(mouse);
  
    this.enemy.update(dt);  
  
    for (let i = 0; i < this.missiles.length; i++)   this.missiles[i].update(dt);  
    for (let i = 0; i < this.aliens.length; i++)     this.aliens[i].update(dt);
    for (let i = 0; i < this.aircrafts.length; i++)  this.aircrafts[i].update(dt);
    for (let i = 0; i < this.explosions.length; i++) this.explosions[i].update(dt);    
    for (let i = 0; i < this.targets.length; i++)    this.targets[i].update(dt);    
  }

  draw() {        
    this.offscreen.drawImage(this.buffer.background.canvas, 0, 0, WIDTH, HEIGHT); // draw layer background --> offscreen    

    for (let i = 0; i < this.missiles.length; i++)   this.missiles[i].draw(this.offscreen);   // draw missiles
    for (let i = 0; i < this.aliens.length; i++)     this.aliens[i].draw(this.offscreen);     // draw aliens        
    for (let i = 0; i < this.aircrafts.length; i++)  this.aircrafts[i].draw(this.offscreen);  // draw aliens
    for (let i = 0; i < this.explosions.length; i++) this.explosions[i].draw(this.offscreen); // draw explosions
    for (let i = 0; i < this.targets.length; i++)    this.targets[i].draw(this.offscreen);    // draw explosions
    
    this.checkCollisions();

    this.crosshair.draw(this.offscreen); // draw layer crosshair  --> offscreen
    
    this.onscreen.drawImage(this.offscreen.canvas, 0, 0, WIDTH, HEIGHT); // draw layer offscreen  --> onscreen
  }
  
  clearScreen() {
    this.offscreen.fillStyle = BLACK;
    this.offscreen.fillRect(0, 0, WIDTH, HEIGHT);
  }

  checkCollisions() {
    const missilesCount  = this.missiles.length;
    const aliensCount    = this.aliens.length;
    const aircraftsCount = this.aircrafts.length;

    for (let i = 0; i < missilesCount; i++) {
      const missileBox = this.missiles[i].getBox();
      
      for (let a = 0; a < aliensCount; a++) {
        const alienBox = this.aliens[a].getBox();
         if (aabb(missileBox, alienBox)) {
          drawBoundingBox(this.buffer.offscreen, alienBox);
          drawBoundingBox(this.buffer.offscreen, missileBox);
          this.aliens[a].hit();
        }
      }
      
      for (let c = 0; c < aircraftsCount; c++) {
        const aircraftBox = this.aircrafts[c].getBox();
        if (aabb(missileBox, aircraftBox)) {
          drawBoundingBox(this.buffer.offscreen, aircraftBox);
          drawBoundingBox(this.buffer.offscreen, missileBox);

          this.aircrafts[c].hit();
        }

      }  
    }
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

    this.offscreen = this.buffer.offscreen;
    this.onscreen  = this.buffer.onscreen;  
  }

  createObjects() {
    this.colorId = randomInt(0, COLORS.length - 1);

    this.crosshair = new Crosshair({ color:BLUE });
    this.background = new Background({ x: 128, y: 220 });
    this.launcher = new Launcher(this);
    this.enemy = new Enemy(this);
    
    this.cities = [];
    this.cities.push(new City({x:48,  y:215}));
    this.cities.push(new City({x:78,  y:216}));
    this.cities.push(new City({x:108, y:216}));
    this.cities.push(new City({x:138, y:216}));
    this.cities.push(new City({x:168, y:216}));
    this.cities.push(new City({x:218, y:216}));
      
    this.missiles = [];
    this.targets  = [];
    
    this.aliens = [];
    this.aliens.push( new Alien );
    
    this.aircrafts  = [];
    this.aircrafts.push( new Aircraft );

    this.explosions = [];
    this.explosions.push( new Explosion );

    this.background.draw(this.buffer.background);

    this.audio = new Audio();
  }
}