import { BLUE } from '../../constants.mjs';
import Sprite from '../core/Sprite.mjs';
import Silo from './Silo.mjs';
import Explosion from './Explosion.mjs';

export default class Depot extends Sprite {
  constructor(props) {
    super({
      ...props,
      name: 'depot',
      width: 21,
      height: 14,
    });

    this.id = props.parent.depots.length;
    this.out = false;
    this.low = false;

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

    this.silos = [];

    for (let i = 0; i < 10; i++) {
      const silo = new Silo({ parent: this, x: 9 + this.positions[i].x, y: this.positions[i].y });
      this.silos.push(silo);
    }

    this.drawBuffer();
  }

  /** Attempt to fire toward (destX, destY). Returns true if a missile was launched. */
  launch(destX, destY) {
    if (this.out) {
      this.parent.audio.playDepotOut();
      return false;
    }

    this.silos.pop();
    this.out = this.silos.length === 0;
    this.low = !this.out && this.silos.length <= 3;
    this.drawBuffer();

    this.parent.factory.createMissile({
      parent: this.parent,
      x: this.x + (this.width >> 1),
      y: this.y,
      destX,
      destY,
      speed: 110,
      color: BLUE,
      radius: Explosion.GIANT,
      expandTime: 0.2,
      collapseTime: 0.3,
    });

    return true;
  }

  drawBuffer() {
    this.buffer.clearRect(0, 0, this.sprite.width, this.sprite.height);

    for (let i = 0; i < this.silos.length; i++) {
      const silo = this.silos[i];
      this.buffer.drawImage(silo.sprite, silo.x, silo.y, silo.width, silo.height);
    }
  }

  update(dt) {}

  draw(ctx) {
    ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
  }
}
