import { BLUE } from '../../constants.mjs';
import { easeOutQuad, getLineBresenham } from '../../helpers.mjs';

const BLUE_TO_BLACK_16 = [
  "#003cff", "#0036e6", "#0030cc", "#002ab3",
  "#002499", "#001e80", "#001866", "#00124d",
  "#000c33", "#00081f", "#00060f", "#000408",
  "#000203", "#000102", "#000001", "#000000"
];

export default class Smoke {
  constructor(parent, start, target, drawDuration = 0.25, fadeDuration = 5.0) {
    this.game = parent;

    this.drawDuration = drawDuration;
    this.fadeDuration = fadeDuration;
    this.time = 0;
    this.phase = 0;

    this.pixels = getLineBresenham(start.x, start.y, target.x, target.y);

    this.total = this.pixels.length;
    this.visibleCount = 0;

    this.garbage = false;
  }

  update(dt) {
    this.time += dt;

    switch (this.phase) {
      case 0: // start drawing line
              const t = Math.min(this.time / this.drawDuration, 1);
              this.visibleCount = (t * this.total) | 0;

              if (this.visibleCount === this.total) {
                this.phase = 1;
                this.time  = 0;
              }             
      break;
      case 1: // hold 5 sec
              console.log('hold', this.time);
              
              if (time >= 5.0) {
                this.phase = 2;
                this.time  = 0;
              }
      break;
      
      case 2: // start fade-out line
              
      break;
      
      case 3: // dispose line object
      
      break;
    }


    if (this.phase === 1) {
      
    }
    else if (this.phase === 2) {
      this.time = 0;
      this.phase = 3;
    }
    else if (this.phase === 3) {
      // if (this.time) {
        
      // }
      
      console.log(this.time);
      
    }
    


    

    //console.log(this.visibleCount, this.total, this.time);
    
  }

  draw(ctx) {
    switch (this.phase) {
      case 0: // start drawing line
      case 1: // hold 5 sec
        
        console.log("doing");
        
        
      case 2: // start fade-out line
        
      break;
      
      case 3: // dispose line object
      
      break;
    }

    // if (this.phase < 2) {
    //   ctx.fillStyle = BLUE;
    //   for (let i = 0; i < this.visibleCount; i++) {
    //     const p = this.pixels[i];
    //     ctx.fillRect(p.x, p.y, 1, 1);
    //   }
    // } else {
      
    // }



    
    

  }
}
