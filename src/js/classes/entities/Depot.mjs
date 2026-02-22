import { RED } from '../../constants.mjs';
import Sprite from '../core/Sprite.mjs';
import Silo from './Silo.mjs';

export default class Depot extends Sprite {
  constructor(props) {
    super({
      ...props,
      name: 'depot',
      width: 21,
      height: 14,
    });

    //console.log('Depot', this.x, this.y, this.width, this.height);

    this.out = false;
    this.low = false;
    this.message = '';

    this.positions = [
      { x: 0, y: 0 },
      { x: -3, y: 3 },
      { x: 3, y: 3 },
      { x: -6, y: 6 },
      { x: 0, y: 6 },
      { x: 6, y: 6 },
      { x: -9, y: 9 },
      { x: -3, y: 9 },
      { x: 3, y: 9 },
      { x: 9, y: 9 },
    ];

    // this.buffer.fillStyle = RED;
    // this.buffer.fillRect(0, 0, 21, 14);

    this.silos = [];

    for (let i = 0; i < 10; i++) {
      const silo = new Silo({ parent: this, x: 9 + this.positions[i].x, y: this.positions[i].y });
      this.silos.push(silo);
    }

    for (let i = 0; i < this.silos.length; i++) {
      const silo = this.silos[i];

      //console.log(i, silo.x, silo.y);

      this.buffer.drawImage(silo.sprite, silo.x, silo.y, silo.width, silo.height);
    }
  }

  update(dt) {
    //console.log('DEPOT UPDATE');
  }

  draw(ctx) {
    ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
  }
}
