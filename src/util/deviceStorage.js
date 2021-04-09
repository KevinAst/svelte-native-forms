/**------------------------ Local Device Storage ----------------------------------------

   - REPRESENTS a storage device that is global to the domain of the URL (a combination of protocol://host:port)
     ... in other words this storage is globally available to ALL windows of the same domain.
   - all access is programmatic, so the end-user cannot specify (as they can for the Site Hash URL)
   - REGARDING "storage" event:
     * there is a "storage" event that is fired when the storage changes
       HOWEVER this event is fired only in windows other that the one that made the change
       ... presumably the window that made the change is already aware of the change
       >>> by listening/reacting to this event, it has the effect of cross-communicating between windows
     * so the salient points of this event are:
       - initial app launch:      NO event fired (so must programmatically pull value out)
       - programmatic hash change: event IS fired ONLY to external windows (for cross-communication between windows)
       - iframe usage:            IDENTICAL (BASED ON THE iframe.src)

   ------------------------------------------------------------------------------ */

import check           from './check';
import {isString,
        isBoolean,
        isPlainObject} from './typeCheck';
import noOp            from './noOp';
import {encode,
        decode}        from './encoder';


/**
 * Fetch the stored entry from local device storage.
 *
 * @param {string} key the unique key that catalogs this entry.
 * 
 * @return {string|jsonObj} the entry stored from the supplied key (undefined for
 * none), implicitly unpacked to the original ref (supplied to
 * `storeItem()`).
 */
export function fetchItem(key) {

  // validate our parameters
  const checkParam = check.prefix('fetchItem() parameter violation: ');

  // ... key
  checkParam(key,           'key is required');
  checkParam(isString(key), 'key must be a string, NOT: ', key);

  // retrieve the entry from our deviceStorage
  const value = deviceStorage.getItem(key);

  // no-op for non-existent entries
  if (!value) {
    return undefined;
  }

  // decode the entry, unpacking it into the original form (ref)
  const ref = decode(value);

  // that's all folks :-)
  return ref;
}


/**
 * Store the supplied entry in local device storage.
 *
 * @param {string} key the unique key that catalogs this entry.
 * @param {string|jsonObj} ref the reference to store.
 * @param {boolean} [safeguard=false] an indicator as to whether the
 * entry should be obfuscated (true) or not (false - the DEFAULT).
 */
export function storeItem(key, ref, safeguard=false) {

  // validate our parameters
  const checkParam = check.prefix('storeItem() parameter violation: ');

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

  // store the entry into our deviceStorage
  deviceStorage.setItem(key, value);
}


/**
 * Remove the stored entry from local device storage.
 *
 * @param {string} key the unique key of the entry to remove.
 */
export function removeItem(key) {

  // validate our parameters
  const checkParam = check.prefix('removeItem() parameter violation: ');

  // ... key
  checkParam(key,           'key is required');
  checkParam(isString(key), 'key must be a string, NOT: ', key);

  // remove the entry from our local device storage
  deviceStorage.removeItem(key);
}


/**
 * Register handler when a specific key changes in the Device Storage.
 *
 * NOTE: This event is fired only in windows other that the one that
 *       made the change!  Presumably the window that made the change
 *       is already aware of the change.
 *
 *       By listening/reacting to this event, it has the effect of
 *       cross-communicating between windows.
 *
 * @param {string} key the unique key that is monitored for change.
 * @param {function} handler the function to invoke on change.
 *                   API: + handler({oldVal, newVal}): void
 *                          NOTE: uses named parameters!
 */
export function registerDeviceStorageItemChangeHandler(key, handler) {
  // validate our parameters
  const checkParam = check.prefix('registerDeviceStorageItemChangeHandler() parameter violation: ');

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

// monitor Device Storage changes (driving the firing of our registered handlers)
window.addEventListener("storage", (e) => {
  const key    = e.key
  const oldVal = e.oldValue;
  const newVal = e.newValue;

  // interact with our registered handlers
  // console.log(`XX Device Storage Changed - event key: '${key}' changed WAS: '${oldVal}'  NOW: '${newVal}' ... interacting with handlers`);
  const handlers = _handlers[key];
  if (handlers) {
    handlers.forEach( (handler) => handler({oldVal, newVal}) );
  }
});




//***
//*** Abstract the Web Storage API (gracefully no-oping for unsupported browsers)
//***
//***  NOTE 1: This API is synchronous!
//***  NOTE 2: Apparently this API is available on both http (non SSL) as well as https (SSL).
//***

// feature detection
// ... NOTE: can't just assert window.localStorage exists
//           see: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#Feature-detecting_localStorage
const _localStorageAvailable = storageAvailable('localStorage');
function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    let x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch(e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
           // acknowledge QuotaExceededError only if there's something already stored
           (storage && storage.length !== 0);
  }
}

// log warning when deviceStorage is NOT in affect
if (!_localStorageAvailable) {
  console.warn('***WARNING*** deviceStorage module ... localStorage (Web Storage API) is NOT available in this browser ... all deviceStorage usage will silently no-op!!');
}

// our localStorage pass-through that gracefully no-ops for unsupported browsers
const deviceStorage = _localStorageAvailable ? {
  setItem:    (keyName, keyValue) => window.localStorage.setItem(keyName, keyValue),
  getItem:    (keyName)           => window.localStorage.getItem(keyName),
  removeItem: (keyName)           => window.localStorage.removeItem(keyName),
} : {
  setItem:    noOp,
  getItem:    noOp,
  removeItem: noOp,
};

// TEMP crude test of deviceStorage ... invoke these separately!
// deviceStorage.setItem('WowZeeKey', 'WowZeeValue');
// console.log(`test deviceStorage ... '${deviceStorage.getItem('WowZeeKey')}'`);

