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
        this.launch({
          parent: this.parent,
          start: { x: randomInt(30, WIDTH - 30), y: 0 },
          target: { x: randomInt(50, WIDTH - 50) , y: HEIGHT - 20 },
          speed: 50,
          color: RED,
          radius: 4,
          isEnemy: true
        });

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
