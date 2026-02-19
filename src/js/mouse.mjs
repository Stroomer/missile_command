import { withinBounds } from '../js/functions.mjs';

const canvas = document.getElementById('onscreen');

export let mouse = {
  x: 0,
  y: 0,
  visible: false,
  down: false,
  fire: false,
};

function getIntegerScale(canvas) {
  const rect = canvas.getBoundingClientRect();
  return Math.max(1, Math.floor( Math.min( rect.width / canvas.width, rect.height / canvas.height )));
}

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
  const rect   = canvas.getBoundingClientRect();
  const scaleX = canvas.width  / rect.width;
  const scaleY = canvas.height / rect.height;
  const x      = ((e.clientX - rect.left) * scaleX) | 0;
  const y      = ((e.clientY - rect.top)  * scaleY) | 0;

  if (withinBounds(x, y)) {
    mouse.x = x;
    mouse.y = y;
    mouse.visible = true;
  } else {
    mouse.visible = false;
  }
});

canvas.addEventListener('mouseout', (e) => {
  mouse.visible = false;
  canvas.style.cursor = 'arrow';
});

canvas.addEventListener('mouseover', (e) => {
  mouse.visible = true;
  canvas.style.cursor = 'none';
});

