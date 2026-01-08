import { HEIGHT, RED, WIDTH } from '../constants.mjs';
import { randomInt } from '../helpers.mjs';
import Missile from './missile/Missile.mjs';

export default class Enemy {
  constructor(parent) {
    this.parent = parent;
    this.time = 0;
    this.missilesLaunched = 0;
    this.lock = true;
  }

  update(dt) {
    this.time += dt;
    if (this.time >= 1) {
      this.time = 0;
      if (!randomInt(0, 2) && !this.lock) {
        const parent  = this.parent;
        const start   = { x: randomInt(30, WIDTH - 30), y: 0 };
        const target  = { x: randomInt(50, WIDTH - 50) , y: HEIGHT - 20 };
        const speed   = 50;
        const color   = RED;
        const radius  = 4;
        const isEnemy = true;
        const props   = { parent, start, target, speed, color, radius, isEnemy };
        
        this.launch(props);

        //console.log('launch!!');
      } else {
        //console.log('ignore');
      }  
    }  
  }

  launch(props) {
    props.parent.missiles.push(new Missile(props));
  }
}
