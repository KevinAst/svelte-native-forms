import {initDCT} from '../util/ui/tailwind-dynamic-color-themes/index'; // AI: for some reason, when imported from tailwind.config.js, NodeJS does NOT know how to resolve this WITHOUT index

const schema = [['primary'], 'onPrimary'];

const themes = {
  gray: {
    contextColors: {
      primary:   'coolGray',
      onPrimary: 'white',
    },
  },
  emerald: {
    contextColors: {
      primary:   'emerald',
      onPrimary: 'white',
    },
  },
  amber: {
    contextColors: {
      primary:   'amber',
      onPrimary: 'white',
    },
  },
};

const initialThemeName   = undefined;  // AI: ENHANCE TO pull from local storage
const initialInvertShade = undefined;  //     ditto

const DCT = initDCT(schema, themes, initialThemeName, initialInvertShade);
export default DCT;
