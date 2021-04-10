import {initTwThemes} from 'tw-themes';
import {getAppStateItem,
        setAppStateItem, 
        registerAppStateChangeHandler}  from '../util/appStateRetention';

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

// INTERNAL constants
const themeKey  = 'theme'; // appStateRetention key ... syntax: theme=Warm-dark

// INTERNAL helper to extract individual components of appStateRetention
function parseAppState(appStateStr) {
  const [themeName, darkMode] = appStateStr.split('-');
  const shadeInversion = darkMode==='dark' ? true : false;
  return {themeName, shadeInversion};
}

// our initial state comes from the persistent appStateRetention
// ... with a fallback of 'Warm-light'
const initialState = getAppStateItem(themeKey) || 'Warm-light';
const {themeName, shadeInversion} = parseAppState(initialState);

// initialize tw-themes -and- promote the TwThemes object to our app
const TwThemes = initTwThemes(schema, themes, themeName, shadeInversion);
export default TwThemes;

// sync state change in our appStateRetention
// ... by monkey patching all TwThemes methods THAT alter state
['activateNextTheme',
 'activatePriorTheme',
 'activateTheme',
 'toggleInvertShade'].forEach( (methodName) => {
   const original = TwThemes[methodName];
   TwThemes[methodName] = function(...params) {
     // invoke original method
     const res = original(...params);
     // sync state change in our appStateRetention
     setAppStateItem(themeKey, `${TwThemes.getActiveThemeName()}-${TwThemes.getActiveInvertShade() ? 'dark' : 'light'}`);
     // return original result
     return res;
   }
 });

// sync changes FROM: appStateRetention TO: our local state
// ... this can optionally change "externally" by the user WHEN they employ the URL Site Hash
registerAppStateChangeHandler(themeKey, ({newVal}) => {
  // console.log(`XX AppStateChangeHandler for colorTheme (key: '${themeKey}'): syncing to '${newVal}'`);
  const {themeName, shadeInversion} = parseAppState(newVal);
  TwThemes.activateTheme({themeName, invertShade: shadeInversion});
});
