import { WIDTH, HEIGHT } from './../js/constants.mjs';
import { withinBounds } from './helpers.mjs';

const canvas = document.getElementById('onscreen');
export let mouse = {
  x: 0,
  y: 0,
  visible: false,
  down: false,
  fire: false,
};

canvas.addEventListener('mousedown', (e) => {
  if (!mouse.down) {
    mouse.down = true;  
    if (mouse.visible) {
      mouse.fire = true;
    }
  }
});

canvas.addEventListener('mouseup', (e) => {
  mouse.down = false;
});

canvas.addEventListener('mousemove', (e) => {
  const offsetX = canvas.getBoundingClientRect().left;
  const offsetY = canvas.getBoundingClientRect().top;
  const clientX = e.clientX;
  const clientY = e.clientY;
  const x       = (clientX - offsetX) | 0;
  const y       = (clientY - offsetY) | 0;

  if (withinBounds(x, y)) {
    mouse.x = x;
    mouse.y = y;
    mouse.visible = true;
    canvas.style.cursor = 'none';
    //console.log(x, y);
  } else {
    mouse.visible = false;
    canvas.style.cursor = 'arrow';
  }
});

canvas.addEventListener('mouseout', (e) => {
  mouse.visible = false;
});

canvas.addEventListener('mouseover', (e) => {
  mouse.visible = true;
});

