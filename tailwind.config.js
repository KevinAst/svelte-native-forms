// NOTE: This module uses ES Modules in order to include resources
//       from our `src/` app tree.  
//
//       - This is needed to pull in our context color definitions
//         (used in our color themes).
//
//       - Currently, tailwind does NOT support ES Modules (in it's
//         configuration file).  Therefore, to accomplish this,
//         our `rollup.config.js` resolves this configuration file,
//         and passes it directly to the tailwindcss plugin function:
//           rollup.config.js
//           ================
//           import tailwindcss    from 'tailwindcss';
//           import tailwindConfig from './tailwind.config.js';
//           ... snip snip
//           export default {
//             ... snip snip
//             plugins: [
//               svelte({
//                 ... snip snip
//                 preprocess: sveltePreprocess({
//                   ... snip snip
//                   postcss: {
//                     plugins: [
//                       ... snip snip
//                    // require("tailwindcss"),      // ... KJB: normal usage
//                       tailwindcss(tailwindConfig), // ... KJB: in support of ES Modules (in tailwind.config.js)

// ??? import DCT from './src/ui/colorTheme';

const production = !process.env.ROLLUP_WATCH; // or some other env var like NODE_ENV KJB: same as in rollup.config.js

export default {
  future: { // for tailwind 2.0 compat
    purgeLayersByDefault: true, 
    removeDeprecatedGapUtilities: true,
  },
  plugins: [
    // for tailwind UI users only
    // require('@tailwindcss/ui'), KJB: not using @tailwindcss/ui (can't find info on this)
    // other plugins here
  ],
  purge: {
    content: [
      "./src/**/*.svelte",
      // may also want to include base index.html
    ], 
    enabled: production // disable purge in dev
  },

//? // KJB: define our abstract Context Colors
//? theme: {
//?   extend: {
//?     colors: DCT.colorConfig(),
//?   },
//? },
};
