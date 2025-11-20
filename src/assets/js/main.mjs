import '../css/style.css';

const canvas = document.querySelector('.game');

console.log(canvas);

// export default class Buffer {
//   constructor(id, width, height, bgcolor, isVisible, showAttribs = true) {
//     console.log('buffer: ' + id);

//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d', {
//       alpha: false,
//       willReadFrequently: true,
//       desynchronized: false,
//     });

//     canvas.id = id;
//     canvas.width = width;
//     canvas.height = height;
//     canvas.style.display = isVisible ? 'block' : 'none';
//     canvas.style.backgroundColor = bgcolor;

//     ctx.imageSmoothingEnabled = false;
//     ctx.fillStyle = bgcolor.HEX;

//     if (isVisible) document.getElementById('app').appendChild(canvas);

//     if (showAttribs) {
//       if (ctx.getContextAttributes) {
//         const attributes = ctx.getContextAttributes();
//         console.log('---------');
//         console.log(JSON.stringify(attributes));
//         console.log('---------');
//       } else {
//         console.log('CanvasRenderingContext2D.getContextAttributes() is not supported');
//       }
//     }

//     return ctx;
//   }
// }
