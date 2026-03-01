export const DEBUG  = false;

export const WIDTH  = 256;
export const HEIGHT = 231;
export const HALF_W = (WIDTH / 2)  | 0;
export const HALF_H = (HEIGHT / 2) | 0;

export const BLACK = '#000000';
export const BLACKISH = '#070000';
export const GREY   = '#999999';
export const WHITE  = '#ffffff';

export const RED    = '#ff0000';
export const GREEN  = '#00ff00';
export const BLUE   = '#0000ff';
export const PURPLE = '#800080 ';
export const ORANGE = '#ffa500';
export const YELLOW = '#ffff00';
export const CYAN = '#00ffff';

export const COLORS = [RED, PURPLE, WHITE, GREEN, YELLOW, BLUE, ORANGE, CYAN];

export const DEG    = Math.PI / 180;
export const FPS    = 60;
export const STEP   = 1 / FPS;

export const CIRCLE = 'circle';
export const RECT   = 'rect';
export const LEFT   = 'left';
export const RIGHT  = 'right';

export const DIRECTION = { LEFT:-1, RIGHT:1, UP:-1, DOWN:1 };

export const HAS_OFFSCREEN_CANVAS_CAPABILITIES = typeof OffscreenCanvas !== 'undefined';

export const KEY_W     = 'w';
export const KEY_A     = 'a';
export const KEY_S     = 's';
export const KEY_D     = 'd';
export const KEY_UP    = 'ArrowUp';
export const KEY_LEFT  = 'ArrowLeft';
export const KEY_DOWN  = 'ArrowDown';
export const KEY_RIGHT = 'ArrowRight';

export const KEY_1  = '1';
export const KEY_2  = '2';
export const KEY_3  = '3';
export const KEY_4  = '4';
export const KEY_5  = '5';
export const KEY_6  = '6';
export const KEY_7  = '7';
export const KEY_8  = '8';
export const KEY_9  = '9';
export const KEY_10 = '0';
