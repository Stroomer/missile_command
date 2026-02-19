import './css/style.css';
import Game from './js/classes/core/Game.mjs';

const game = new Game();
game.init();

// Keyboard controls
window.addEventListener('keydown', (e) => {
  // Toggle performance monitor with 'P' key
  if (e.key === 'p' || e.key === 'P') {
    game.perfMonitor?.toggle();
  }
});

export { game };
