import { height, width, yellow } from "../constants.mjs";
import { getSprite } from "../old_single_blit";

export default class Background {
    constructor(sprites) {
        this.landscape = getSprite(sprites, 0, 0, 256, 23, '#999999', yellow);    
    }

    update() {

    }

    draw(background) {
      //background.fillStyle = 'green';
        //background.fillRect(0,0, 20, 150);
        
        console.log(this.landscape);
        

      background.drawImage(this.landscape, 0, height-23, width, 23);
    }
}