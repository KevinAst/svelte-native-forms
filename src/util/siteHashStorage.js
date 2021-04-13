/**----------------------------- Site Hash Storage -----------------------------

   - REPRESENTS a storage device that is retained in the URL (after the # hash)
     ... ex: https://svelte-native-forms.js.org/app/#show=code
   - access can be either programmatic -or- by the end-user (specified in the URL itself)
   - REGARDING "hashchange" event:
     * this event is fired ONLY within the containing window
       ... unlike the "storage" event that fires in external windows
     * so the salient points of this event are:
       - initial app launch: NO event fired (so must programmatically pull value out of hash)
       - programmatic hash change: event IS fired
       - user change hash in URL: event IS fired (INTERESTING: when JUST the URL hash changes it is NOT an app re-launch)

   ------------------------------------------------------------------------------ */

import check           from './check';
import {isString,
        isBoolean,
        isPlainObject,
        isFunction}    from './typeCheck';
import {encode,
        decode}        from './encoder';
import {isBrowser}     from './env'; // can run in node.js env (ex: tailwind.config.js build process)


// INTERNAL functions to encode/decode hash bindings ('&' -and- '=')
// ... allowing these characters to exist in app state
// ... most critical when using safeguard feature
// ... NOTE: ternary operator (below) handles `undefined` str
const encodeHashBindings = (str) => str ? str.replaceAll('&', '@A@').replaceAll('=', '@E@') : str;
const decodeHashBindings = (str) => str ? str.replaceAll('@A@', '&').replaceAll('@E@', '=') : str;


// INTERNAL state - a module-scoped copy of the site hash
// ... used to determine individual items that have changed
const curSiteHash = getSiteHash();

// INTERNAL function that breaks down the entire URL hash into a hash map
// ... FROM: https://svelte-native-forms.js.org/app/#show=code&theme=Cool
//     TO:   {
//             show:  'code',
//             theme: 'Cool'
//           }
function getSiteHash() {
  if (!isBrowser) {
    return {};
  }

  const hashStr = window.location.hash.substr(1); // the hash stripped of the starting '#'
  // console.log(`XX getSiteHash() hashStr: '${hashStr}'`);
  if (!hashStr) { // handle NO hashStr ... will be '' in this case
    return {};
  }
  const hashMap = hashStr.split('&').reduce( (accum, item) => {
    const [key, val] = item.split('=');
    // shore up user error in URL Site Hash (EX: 'key' ... expecting 'key=value')
    // console.log(`XX getSiteHash() item: '${item}', key: '${key}', val: '${val}'`);
    if (!val) {
      console.warn(`WARNING: Invalid URL Site Hash: '${key}' ... expecting: '${key}=value' ... reverting to: '${key}=UNKNOWN'`);
      accum[key] = 'UNKNOWN'; // WEIRD: using `undefined` will no-op all storage operations (PUNT and use string)
    }
    else {
      accum[key] = decode(decodeHashBindings(val));
    }
    return accum;
  }, {});
  // console.log(`XX getSiteHash() hashMap: `, hashMap);
  return hashMap;
}


/**
 * Return the specified entry from the URL's site hash (if any).
 *
 * @param {string} key the unique key that catalogs this entry.
 * 
 * @return {string|jsonObj} the entry retained in the site hash
 * (undefined for none), implicitly unpacked to the original ref
 * (supplied to `setSiteHashItem()`).
 */
export function getSiteHashItem(key) {

  // validate our parameters
  const checkParam = check.prefix('getSiteHashItem() parameter violation: ');

  // ... key
  checkParam(key,           'key is required');
  checkParam(isString(key), 'key must be a string, NOT: ', key);

  // fetch the specified entry out of our site hash (if any)
  const hashMap = getSiteHash();
  const value   = hashMap[key];

  // that's all folks :-)
  // ... NOTE: is already "decoded" (in getSiteHash)
  // ... will be `undefined` for no entry
  return value;
}


// INTERNAL function to sync change in site hash
// ... typically only one entry has changed, but the granularity of the update is the entire hash
function retainSiteHash(hashMap) {
  let delim = '';
  const hashStr = Object.entries(hashMap).reduce( (accum, [key, val]) => {
    accum += `${delim}${key}=${encodeHashBindings(val)}`;
    delim = '&';
    return accum;
  }, '');
  // console.log(`XX retainSiteHash() hashStr: '${hashStr}'`);
  window.location.hash = hashStr;
}


/**
 * Set the supplied entry in the URL's site hash.
 *
 * NOTE: Unlike updateSiteHashItem(), this function unconditionally
 *       set's the supplied entry, regardless of whether it was
 *       previously part of the site hash.
 *
 * @param {string} key the unique key that catalogs this entry.
 * @param {string|jsonObj} ref the reference to store.
 * @param {boolean} [safeguard=false] an indicator as to whether the
 * entry should be obfuscated (true) or not (false - the DEFAULT).
 */
export function setSiteHashItem(key, ref, safeguard=false) {

  // validate our parameters
  const checkParam = check.prefix('setSiteHashItem() parameter violation: ');

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

  // retain the entry in our site hash
  const hashMap = getSiteHash();
  hashMap[key]  = value;
  retainSiteHash(hashMap);
}


/**
 * Update the supplied entry in the URL's site hash.
 *
 * NOTE: Unlike setSiteHashItem(), this function conditionally set's
 *       the supplied entry, ONLY if it was previously part of the
 *       site hash (as defined by the URL).
 *
 * @param {string} key the unique key that catalogs this entry.
 * @param {string|jsonObj} ref the reference to store.
 * @param {boolean} [safeguard=false] an indicator as to whether the
 * entry should be obfuscated (true) or not (false - the DEFAULT).
 *
 * @return {boolean} true: site hash was updated, false: site hash was
 * NOT updated (it did NOT exist).
 */
export function updateSiteHashItem(key, ref, safeguard=false) {

  // validate our parameters
  const checkParam = check.prefix('updateSiteHashItem() parameter violation: ');

  // ... key
  checkParam(key,           'key is required');
  checkParam(isString(key), 'key must be a string, NOT: ', key);

  // ... ref
  checkParam(ref,                                 'ref is required');
  checkParam(isString(ref) || isPlainObject(ref), 'ref must be a string -or- an object literal, NOT: ', ref);

  // ... safeguard
  checkParam(isBoolean(safeguard), 'safeguard must be a boolean (true/false), NOT: ', safeguard);

  // conditionally apply the update if the entry previously existed
  if (curSiteHash[key]) {
    setSiteHashItem(key, ref, safeguard);
    return true;
  }
  else {
    return false;
  }
}


/**
 * Register handler when a specific key changes in the URL site hash.
 *
 * These handlers are fired both when changed by the user (in the URL),
 * or programmatic changes (via our set/update API above).
 *
 * @param {string} key the unique key that is monitored for change.
 * @param {function} handler the function to invoke on change.
 *                   API: + handler({oldVal, newVal}): void
 *                          NOTE: uses named parameters!
 */
export function registerSiteHashItemChangeHandler(key, handler) {

  // validate our parameters
  const checkParam = check.prefix('registerSiteHashItemChangeHandler() parameter violation: ');

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

// monitor Site Hash changes (driving the firing of our registered handlers)
if (isBrowser) {
  window.addEventListener("hashchange", () => {
    const hashMap = getSiteHash();
    // console.log(`XX hashchange event fired: `, hashMap);
    Object.entries(hashMap).forEach( ([key, newVal]) => {
      const oldVal = curSiteHash[key];
      if (newVal !== oldVal) {
        // interact with our registered handlers
        // console.log(`XX Site Hash Changed - event key: '${key}' changed WAS: '${oldVal}'  NOW: '${newVal}' ... interacting with handlers`);
        const handlers = _handlers[key];
        if (handlers) {
          handlers.forEach( (handler) => handler({oldVal, newVal}) );
        }
        // retain latest newVal as current
        curSiteHash[key] = newVal;
      }
    });
  });
}
