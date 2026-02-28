import { KEY_W, KEY_A, KEY_S, KEY_D, KEY_UP, KEY_LEFT, KEY_DOWN, KEY_RIGHT } from '../../constants.mjs';

const TRACKED_KEYS = new Set([KEY_W, KEY_A, KEY_S, KEY_D, KEY_UP, KEY_LEFT, KEY_DOWN, KEY_RIGHT]);

export default class Keyboard {
  constructor() {
    this.held = new Set();
    this.lastPressed = new Set();
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  onKeyDown(e) {
    if (TRACKED_KEYS.has(e.key)) {
      e.preventDefault();
      if (!this.held.has(e.key)) this.lastPressed.add(e.key);
      this.held.add(e.key);
    }
  }

  onKeyUp(e) {
    this.held.delete(e.key);
  }

  isHeld(key) {
    return this.held.has(key);
  }

  isLastPressed(key) {
    return this.lastPressed.has(key);
  }

  flush() {
    this.lastPressed.clear();
  }

  destroy() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }
}
