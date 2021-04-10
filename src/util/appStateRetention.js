/**---------------------------- App State Retention --------------------------------------------

   - is the entry point for all app state retention
     ... it "fronts" all other storage APIs
   - uses a combination of "Site Hash" and "Local Device" Storage
     ... see notes (below) for more information on both of these devises
   - these two devices are "mutually exclusive"
     * for a given state key
       - Site Hash storage is used WHEN the user specifies an initial 
         hash value in the URL (for that state key)
       - Device storage is used in all other cases
   - REGARDING local app state:
     * app startup should initialize it's local app state from the retained state
       via `getAppStateItem(key)`, with it's own fallback default (when NOT retained)
     * local app state is maintained in app logic as normal, 
       however in addition to this:
       - local app state changes should be retained via `setAppStateItem(key, val)`
         * NOTE: this should be invoked UNCONDITIONALLY, 
                 - regardless of whether the local-state changed or not
                 - the reason for this is: when Local Device Storage is in-use
                   the "master source" for this state is NOT the one app instance!
                   it can come from multiple instances (in separate windows)
       - in addition, handlers should be registered to react to changes to the retained state
         * updating local app state appropriately
         * this is accomplished via: `registerAppStateChangeHandler(key, handler)`
         * this monitors Site Hash changes (because they can change by the user in the URL)

 *** Site Hash Storage *** ... see: siteHashStorage.js
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

 *** Local Device Storage *** ... see: deviceStorage.js
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
        isPlainObject,
        isFunction}    from './typeCheck';
import {getSiteHashItem,
        updateSiteHashItem,
        registerSiteHashItemChangeHandler} from './siteHashStorage';
import {fetchItem,
        storeItem,
        registerDeviceStorageItemChangeHandler} from './deviceStorage';

/**
 * Return the entry retained in our App State (if any).
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

  // return the requested value (if any)
  // ... site hash takes precedence
  const  value = getSiteHashItem(key) || fetchItem(key);
  return value;
}


/**
 * Set the supplied entry in our App State.
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

  // ... ref
  checkParam(ref,                                 'ref is required');
  checkParam(isString(ref) || isPlainObject(ref), 'ref must be a string -or- an object literal, NOT: ', ref);

  // ... safeguard
  checkParam(isBoolean(safeguard), 'safeguard must be a boolean (true/false), NOT: ', safeguard);

  // retain this entry in our App State
  const inHash = updateSiteHashItem(key, ref, safeguard); // ... site hash takes precedence (updating ONLY if pre-exists in hash)
  if (!inHash) { // ... fallback to Local Device Storage (when site hash is NOT in play)
    storeItem(key, ref, safeguard);
  }
}


/**
 * Register handler when a specific key changes in our AppState.
 *
 * NOTE: We only monitor changes to the URL site hash (see notes at
 *       the top of this module).
 *       
 *       These handlers are fired both when changed by the user (in the URL),
 *       or programmatic changes (via our set/update API above).
 *
 * @param {string} key the unique key that is monitored for change.
 * @param {function} handler the function to invoke on change.
 *                   API: + handler({oldVal, newVal}): void
 *                          NOTE: uses named parameters!
 */
export function registerAppStateChangeHandler(key, handler) {

  // validate our parameters
  const checkParam = check.prefix('registerAppStateChangeHandler() parameter violation: ');

  // ... key
  checkParam(key,           'key is required');
  checkParam(isString(key), 'key must be a string, NOT: ', key);

  // ... handler
  checkParam(handler,             'handler is required');
  checkParam(isFunction(handler), 'handler must be a function, NOT: ', handler);

  // register the handler
  // ... simply pass through to the URL site hash registration
  registerSiteHashItemChangeHandler(key, handler);
  // ... for fun sync Local Device Storage, to see changes cross-window
  //     NOTE: We don't really want to do this:
  //           IT IS PROBLEMATIC for the following reasons:
  //           1. By doing this at the appStateRetention level,
  //              it doesn't distinguish between changes of:
  //                * "Site Hash Storage"
  //                * "Local Device Storage"
  //              IN OTHER WORDS: a change to Device Storage 
  //              is globally propagated to ALL window instances
  //           2. it is possible to get in an infinite loop (thrashing between windows)
  //              unsure about this, but I have seen it happen
  //           With that said: it is really fun to see the cross-communication between windows
  // registerDeviceStorageItemChangeHandler(key, handler);
}
