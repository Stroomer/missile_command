import { aabb, randomInt, randomPick } from '../helpers.mjs';
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
import SpatialGrid from './SpatialGrid.mjs';
import PerformanceMonitor from '../PerformanceMonitor.mjs';



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

  // Spawn 4 staggered explosions, one per quadrant of the entity box
  spawnExplosionBatch(entity) {
    const box   = entity.getBox();
    const cx    = box.x + (box.width  >> 1);
    const cy    = box.y + (box.height >> 1);
    const qx    = box.width  >> 2;
    const qy    = box.height >> 2;
    const twist = Math.max(4, qx);
    const sizes = [Explosion.SMALL, Explosion.MEDIUM];
    let delay   = 0.2;

    for (let i = 0; i < 4; i++) {
      const sx  = (i & 1) * 2 - 1;   // -1, 1, -1, 1
      const sy  = (i >> 1) * 2 - 1;  // -1, -1, 1, 1
      const exp = new Explosion({
        x: cx + sx * qx + randomInt(-twist, twist),
        y: cy + sy * qy + randomInt(-twist, twist),
        radius:       randomPick(sizes),
        delay,
        expandTime:   0.15,
        collapseTime: 0.25,
      });
      exp.secondary = true;
      this.explosions.push(exp);
      delay += randomInt(5, 10) / 100;
    }
  }

  // Combined garbage collection + update for a single entity list
  updateEntities(list, dt) {
    for (let i = list.length - 1; i >= 0; i--) {
      const entity = list[i];

      if (entity.garbage) {
        // Swap with last element and remove
        list[i] = list[list.length - 1];
        list.pop();
      } else {
        entity.update(dt);
      }
    }
  }

  // Batch draw for a single entity list
  drawEntities(list, ctx) {
    for (let i = 0; i < list.length; i++) {
      list[i].draw(ctx);
    }
  }

  update(dt) {
    const updateStart = this.perfMonitor.startMeasure();

    this.colorId = randomInt(0, COLORS.length-1);

    // Update singleton entities
    this.launcher.update(mouse);
    this.crosshair.update(mouse);
    this.enemy.update(dt);

    // Unified update + garbage collection for all entity arrays
    const entityLists = [
      this.missiles,
      this.aliens,
      this.aircrafts,
      this.explosions,
      this.targets
    ];

    for (let i = 0; i < entityLists.length; i++) {
      this.updateEntities(entityLists[i], dt);
    }

    // Measure collision detection time separately (logic only, no drawing)
    const collisionStart = this.perfMonitor.startMeasure();
    this.checkCollisions(null);
    this.perfMonitor.collisionTime = this.perfMonitor.endMeasure(collisionStart);

    // Record total update time and update FPS counter
    this.perfMonitor.updateTime = this.perfMonitor.endMeasure(updateStart);
    this.perfMonitor.update();
  }

  draw() {
    const drawStart = this.perfMonitor.startMeasure();

    this.clearScreen();

    this.offscreen.drawImage(this.buffer.background.canvas, 0, 0, WIDTH, HEIGHT);

    // Unified draw for all entity arrays (in z-order)
    this.drawEntities(this.missiles, this.offscreen);
    this.drawEntities(this.aliens, this.offscreen);
    this.drawEntities(this.aircrafts, this.offscreen);
    this.drawEntities(this.explosions, this.offscreen);
    this.drawEntities(this.targets, this.offscreen);

    this.crosshair.draw(this.offscreen);

    // Draw debug bounding boxes on top of all entities
    this.checkCollisions(this.offscreen);

    this.onscreen.drawImage(this.offscreen.canvas, 0, 0, WIDTH, HEIGHT);

    // Record draw time
    this.perfMonitor.drawTime = this.perfMonitor.endMeasure(drawStart);
  }
  
  clearScreen() {
    this.offscreen.fillStyle = BLACK;
    this.offscreen.fillRect(0, 0, WIDTH, HEIGHT);
  }

  checkCollisions(ctx) {
    // On the update pass (ctx=null): rebuild grid and apply hit logic
    // On the draw pass (ctx set): redraw grid state and draw debug boxes
    if (!ctx) this.spatialGrid.clear();

    // Insert all potential collision targets into the spatial grid
    const aliens = this.aliens;
    const aircrafts = this.aircrafts;

    if (!ctx) {
      for (let i = 0; i < aliens.length; i++)    this.spatialGrid.insert(aliens[i]);
      for (let i = 0; i < aircrafts.length; i++) this.spatialGrid.insert(aircrafts[i]);
    }

    // Check each missile against nearby entities
    const missiles = this.missiles;

    for (let i = 0; i < missiles.length; i++) {
      const missile = missiles[i];
      const missileBox = missile.getBox();
      const nearbyEntities = this.spatialGrid.query(missile);

      for (let j = 0; j < nearbyEntities.length; j++) {
        const entity = nearbyEntities[j];
        const entityBox = entity.getBox();

        if (aabb(missileBox, entityBox)) {
          if (!ctx) {
            entity.hit();
            missile.hit();
          }
          else
          {
            drawBoundingBox(ctx, entityBox);
            drawBoundingBox(ctx, missileBox);
          }
        }
      }
    }

    // Check each active explosion against nearby entities
    const explosions = this.explosions;

    for (let i = 0; i < explosions.length; i++) {
      const explosion = explosions[i];

      // Skip sleeping, garbage, or secondary (batch) explosions
      if (explosion.secondary || explosion.phase === Explosion.STATE.SLEEP || explosion.garbage) continue;

      const explosionBox = explosion.getBox();
      const nearbyEntities = this.spatialGrid.query(explosion);

      for (let j = 0; j < nearbyEntities.length; j++) {
        const entity = nearbyEntities[j];
        const entityBox = entity.getBox();

        if (aabb(explosionBox, entityBox)) {
          if (!ctx) {
            entity.hit();
            //this.spawnExplosionBatch(entity);
          }
          else
          {
            drawBoundingBox(ctx, entityBox);
            drawBoundingBox(ctx, explosionBox);
          }
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

    // Initialize performance monitor (press 'P' to toggle)
    this.perfMonitor = new PerformanceMonitor();

    // Initialize spatial grid for collision detection
    // Cell size of 32 works well for this game's entity sizes
    this.spatialGrid = new SpatialGrid(32);

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
    
    this.background.draw(this.buffer.background);

    this.audio = new Audio();
  }
}