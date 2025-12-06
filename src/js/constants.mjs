export const DEBUG  = false;

export const width  = 256;
export const height = 231;

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

export const colors = [red, green, blue, purple, orange, yellow, cyan];

export const backgroundColor     = yellow;
export const backgroundShipColor = blue;
export const cityBottomColor     = cyan;
export const cityTopColor        = blue;
export const enemyMissleColor    = red;
export const playerMissleColor   = blue;
export const aircraftColor       = blue;
export const crosshairColor      = blue;



export const FIXED_DT = 1 / 60;
export const DEG      = Math.PI / 180;

export const enemyMissile = {
    minX: 15,
    maxX: width - 15,
    minY: 12,
    maxY: 12,
    minSpeed: 30,
    maxSpeed: 40,
    minAngle: 5,
    maxAngle: 43,
}; 
