import check           from '../check';
import {isString,
        isBoolean,
        isPlainObject,
        isFunction}    from '../typeCheck';
import {getUrlHashItem,
        updateUrlHashItem,
        isUrlHashItemDefined,
        registerUrlHashItemChangeHandler} from './urlHashStorage';
import {getLocalStorageItem,
        setLocalStorageItem,
        registerLocalStorageItemChangeHandler} from './localStorage';


// *********************************************************
// *** SEE: appStateRetention.md for complete documentation
// *********************************************************

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
