import initDCT from './initDCT';

//*** 
//*** DOCUMENTATION NOTE: See README for complete and thorough description!
//*** 


//*** 
//*** Promote all tailwind-dynamic-color-themes PUBLIC API through a centralized module.
//*** 

// this non-default export supports ES6 imports
// EX:
//     import {initDCT}  from 'tailwind-dynamic-color-themes';
//    -or-
//     import * as MyDCT from 'tailwind-dynamic-color-themes';
export {
  initDCT,
}

// this default export supports CommonJS modules (otherwise Babel does NOT promote them).
// EX:
//     const {initDCT} = require('tailwind-dynamic-color-themes');
//    -or-
//     const MyDCT     = require('tailwind-dynamic-color-themes');
export default {
  initDCT,
}
