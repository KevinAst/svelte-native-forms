/**----------------------------- URL Hash Storage -----------------------------

   - REPRESENTS a storage device that is retained in the URL (after the # hash)
     ... ex: https://svelte-native-forms.js.org/app/#show=code
   - access can be either programmatic -or- by the end-user (specified in the URL itself)
   - REGARDING "hashchange" event:
     * this event is fired ONLY within the containing window
       ... unlike the Local Storage "storage" event that fires in external windows
     * so the salient points of this event are:
       - initial app launch: NO event fired (so must programmatically pull value out of the URL Hash)
       - programmatic hash change: event IS fired
       - user change hash in URL: event IS fired
         INTERESTING: when JUST the URL Hash changes, it is NOT an app re-launch

   ------------------------------------------------------------------------------ */

import check           from '../check';
import {isString,
        isBoolean,
        isPlainObject,
        isFunction}    from '../typeCheck';
import {encode,
        decode}        from '../encoder';
import {isBrowser}     from '../env'; // can run in node.js env (ex: tailwind.config.js build process)


// INTERNAL functions that performs ADDITIONAL encode/decode for hash bindings
// ... allowing these characters to exist in app state
// ... IMPACTED BY a: safeguard and b: JSONization
// ... NOTE: ternary operator (below) handles `undefined` str

//                                            HASH BINDINGS ('&' -and- '=')                 JSON BINDINGS ('{', '}', '"', ':') <<< PROB NOT NEEDED ANYMORE (don't want JSON in URL)
//                                            --------------------------------------------  ============================================================================================
const encodeHashBindings = (str) => str ? str.replaceAll('&', '@A@').replaceAll('=', '@E@').replaceAll('{', '@LS@').replaceAll('}', '@RS@').replaceAll('"', '@Q@').replaceAll(':', '@C@') : str;
const decodeHashBindings = (str) => str ? str.replaceAll('@A@', '&').replaceAll('@E@', '=').replaceAll('@LS@', '{').replaceAll('@RS@', '}').replaceAll('@Q@', '"').replaceAll('@C@', ':') : str;
// consider standard escape/unescape (NO WORK)
// const encodeHashBindings = (str) => str ? escape(str)   : str;
// const decodeHashBindings = (str) => str ? unescape(str) : str;


// INTERNAL state - a module-scoped copy of the URL Hash
// ... used to determine individual items that have changed
const curUrlHash = getUrlHash();

// INTERNAL function that breaks down the entire URL hash into a hash map
// ... FROM: https://svelte-native-forms.js.org/app/#show=code&theme=Cool
//     TO:   {
//             show:  'code',
//             theme: 'Cool'
//           }
function getUrlHash() {
  if (!isBrowser) {
    return {};
  }

  const hashStr = window.location.hash.substr(1); // the hash stripped of the starting '#'
  // console.log(`XX getUrlHash() hashStr: '${hashStr}'`);
  if (!hashStr) { // handle NO hashStr ... will be '' in this case
    return {};
  }
  const hashMap = hashStr.split('&').reduce( (accum, item) => {
    const [key, val] = item.split('=');
    // shore up user error in URL Hash (EX: 'key' ... expecting 'key=value')
    // console.log(`XX getUrlHash() item: '${item}', key: '${key}', val: '${val}'`);
    if (!val) {
      console.warn(`WARNING: Invalid URL Hash: '${key}' ... expecting: '${key}=value' ... reverting to: '${key}=UNKNOWN'`);
      accum[key] = 'UNKNOWN'; // WEIRD: using `undefined` will no-op all storage operations (PUNT and use string)
    }
    else {
      accum[key] = decode(decodeHashBindings(val));
    }
    return accum;
  }, {});
  // console.log(`XX getUrlHash() hashMap: `, hashMap);
  return hashMap;
}


/**
 * Return an indicator as to whether the specified entry is defined in
 * the URL hash.
 *
 * @param {string} key the unique key to verify.
 * 
 * @return {boolean} true: the supplied key is defined the the URL
 * hash, false: otherwise.
 */
export function isUrlHashItemDefined(key) {

  // validate our parameters
  const checkParam = check.prefix('isUrlHashItemDefined() parameter violation: ');

  // ... key
  checkParam(key,           'key is required');
  checkParam(isString(key), 'key must be a string, NOT: ', key);

  // fetch the specified entry out of our URL Hash (if any)
  const hashMap = getUrlHash();
  const value   = hashMap[key];

  // return indicator based on whether an entry exists
  return value ? true : false;
}


/**
 * Return the specified entry from the URL's hash (if any).
 *
 * @param {string} key the unique key that catalogs this entry.
 * 
 * @return {any} the original entry retained in the set/update
 * operation, if any (undefined for none), implicitly unpacked to it's
 * original state.
 */
export function getUrlHashItem(key) {

  // validate our parameters
  const checkParam = check.prefix('getUrlHashItem() parameter violation: ');

  // ... key
  checkParam(key,           'key is required');
  checkParam(isString(key), 'key must be a string, NOT: ', key);

  // fetch the specified entry out of our URL Hash (if any)
  const hashMap = getUrlHash();
  const value   = hashMap[key];

  // that's all folks :-)
  // ... NOTE: is already "decoded" (in getUrlHash)
  // ... will be `undefined` for no entry
  return value;
}


// INTERNAL function to sync change in URL Hash
// ... typically only one entry has changed, but the granularity of the update is the entire hash
function retainUrlHash(hashMap) {
  let delim = '';
  const hashStr = Object.entries(hashMap).reduce( (accum, [key, val]) => {
    accum += `${delim}${key}=${encodeHashBindings(val)}`;
    delim = '&';
    return accum;
  }, '');
  // console.log(`XX retainUrlHash() hashStr: '${hashStr}'`);
  window.location.hash = hashStr;
}


/**
 * Set the supplied entry in the URL's hash.
 *
 * NOTE: Unlike updateUrlHashItem(), this function unconditionally
 *       set's the supplied entry, regardless of whether it was
 *       previously part of the URL Hash.
 *
 * @param {string} key the unique key that catalogs this entry.
 * @param {any} ref the reference to store.  All types are supported
 * (including null/undefined) EXCEPT functions or class-based objects.
 * @param {boolean} [safeguard=false] an indicator as to whether the
 * entry should be obfuscated (true) or not (false - the DEFAULT).
 */
export function setUrlHashItem(key, ref, safeguard=false) {

  // validate our parameters
  const checkParam = check.prefix('setUrlHashItem() parameter violation: ');

  // ... key
  checkParam(key,           'key is required');
  checkParam(isString(key), 'key must be a string, NOT: ', key);

  // ... ref
  checkParam(ref,                                 'ref is required');
  checkParam(isString(ref) || isPlainObject(ref), 'ref must be a string -or- an object literal, NOT: ', ref);

  // ... safeguard
  checkParam(isBoolean(safeguard), 'safeguard must be a boolean (true/false), NOT: ', safeguard);

  // encode the supplied ref into a string representation
  // SUPPORTING:
  //   - object encoding (to a string representation)
  //     NOTE: plain strings are NOT altered in this operation
  //   - safeguard (obfuscation)
  const value = encode(ref, safeguard);

  // retain the entry in our URL Hash
  const hashMap = getUrlHash();
  hashMap[key]  = value;
  retainUrlHash(hashMap);
}


/**
 * Update the supplied entry in the URL's hash.
 *
 * NOTE: Unlike setUrlHashItem(), this function conditionally set's
 *       the supplied entry, ONLY if it was previously part of the
 *       URL Hash (as defined by the URL).
 *
 * @param {string} key the unique key that catalogs this entry.
 * @param {any} ref the reference to store.  All types are supported
 * (including null/undefined) EXCEPT functions or class-based objects.
 * @param {boolean} [safeguard=false] an indicator as to whether the
 * entry should be obfuscated (true) or not (false - the DEFAULT).
 *
 * @return {boolean} true: URL Hash was updated, false: URL Hash was
 * NOT updated (it did NOT exist).
 */
export function updateUrlHashItem(key, ref, safeguard=false) {

  // validate our parameters
  const checkParam = check.prefix('updateUrlHashItem() parameter violation: ');

  // ... key
  checkParam(key,           'key is required');
  checkParam(isString(key), 'key must be a string, NOT: ', key);

  // ... ref
  checkParam(ref,                                 'ref is required');
  checkParam(isString(ref) || isPlainObject(ref), 'ref must be a string -or- an object literal, NOT: ', ref);

  // ... safeguard
  checkParam(isBoolean(safeguard), 'safeguard must be a boolean (true/false), NOT: ', safeguard);

  // conditionally apply the update if the entry previously existed
  if (curUrlHash[key]) {
    setUrlHashItem(key, ref, safeguard);
    return true;
  }
  else {
    return false;
  }
}


/**
 * Register handler when a specific key changes in the URL Hash.
 *
 * These handlers are fired both when changed by the user (in the URL),
 * or programmatic changes (via our set/update API above).
 *
 * @param {string} key the unique key that is monitored for change.
 * @param {function} handler the function to invoke on change.
 *                   API: + handler({oldVal, newVal}): void
 *                          NOTE: uses named parameters!
 */
export function registerUrlHashItemChangeHandler(key, handler) {

  // validate our parameters
  const checkParam = check.prefix('registerUrlHashItemChangeHandler() parameter violation: ');

  // ... key
  checkParam(key,           'key is required');
  checkParam(isString(key), 'key must be a string, NOT: ', key);

  // ... handler
  checkParam(handler,             'handler is required');
  checkParam(isFunction(handler), 'handler must be a function, NOT: ', handler);

  // register the handler
  if (!_handlers[key]) { // prime the pump with array entries
    _handlers[key] = [];
  }
  _handlers[key].push(handler);
}

// our registered handlers
const _handlers = {
  // 'key1': [handler1a, handler1b],
  // 'key2': [handler2a, handler2b],
};

// monitor URL Hash changes (driving the firing of our registered handlers)
if (isBrowser) {
  window.addEventListener("hashchange", () => {
    const hashMap = getUrlHash();
    // console.log(`XX hashchange event fired: `, hashMap);
    Object.entries(hashMap).forEach( ([key, newVal]) => {
      const oldVal = curUrlHash[key];
      if (newVal !== oldVal) {
        // interact with our registered handlers
        // console.log(`XX URL Hash Changed - event key: '${key}' changed WAS: '${oldVal}'  NOW: '${newVal}' ... interacting with handlers`);
        const handlers = _handlers[key];
        if (handlers) {
          handlers.forEach( (handler) => handler({oldVal, newVal}) );
        }
        // retain latest newVal as current
        curUrlHash[key] = newVal;
      }
    });
  });
}
