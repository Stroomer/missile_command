import Sprite from "../Sprite.mjs";
import { COLORS, GREY, YELLOW } from '../../constants.mjs';
import { createBuffer, createBufferList } from '../../buffer.mjs';
import { drawCircle, recolorSprite } from '../../canvas.mjs';
import { easeInQuad, easeOutQuad, even, randomInt } from '../../helpers.mjs';



export default class Explosion extends Sprite {
  constructor(props) {
    props = Explosion.VALIDATE(props);
    super(props.target.x, props.target.y, props.radius, props.radius);
    
    this.parent       = props.parent;
    this.radius       = props.radius;
    this.expandTime   = props.expandTime;
    this.collapseTime = props.collapseTime;   
    this.time         = 0;
    this.phase        = 0; // 0 = expand, 1 = collapse
    this.sprite       = createBuffer('explosion', props.radius, props.radius).canvas;
    this.buffer       = this.sprite.getContext('2d'); 
    this.garbage      = false;
  }

  update(dt) {
    if (!this.parent.exploded) return;

    this.time += dt;
    let t, eased;
    
    if (this.phase === 0) {
      t = Math.min(this.time / this.expandTime, 1);
      eased = easeOutQuad(t);
      if (t >= 1) {
        this.phase = 1;
        this.time = 0;
      }
    } else {
      t = Math.min(this.time / this.collapseTime, 1);
      eased = 1 - easeInQuad(t);
      if (t >= 1) {
        this.parent.garbage = true;
        return;
      }
    }
    



    //const n = this.parent.parent.colorId;
    const maxIndex = 32 - 1;
    const group    = randomInt(0,7) * 32;  
    const index = group + ((eased * maxIndex) | 0);
    
    this.sprite = super.getSprite(Explosion.BUFFERS, index);
    this.buffer = this.sprite.getContext('2d');

    //this.collisionRadius = eased * this.radius;
    
    super.update(dt);
  }

  hit(obj) {
    const dx = obj.x - this.x;
    const dy = obj.y - this.y;
    const r  = this.collisionRadius + obj.radius;

    return dx * dx + dy * dy <= r * r;
  }

  draw(ctx) {
    super.draw(ctx);
  }
}

Explosion.GET_BUFFERS = function() {
  let buffers = [];

  const GROUP_SIZE = 32;
  const STEP       = 2;
  const SIZE_LIST  = Array.from({ length:GROUP_SIZE }, (_, i) => (i + 1) * STEP); // create array with integers for buffersize
  
  buffers = createBufferList('explosion', SIZE_LIST);
  buffers = buffers.map(buffer => {
    drawCircle(buffer, buffer.canvas.width, GREY);
    return buffer;
  });
  buffers = COLORS.flatMap(() => [...buffers]);
  buffers.forEach((buffer, index) => {
    const group = (index / GROUP_SIZE) | 0;
    const to = COLORS[index % COLORS.length];  
    recolorSprite(buffer.canvas, [{ from:GREY, to }]);
  });

  return buffers;
}

Explosion.BUFFERS = Explosion.GET_BUFFERS();






// Loop door alle kleuren heen
// for (let i = 0; i < COLORS.length; i++) {
//   const template = [...Explosion.TEMPLATE];  // Kloon de grijze buffers TEMPLATE
//   const from     = '#999999';
  
//   for (let b = 0; b < template.length; b++) {
//     const canvas = template[b].canvas;
//     const to     = COLORS[b % COLORS.length];

//     recolorSprite(canvas, [ { from, to } ]);    
//   }

//   Explosion.BUFFERS.push( ...template );
// }




// export function render(buffers, colors) {
//   const arr = [];
//   for (let i = 0; i < colors.length; i++) {
//     arr.push(...buffers);
//   }
  
//   const from = '#999999';
//   for (let i = 0; i < arr.length; i++) {
//     const sprite = arr[i].canvas;
//     const to     = COLORS[i % colors.length];
//     recolorSprite(sprite, [ { from, to } ]);
//   }

//   return arr;
// }



Explosion.VALIDATE = (props) => {
  const { start, target, expandTime, collapseTime, radius } = props;
  
  if (!start)                                throw Error("No start-location specified");
  if (!target)                               throw Error("No target-location specified");
  if (!expandTime)                           throw Error("No expandTime specified");
  if (!collapseTime)                         throw Error("No collapseTime specified");
  if (!radius)                               throw Error("No radius specified");
    
  return props;
}



