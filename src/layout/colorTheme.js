import {initTwThemes} from 'tw-themes';

// our color schema ...
const schema = [
  'primaryLight',
  'primary',
  'primaryDark',

  'secondaryLight',
  'secondary',
  'secondaryDark',

  'onLight',       // typically black
  'onDark',        // typically white

  'accentBorder',  // typically a gray tone (e.g. 'coolGray-600')
                   // ... used for borders in SideBar/NavBar/Menu/Dialog/etc.

  'backdrop',      // universal background 
                   // ... can be a gray tone       (e.g. 'coolGray-200')
                   // ... or lighter primary shade (e.g. `${primary}-100`)
                   //     ... lighter that 'primaryLight'
                   //         providing NOT too much of same color
];

// helper that generates the bulk of our contextColors ...
function gen(primary, secondary) {
  return {
    'primaryLight':   `${primary}-300`,
    'primary':        `${primary}-500`,
    'primaryDark':    `${primary}-900`,

    'secondaryLight': `${secondary}-300`,
    'secondary':      `${secondary}-500`,
    'secondaryDark':  `${secondary}-900`,

    'onLight':        'black',
    'onDark':         'white',

    'accentBorder':   'coolGray-600',

    'backdrop':       `${primary}-100`, // or: 'coolGray-200'
  };
}

// our color themes ...
const themes = {
  'Warm': { contextColors: gen('warmGray', 'amber'), },
  'Cool': { contextColors: gen('coolGray', 'orange'), },
  'Mono': {
    contextColors: {
      ...gen('coolGray', 'red'), // ... base colors
      'primaryLight':   'white', // ... overrides:
      'primaryDark':    'black',
      'backdrop':       'white',
    }
  },
  'Amber':   { contextColors: gen('amber',     'indigo'), },
//'Emerald': { contextColors: gen('emerald',   'red'),    },
  'Teal':    { contextColors: gen('teal',      'rose'),   },
//'Blue':    { contextColors: gen('lightBlue', 'orange'), },
  'Cyan':    { contextColors: gen('cyan',      'orange'), },
  'Indigo':  { contextColors: gen('indigo',    'amber'), },
//'Red':     { contextColors: gen('red',       'green'),  },
//'Rose':    { contextColors: gen('rose',      'green'),  },
//'Pink':    { contextColors: gen('pink',      'lime'),   },
};


//***
//*** Initialize tw-themes -and- promote the TwThemes object to our app
//***

const initialThemeName   = 'Warm'; // AI: ENHANCE TO pull from local storage
const initialInvertShade = true;   //     ditto

const TwThemes = initTwThemes(schema, themes, initialThemeName, initialInvertShade);
export default TwThemes;
