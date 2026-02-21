import Alien from '../entities/Alien.mjs';
import Aircraft from '../entities/Aircraft.mjs';
import Missile from '../entities/Missile.mjs';
import Explosion from '../entities/Explosion.mjs';
import Target from '../entities/Target.mjs';
import City from '../entities/City.mjs';
import Depot from '../entities/Depot.mjs';
import Char from '../text/Char.mjs';

/**
 * EntityFactory - Centralized entity creation
 * Benefits:
 * - Consistent parent setting
 * - Single place to add object pooling later
 * - Easy debugging (breakpoint in one place)
 * - Ensures all entities are properly registered
 */
export default class Factory {
  constructor(game) {
    this.game = game;
  }

  createAlien(props = {}) {
    const alien = new Alien({ ...props, parent: this.game });
    this.game.aliens.push(alien);
    return alien;
  }

  createAircraft(props = {}) {
    const aircraft = new Aircraft({ ...props, parent: this.game });
    this.game.aircrafts.push(aircraft);
    return aircraft;
  }

  createMissile(props = {}) {
    const missile = new Missile({ ...props, parent: this.game });
    this.game.missiles.push(missile);
    return missile;
  }

  createExplosion(props = {}) {
    const explosion = new Explosion({ ...props, parent: this.game });
    this.game.explosions.push(explosion);
    return explosion;
  }

  createTarget(props = {}) {
    const target = new Target({ ...props, parent: this.game });
    this.game.targets.push(target);
    return target;
  }

  createCity(props = {}) {
    const city = new City({ ...props, parent: this.game });
    this.game.cities.push(city);
    return city;
  }

  createDepot(props = {}) {
    const depot = new Depot({ ...props, parent: this.game });
    this.game.depots.push(depot);
    return depot;
  }

  createChar(props = {}) {
    const char = new Char({ ...props, parent: this.game });
    this.game.chars.push(char);
    return char;
  }
}
