import { KEY_LEFT, KEY_RIGHT, KEY_1, KEY_2, KEY_3, KEY_4, KEY_5, KEY_6, KEY_7, KEY_8, KEY_9, KEY_10 } from '../../constants.mjs';
import Keyboard from '../input/Keyboard.mjs';

const SOUND_KEYS = [KEY_1, KEY_2, KEY_3, KEY_4, KEY_5, KEY_6, KEY_7, KEY_8, KEY_9, KEY_10];

export default class MissionControl {
  constructor(parent) {
    this.parent = parent;
    this.keyboard = new Keyboard();
    this.selectedDepotIndex = 1; // start with the centre depot
  }

  update() {
    const kb     = this.keyboard;
    const depots = this.parent.depots;
    const count  = depots.length;
    const { fire, visible, x, y } = this.parent.mouse;

    if (kb.isLastPressed(KEY_LEFT))  this.selectedDepotIndex = (this.selectedDepotIndex - 1 + count) % count;
    if (kb.isLastPressed(KEY_RIGHT)) this.selectedDepotIndex = (this.selectedDepotIndex + 1) % count;

    for (let i = 0; i < SOUND_KEYS.length; i++) {
      if (kb.isLastPressed(SOUND_KEYS[i])) this.parent.audio.playDepotOutTest(i + 1);
    }

    kb.flush();

    if (!fire || !visible) return;

    depots[this.selectedDepotIndex].launch(x, y);

    this.parent.mouse.fire = false;
  }
}
