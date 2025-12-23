export const DEBUG  = false;

export const WIDTH  = 256;
export const HEIGHT = 231;

export const black  = '#000000';
export const grey   = '#999999';
export const white  = '#ffffff';

export const red    = '#ff0000';
export const green  = '#00ff00';
export const blue   = '#0000ff';
export const purple = '#800080 ';
export const orange = '#ffa500';
export const yellow = '#ffff00';
export const cyan   = '#00ffff';

export const colors = [red, purple, white, green, yellow, blue, orange, cyan];

export const DEG  = Math.PI / 180;
export const FPS  = 60;
export const STEP = 1 / FPS;

export const enemyMissile = {
    minX: 15,
    maxX: WIDTH - 15,
    minY: 12,
    maxY: 12,
    minSpeed: 30,
    maxSpeed: 40,
    minAngle: 5,
    maxAngle: 43,
}; 
