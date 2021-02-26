import {initDCT} from '../util/ui/tailwind-dynamic-color-themes/index'; // AI: for some reason, when imported from tailwind.config.js, NodeJS does NOT know how to resolve this WITHOUT index

const schema = [
  'primaryLight',
  'primary',
  'primaryDark',

  'secondaryLight',
  'secondary',
  'secondaryDark',

  'onLight',
  'onDark',
];

const themes = {
  'Cool Gray': themeGenerator('coolGray',  'orange'),
  'Black/White': {
    contextColors: {
      'primaryLight':   `white`,
      'primary':        `gray-500`,
      'primaryDark':    `black`,
      
      'secondaryLight': `red-300`,
      'secondary':      `red-500`,
      'secondaryDark':  `red-900`,
      
      'onLight':        'black',
      'onDark':         'white',
    }
  },
  'Amber':     themeGenerator('amber',     'indigo'),
  'Emerald':   themeGenerator('emerald',   'red'),
  'Teal':      themeGenerator('teal',      'rose'),
  'Blue':      themeGenerator('lightBlue', 'orange'),
  'Cyan':      themeGenerator('cyan',      'orange'),
  'Red':       themeGenerator('red',       'green'),
  'Pink':      themeGenerator('pink',      'lime'),
};

const initialThemeName   = 'Cool Gray'; // AI: ENHANCE TO pull from local storage
const initialInvertShade = true;        //     ditto

const DCT = initDCT(schema, themes, initialThemeName, initialInvertShade);
export default DCT;

function themeGenerator(primary, secondary) {
  return {
    contextColors: {
      'primaryLight':   `${primary}-300`,
      'primary':        `${primary}-500`,
      'primaryDark':    `${primary}-900`,
      
      'secondaryLight': `${secondary}-300`,
      'secondary':      `${secondary}-500`,
      'secondaryDark':  `${secondary}-900`,
      
      'onLight':        'black',
      'onDark':         'white',
    }
  };
}
