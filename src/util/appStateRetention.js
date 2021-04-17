/**---------------------------- App State Retention --------------------------------------------

   - is the entry point for all app state retention
     ... it "fronts" all other storage APIs
   - uses a combination of "URL Hash Storage" and "Local Storage"
     ... see notes (below) for more information on both of these devises
     ... "URL Hash Storage" takes precedence
   - these two devices are "mutually exclusive"
     * for a given state key
       - URL Hash storage is used WHEN the user specifies an initial 
         hash value in the URL (for that state key)
       - Local Storage is used in all other cases
   - REGARDING local app state:
     1. app startup should initialize it's local app state from the retained state
        via `getAppStateItem(key)`, with an app's own fallback default (when NOT retained)
     2. local app state is maintained in app logic as normal,
        HOWEVER in addition to this:
        2a. local app state changes should be synced via `setAppStateItem(key, val)`
            NOTE: this should be invoked UNCONDITIONALLY, 
                  - regardless of whether the local-state changed or not
                  - the reason for this is: when Local Storage is in-use
                    the "master source" for this state is NOT the one app instance!
                    it can come from multiple instances (in separate windows)
        2b. in addition, handlers should be registered to react to changes to the retained state
            - updating local app state appropriately
            - this is accomplished via: `registerAppStateChangeHandler()`
            - this monitors storage changes (they can change externally)

 *** URL Hash Storage *** ... see: urlHashStorage.js
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

 *** Local Storage *** ... see: localStorage.js
   - REPRESENTS a browser storage device that is global to the domain of the URL (a combination of protocol://host:port)
     ... in other words this storage is globally available to ALL windows of the same domain.
   - all access is programmatic, so the end-user cannot specify (as they can for URL Hash Storage)
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
        isPlainObject,
        isFunction}    from './typeCheck';
import {getUrlHashItem,
        updateUrlHashItem,
        isUrlHashItemDefined,
        registerUrlHashItemChangeHandler} from './urlHashStorage';
import {getLocalStorageItem,
        setLocalStorageItem,
        registerLocalStorageItemChangeHandler} from './localStorage';

/**
 * Return the specified entry retained in our App State (if any).
 *
 * @param {string} key the unique key that catalogs this entry.
 * 
 * @return {string|jsonObj} the entry retained in our app (undefined
 * for none), implicitly unpacked to the original ref (supplied to
 * `setAppStateItem()`).
 */
export function getAppStateItem(key) {

  // validate our parameters
  const checkParam = check.prefix('getAppStateItem() parameter violation: ');

  // ... key
  checkParam(key,           'key is required');
  checkParam(isString(key), 'key must be a string, NOT: ', key);
  _keysInUse[key] = key;

  // return the requested value (if any)
  // ... url hash takes precedence
  const  value = getUrlHashItem(key) || getLocalStorageItem(key);
  return value;
}


/**
 * Set the supplied entry in our App State.  
 * 
 * Remember "URL Hash Storage" takes precedence over "Local Storage"
 * (when it pre-exists in the URL)
 *
 * @param {string} key the unique key that catalogs this entry.
 * @param {string|jsonObj} ref the reference to store.
 * @param {boolean} [safeguard=false] an indicator as to whether the
 * entry should be obfuscated (true) or not (false - the DEFAULT).
 */
export function setAppStateItem(key, ref, safeguard=false) {

  // validate our parameters
  const checkParam = check.prefix('setAppStateItem() parameter violation: ');

  // ... key
  checkParam(key,           'key is required');
  checkParam(isString(key), 'key must be a string, NOT: ', key);
  _keysInUse[key] = key;

  // ... ref
  checkParam(ref,                                 'ref is required');
  checkParam(isString(ref) || isPlainObject(ref), 'ref must be a string -or- an object literal, NOT: ', ref);

  // ... safeguard
  checkParam(isBoolean(safeguard), 'safeguard must be a boolean (true/false), NOT: ', safeguard);

  // retain this entry in our App State
  const inHash = updateUrlHashItem(key, ref, safeguard); // ... URL Hash takes precedence (updating ONLY if pre-exists in hash)
  if (!inHash) { // ... fallback to Local Storage (when URL Hash is NOT in play)
    setLocalStorageItem(key, ref, safeguard);
  }
}


/**
 * Register handler when a specific key changes in our AppState.
 *
 * This registration is a convenient way to synchronize the local app
 * state, when the underlying storage changes externally.
 *
 * This will register the supplied handler for either "URL Hash" or
 * "Local Storage" changes, based on whether the specified key is part
 * of the "URL HASH" or not.  In other words these two registrations
 * are mutually exclusive.
 * 
 * NOTE 1: Remember, a "URL Hash" handler is fired not only on
 *         programmatic changes, but also external changes (when the
 *         user changes the hash value in their URL).
 * 
 *         As a result, this handler is a convenient way to
 *         synchronize the local app state.
 * 
 * NOTE 2: Remember, a "Local Storage" handler is "in essence" a
 *         technique to cross-communicate between windows
 *         (i.e. processes), because it is fired only in windows other
 *         than the one that made the change!
 *         
 *         For this reason it is rarely used.  As a result, to
 *         register a "Local Storage" change handlers, you must
 *         explicitly request this by setting the optional
 *         `crossCommunicateLocalStorageChanges` parameter to `true`.
 *
 *         CAUTION: Be careful enabling "Local Storage" handlers that
 *                  are triggered by rapid-fire events (such a mouse
 *                  drag operations).  Because of the cross-process
 *                  synchronization this can cause an osculating
 *                  back-and-forth series of events that result in an
 *                  infinite thrashing process.
 *
 *                  If you find yourself in this situation, consider:
 *                   - Throttling or Debouncing
 *                     * Throttling: a reduction of the trigger rate
 *                     * Debouncing: ZERO trigger rate until a period of calm
 *
 * @param {string} key the unique key that is monitored for change.
 * @param {function} handler the function to invoke on change.
 *                   API: + handler({oldVal, newVal}): void
 *                          NOTE: The `handler` API uses named parameters!
 * @param {boolean} [crossCommunicateLocalStorageChanges=false] a
 * directive to register "Local Storage" handlers when appropriate.
 * By DEFAULT, this is `false`.  Please refer to "NOTE 2" (above).
 */
export function registerAppStateChangeHandler(key, handler, crossCommunicateLocalStorageChanges=false) {

  // validate our parameters
  const checkParam = check.prefix('registerAppStateChangeHandler() parameter violation: ');

  // ... key
  checkParam(key,           'key is required');
  checkParam(isString(key), 'key must be a string, NOT: ', key);
  _keysInUse[key] = key;

  // ... handler
  checkParam(handler,             'handler is required');
  checkParam(isFunction(handler), 'handler must be a function, NOT: ', handler);

  // ... crossCommunicateLocalStorageChanges
  checkParam(isBoolean(crossCommunicateLocalStorageChanges),
             'crossCommunicateLocalStorageChanges must be a boolean (true/false), NOT: ', crossCommunicateLocalStorageChanges);

  // register the handler per specification (see docs)
  if (isUrlHashItemDefined(key)) {
    // console.log(`XX registerAppStateChangeHandler('${key}') ... registering "URL Hash Storage" handler (per prior existence in URL)`);
    registerUrlHashItemChangeHandler(key, handler);
  }
  else if (crossCommunicateLocalStorageChanges) {
    // console.log(`XX registerAppStateChangeHandler('${key}') ... registering "Local Storage" handler (per confirmation parameter)`);
    registerLocalStorageItemChangeHandler(key, handler);
  }
}


/**
 * Return the active URL with full hash options, gleaned from ALL
 * persistent keys that are currently in-use (both "Hash Storage" and
 * "Local Storage" keys).
 * 
 * This is useful when devising a URL to be used in an embedded iframe.
 * You can "prune" it to the desired key directives 
 *
 * EX: https://svelte-native-forms.js.org/app/#theme=Teal-dark&sidebar=open&sidebarw=229&show=code
 * 
 * TODO: Fully flesh out a usage pattern for getActiveUrlWithFullHash()
 *       EX: - this API could return an array of active hash key/value pairs
 *           - promote an "embed URL" dropdown options somewhere
 *             * use a dialog to allow the user to select the options in-use
 *             * provide ability to auto-generate a: URL, b: embedded iframe
 * 
 * @return {string} the active URL (with full hash options).
 */
export function getActiveUrlWithFullHash() {
  let delim = '';
  const urlStr = Object.keys(_keysInUse).reduce( (accum, key) => {
    accum += `${delim}${key}=${getAppStateItem(key)}`;
    delim = '&';
    return accum;
  }, `${location.href.replace(location.hash,'')}#`);
  console.log(`getUrlWithFullHash(): ${urlStr}`);
  return urlStr;
}

// keys in-use (needed by getUrlWithFullHash())
const _keysInUse = {
  // "key1": "key1",
  // "key2": "key21",
  // ...
};
