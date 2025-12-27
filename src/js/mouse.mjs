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
  const offsetX = canvas.getBoundingClientRect().left - 1;
  const offsetY = canvas.getBoundingClientRect().top  - 1;
  const clientX = e.clientX;
  const clientY = e.clientY;
  const x = (clientX - offsetX);
  const y = (clientY - offsetY);
  
  if (withinBounds(x, y)) {
    mouse.x = x;
    mouse.y = y;
    mouse.visible = true;
    canvas.style.cursor = 'none';
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

