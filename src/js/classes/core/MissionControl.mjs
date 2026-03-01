import { KEY_A, KEY_D, KEY_LEFT, KEY_RIGHT } from '../../constants.mjs';
import Keyboard from '../input/Keyboard.mjs';

const MIDDLE_DEPOT = 1;

export default class MissionControl {
  constructor(parent) {
    this.parent = parent;
    this.keyboard = new Keyboard();
    this.selectedDepotIndex = MIDDLE_DEPOT;
  }

  /** Returns the index of an available (non-out) depot, preferring the middle one. */
  findAvailableDepot() {
    const depots = this.parent.depots;

    if (!depots[MIDDLE_DEPOT].out) return MIDDLE_DEPOT;

    for (let i = 0; i < depots.length; i++) {
      if (!depots[i].out) return i;
    }

    return this.selectedDepotIndex; // all depots out
  }

  update() {
    const kb     = this.keyboard;
    const depots = this.parent.depots;
    const count  = depots.length;
    const { fire, visible, x, y } = this.parent.mouse;

    if (kb.isLastPressed(KEY_LEFT)  || kb.isLastPressed(KEY_A)) this.selectedDepotIndex = (this.selectedDepotIndex - 1 + count) % count;
    if (kb.isLastPressed(KEY_RIGHT) || kb.isLastPressed(KEY_D)) this.selectedDepotIndex = (this.selectedDepotIndex + 1) % count;

    kb.flush();

    if (depots[this.selectedDepotIndex].out) this.selectedDepotIndex = this.findAvailableDepot();

    for (let i = 0; i < count; i++) depots[i].setSelected(i === this.selectedDepotIndex);

    if (!fire || !visible) return;

    depots[this.selectedDepotIndex].launch(x, y);

    this.parent.mouse.fire = false;
  }
}
