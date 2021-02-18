// NOTE: The following import is in our application source (which contains ES Modules)!
//       - Because tailwind does NOT support ES Modules, we resolve THIS
//         configuration file directly in rollup.config.js.
//       - This is fully described in:
//         TOOLING.md#setup-tailwind-dynamic-color-themes
import DCT from './src/ui/colorTheme';

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

  // KJB: define our abstract Context Colors
  theme: {
    extend: {
      colors: DCT.colorConfig(),
    },
  },
};
