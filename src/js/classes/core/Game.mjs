import { randomInt, randomPick } from '../../functions.mjs';
import Mouse from '../input/Mouse.mjs';
import Buffer from '../core/Buffer.mjs';
import { start } from '../../gameloop.mjs';
import { WIDTH, HEIGHT, COLORS, BLACK, BLUE, HALF_W, HALF_H, BLACKISH, RED, YELLOW } from '../../constants.mjs';

import Collision from '../core/Collision.mjs';
import Crosshair from '../entities/Crosshair.mjs';
import Background from '../entities/Background.mjs';
import Launcher from './MissionControl.mjs';
import Enemy from '../Enemy.mjs';
import { drawBoundingBox } from '../../debug.mjs';
import Explosion from '../entities/Explosion.mjs';
import SpatialGrid from '../core/SpatialGrid.mjs';
import PerformanceMonitor from '../helper/PerformanceMonitor.mjs';
import Factory from '../core/Factory.mjs';
import Audio from './Audio.mjs';
import Text from '../text/Text.mjs';
import MissionControl from './MissionControl.mjs';

const sprites = document.getElementById('sprites');

export default class Game {
  constructor() {
    console.log('Create Game-object');
  }

  init() {
    console.log('Init Game-object');

    this.createBuffers();
    this.createObjects();

    start(this);
  }

  // Spawn 4 staggered explosions, one per quadrant of the entity box
  spawnExplosionBatch(entity) {
    const box = entity.getBox();
    const cx = box.x + (box.width >> 1);
    const cy = box.y + (box.height >> 1);
    const qx = box.width >> 2;
    const qy = box.height >> 2;
    const twist = Math.max(4, qx);
    const sizes = [Explosion.SMALL, Explosion.MEDIUM];

    let delay = 0.2;

    for (let i = 0; i < 4; i++) {
      const sx = (i & 1) * 2 - 1;
      const sy = (i >> 1) * 2 - 1;
      const exp = this.factory.createExplosion({
        x: cx + sx * qx + randomInt(-twist, twist),
        y: cy + sy * qy + randomInt(-twist, twist),
        radius: randomPick(sizes),
        delay,
        expandTime: 0.15,
        collapseTime: 0.25,
      });
      exp.secondary = true;
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

    this.colorId = randomInt(0, COLORS.length - 1);

    // Update singleton entities
    this.missioncontrol.update();
    this.crosshair.update();
    this.enemy.update(dt);

    // Unified update + garbage collection for all entity arrays
    const entityLists = [this.particles, this.texts, this.cities, this.missiles, this.aliens, this.aircrafts, this.targets, this.explosions, this.depots];

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
    this.drawEntities(this.texts, this.offscreen);
    this.drawEntities(this.cities, this.offscreen);
    this.drawEntities(this.missiles, this.offscreen);
    this.drawEntities(this.aliens, this.offscreen);
    this.drawEntities(this.aircrafts, this.offscreen);
    this.drawEntities(this.targets, this.offscreen);
    this.drawEntities(this.particles, this.offscreen);
    this.drawEntities(this.explosions, this.offscreen);
    this.drawEntities(this.depots, this.offscreen);

    //this.drawEntities(this.ammo, this.offscreen);

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
      for (let i = 0; i < aliens.length; i++) this.spatialGrid.insert(aliens[i]);
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

        if (Collision.AABB(missileBox, entityBox)) {
          if (!ctx) {
            entity.hit();
            missile.hit();
          } else {
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

        if (Collision.AABB(explosionBox, entityBox)) {
          if (!ctx) {
            entity.hit();
            //this.spawnExplosionBatch(entity);
          } else {
            drawBoundingBox(ctx, entityBox);
            drawBoundingBox(ctx, explosionBox);
          }
        }
      }
    }
  }

  createBuffers() {
    this.buffer = {};
    this.buffer.onscreen = Buffer.create('onscreen', WIDTH, HEIGHT, YELLOW);

    this.buffer.offscreen = Buffer.create('offscreen', WIDTH, HEIGHT, YELLOW);
    this.buffer.background = Buffer.create('background');

    //this.buffer.ui = Buffer.create('ui');

    this.offscreen = this.buffer.offscreen;
    this.onscreen = this.buffer.onscreen;
  }

  createObjects() {
    this.colorId = randomInt(0, COLORS.length - 1);

    // Initialize performance monitor (press 'P' to toggle)
    this.perfMonitor = new PerformanceMonitor();

    // Initialize spatial grid for collision detection
    // Cell size of 32 works well for this game's entity sizes
    this.spatialGrid = new SpatialGrid(32);

    // Initialize entity factory for centralized entity creation
    this.factory = new Factory(this);

    // Initialize audio factory for centralized sound creation
    this.audio = new Audio(this);

    // Initialize entity arrays (factory will push to these)
    this.cities = [];
    this.missiles = [];
    this.targets = [];
    this.aliens = [];
    this.aircrafts = [];
    this.explosions = [];
    this.particles  = [];
    this.depots = [];
    this.texts = [];

    const parent = this;

    this.crosshair = new Crosshair({ parent, color: BLUE });
    this.background = new Background({ parent, x: 128, y: 217 });
    this.missioncontrol = new MissionControl(parent);
    this.enemy = new Enemy(parent);

    // Create cities using factory
    this.factory.createCity({ parent, x: 39, y: 206 });
    this.factory.createCity({ parent, x: 66, y: 207 });
    this.factory.createCity({ parent, x: 91, y: 208 });

    this.factory.createCity({ parent, x: 142, y: 207 });
    this.factory.createCity({ parent, x: 173, y: 204 });
    this.factory.createCity({ parent, x: 203, y: 208 });

    // Create initial entities
    this.factory.createAlien();
    this.factory.createAircraft();

    // Create depot with missile silos
    this.factory.createDepot({ parent, x: 13, y: 205 });
    this.factory.createDepot({ parent, x: 113, y: 206 });
    this.factory.createDepot({ parent, x: 232, y: 205 });

    this.background.draw(this.buffer.background);

    this.mouse = new Mouse(this.buffer.onscreen);

    // this.factory.createText({
    //   parent,
    //   x: 0,
    //   y: HEIGHT,
    //   values: [
    //     { value: 'insert coin', blink: false },
    //     { value: 'insert coin', blink: false },
    //   ],
    //   gap: 40,
    //   align: Text.ALIGN.LEFT,
    //   valign: Text.VALIGN.BOTTOM,
    //   color: BLACKISH,
    //   direction: Text.DIRECTION.LEFT,
    //   loop: true,
    //   speed: 30,
    // });

    // this.factory.createText({
    //   parent,
    //   x: 150,
    //   y: 160,
    //   values: [
    //     { value: 'defend', blink: false },
    //     { value: 'cities', blink: false },
    //   ],
    //   gap: 40,
    //   align: Text.ALIGN.CENTER,
    //   valign: Text.VALIGN.MIDDLE,
    //   color: BLUE,
    // });

    // this.factory.createText({
    //   parent,
    //   x: 44,
    //   y: 188,
    //   values: [
    //     { value: '↓', blink: true },
    //     { value: '↓', blink: true },
    //     { value: '↓', blink: true },
    //   ],
    //   gap: 19,
    //   align: Text.ALIGN.LEFT,
    //   valign: Text.VALIGN.BOTTOM,
    //   color: RED,
    //   direction: 0,
    //   loop: false,
    //   speed: 30,
    // });

    // this.factory.createText({
    //   parent,
    //   x: 148,
    //   y: 188,
    //   values: [
    //     { value: '↓', blink: true },
    //     { value: '↓', blink: true },
    //     { value: '↓', blink: true },
    //   ],
    //   gap: 23,
    //   align: Text.ALIGN.LEFT,
    //   valign: Text.VALIGN.BOTTOM,
    //   color: RED,
    //   direction: 0,
    //   loop: false,
    //   speed: 30,
    // });
  }
}
