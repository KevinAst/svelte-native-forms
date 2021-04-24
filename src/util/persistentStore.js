import check                    from './check';
import checkNamedParamStructure from './checkNamedParamStructure';
import {isString,
        isBoolean,
        isArray,
        isPlainObject,
        isFunction,
        isSvelteWritable}       from './typeCheck';
import {getAppStateItem,
        setAppStateItem,
        registerAppStateChangeHandler} from './appStateRetention';

// SEE: persistentStore.md for complete documentation
export default function persistentStore(namedParams={}) {

  // validate parameters
  const checkParam = check.prefix('persistentStore() parameter violation: ');

  // ... descturcture our individual namedParams
  const {key: keyParam, // internal variable: `keyParam` ... renamed from public `key`
         store,
         safeguard = false,
         encode=DEFAULT_encode,
         decodeAndSync=DEFAULT_decodeAndSync,
         crossCommunicateLocalStorageChanges = false,
         ...unknownNamedArgs} = isPlainObject(namedParams) ? namedParams : {};

  // ... check overall named parameter structure
  checkNamedParamStructure(checkParam, namedParams, arguments, unknownNamedArgs);

  // ... key
  checkParam(keyParam,                                 'key is required');
  checkParam(isString(keyParam) || isArray(keyParam),  'key must be a string or a string[]');
  const keys = isString(keyParam) ? [keyParam] : keyParam; // ... for consistency, we use keys (plural) from this point on
  keys.forEach( (key) => checkParam(isString(key),     'key array must contain ALL strings') );
  const multiKey = keys.length===1 ? false : true;     // ... convenience used in encode/decodeAndSync checks

  // ... store
  checkParam(store,                     'store is required');
  checkParam(isSvelteWritable(store),   'store must be a svelte Writable store');

  // ... safeguard
  checkParam(isBoolean(safeguard), 'safeguard must be a boolean (when supplied), NOT: ', safeguard);

  // ... encode
  checkParam(isFunction(encode), 'encode must be a function (when supplied)');

  // ... decodeAndSync
  checkParam(isFunction(decodeAndSync), 'decodeAndSync must be a function (when supplied)');

  // ... encode/decodeAndSync COMBINATIONS
  const isEncodeSupplied = encode        !== DEFAULT_encode;
  const isDecodeSupplied = decodeAndSync !== DEFAULT_decodeAndSync;
  checkParam(isEncodeSupplied===isDecodeSupplied, 'one of either encode or decodeAndSync were supplied without the other ... they BOTH must be provided together (they are bookends)');
  if (multiKey) {
    checkParam(isEncodeSupplied && isDecodeSupplied, 'multiple keys MUST have an app-specific non-defaulted encode/decodeAndSync');
  }

  // ... crossCommunicateLocalStorageChanges
  checkParam(isBoolean(crossCommunicateLocalStorageChanges), 'crossCommunicateLocalStorageChanges must be a boolean (when supplied), NOT: ', crossCommunicateLocalStorageChanges);

  // apply any previously persisted "initial" store-value
  keys.forEach( (key) => {
    const initialPersistentStoreValue = getAppStateItem(key);
    if (initialPersistentStoreValue !== undefined) {
      decodeAndSync(key, initialPersistentStoreValue, store);
    }
  });

  // monkey patch value-added set/update store methods to automate persistence whenever the store-value changes
  // ... set()
  const originalSet = store.set;
  store.set = (storeValue) => {
    // original functionality
    originalSet(storeValue);
    // persist
    keys.forEach( (key) => {
      setAppStateItem(key, encode(key, storeValue), safeguard);
    });
  };
  // ... update()
  const originalUpdate = store.update;
  store.update = (clientCallback) => {
    const bindCallback = (storeValue) => {
      // client update transformation to newStoreValue
      const newStoreValue = clientCallback(storeValue);
      // persist the newStoreValue
      keys.forEach( (key) => {
        setAppStateItem(key, encode(key, newStoreValue), safeguard);
      });

      // expose newStoreValue to svelte
      return newStoreValue;
    };
    // hook into the original update process using our value-added bindCallback
    originalUpdate(bindCallback);
  };

  // sync changes FROM: our persistent storage TO: our local store
  // ... persistent storage can "externally" change, either by:
  //     - the URL Site Hash (by the user) -or- 
  //     - crossCommunicateLocalStorageChanges
  keys.forEach( (key) => {
    registerAppStateChangeHandler(key, ({newVal: persistentStoreValue}) => {
      // console.log(`XX AppStateChangeHandler for persistentStore (key: '${key}'): syncing to:`, {persistentStoreValue});
      decodeAndSync(key, persistentStoreValue, store);
    }, crossCommunicateLocalStorageChanges);
  });

  // that's all folks :-)
  return store;
}

// default implementation for `encode` parameter
// NOTEs: in this DEFAULT usage semantics:
//        1. there is NO NEED for key
//           ... there is only ONE key by default
//        2. there is NO NEED to encode
//           ... we merely pass it through untouched
//           ... the Storage encoder already handles svelte stores VIA JSONization
function DEFAULT_encode(key, storeValue) {
  return storeValue;
}

// default implementation for `decodeAndSync` parameter
// NOTEs: in this DEFAULT usage semantics:
//        1. there is NO NEED for key
//           ... there is only ONE key by default
//        2. there is NO NEED to decode
//           ... it is already in the format that is handled by the Storage decode util
function DEFAULT_decodeAndSync(key, persistentValue, store) {
  store.set(persistentValue);
}
