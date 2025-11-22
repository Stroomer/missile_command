import '../css/style.css';
import { randomInt } from './helpers.mjs';
import { createBuffer } from '../js/buffer.mjs';
import { drawPixel, drawRect, drawCircle, drawCircleFill, drawSprite } from './drawing.mjs';

const width  = 256;
const height = 231;

const black  = '#000000';
const white  = '#ffffff';
const red    = '#ff0000';
const green  = '#00ff00';
const blue   = '#0000ff';
const yellow = '#ffff00';
const cyan   = '#00ffff';

// create ref to the sprites-image
const sprites = document.getElementById('sprites');

// create buffer for screen rendering (params: id, width, height, alpha, bgcolor, visible, showAttribs)
const screen = createBuffer('screen', width, height, false, black, true, true); // onscreen context

// TEST: draw a sprite
drawSprite(screen, sprites, 0, 0, 0, height - 23, 256, 23);                                      

// TEST: draw a rectangle
drawRect(screen, width / 2, height / 2, 100, 100, yellow);

// TEST: draw a circle
drawCircle(screen, randomInt(0, width), randomInt(0, height), randomInt(20, 50), red);

// TEST: draw a filled circle
drawCircleFill(screen, randomInt(0, width), randomInt(0, height), randomInt(20, 50), blue);

// TEST: draw 100 pixels
for (let i = 0; i < 100; i++) {
    drawPixel(screen, randomInt(0, width), randomInt(0, height), green);    
}

