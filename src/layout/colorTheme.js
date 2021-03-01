import {initDCT} from '../util/ui/tailwind-dynamic-color-themes/index'; // AI: for some reason, when imported from tailwind.config.js, NodeJS does NOT know how to resolve this WITHOUT index

const schema = [
  'primaryLight',
  'primary',
  'primaryDark',

  'secondaryLight',
  'secondary',
  'secondaryDark',

  'onLight', // typically black
  'onDark',  // typically white

  'accentBorder',  // typically a gray tone (e.g. 'coolGray-600')
                   // ... used for borders in SideBar/NavBar/Menu/Dialog/etc.

  'backdrop',      // universal background 
                   // ... can be a gray tone       (e.g. 'coolGray-200')
                   // ... or lighter primary shade (e.g. `${primary}-100`)
                   //     ... lighter that 'primaryLight'
                   //         providing NOT too much of same color
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

      'accentBorder':   'coolGray-600',

      'backdrop':       'white',
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

      'accentBorder':   'coolGray-600',

      'backdrop': `${primary}-100`, // or: 'coolGray-200'
    }
  };
}
