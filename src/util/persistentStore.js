import check                    from './check';
import checkNamedParamStructure from './checkNamedParamStructure';
import {isString,
        isBoolean,
        isPlainObject,
        isSvelteWritable}       from './typeCheck';
import {getAppStateItem,
        setAppStateItem,
        registerAppStateChangeHandler} from './appStateRetention';

// SEE: persistentStore.md for complete documentation
export default function persistentStore(namedParams={}) {

  // validate parameters
  const checkParam = check.prefix('persistentStore() parameter violation: ');

  // ... descturcture our individual namedParams
  const {key,
         store,
         safeguard = false,
         crossCommunicateLocalStorageChanges = false,
         ...unknownNamedArgs} = isPlainObject(namedParams) ? namedParams : {};

  // ... check overall named parameter structure
  checkNamedParamStructure(checkParam, namedParams, arguments, unknownNamedArgs);

  // ... key
  checkParam(key,            'key is required');
  checkParam(isString(key),  'key must be a string');

  // ... store
  checkParam(store,                     'store is required');
  checkParam(isSvelteWritable(store),   'store must be a svelte Writable store');

  // ... safeguard
  checkParam(isBoolean(safeguard), 'safeguard must be a boolean (when supplied), NOT: ', safeguard);

  // ... crossCommunicateLocalStorageChanges
  checkParam(isBoolean(crossCommunicateLocalStorageChanges), 'crossCommunicateLocalStorageChanges must be a boolean (when supplied), NOT: ', crossCommunicateLocalStorageChanges);

  // apply any previously persisted "initial" store-value
  const initialPersistentStoreValue = getAppStateItem(key);
  if (initialPersistentStoreValue !== undefined) {
    store.set(initialPersistentStoreValue);
  }

  // monkey patch value-added set/update store methods to automate persistence whenever the store-value changes
  // ... set()
  const originalSet = store.set;
  store.set = (value) => {
    // original functionality
    originalSet(value);
    // persist
    setAppStateItem(key, value, safeguard);
  };
  // ... update()
  const originalUpdate = store.update;
  store.update = (clientCallback) => {
    const bindCallback = (value) => {
      // client update transformation to newValue
      const newValue = clientCallback(value);
      // persist the newValue
      setAppStateItem(key, newValue, safeguard);
      // expose newValue to svelte
      return newValue;
    };
    // hook into the original update process using our value-added bindCallback
    originalUpdate(bindCallback);
  };

  // sync changes FROM: our persistent storage TO: our local store
  // ... persistent storage can "externally" change, either by:
  //     - the URL Site Hash (by the user) -or- 
  //     - crossCommunicateLocalStorageChanges
  registerAppStateChangeHandler(key, ({newVal}) => {
    console.log(`?? AppStateChangeHandler for persistentStore (key: '${key}'): syncing to:`, {newVal});
    store.set(newVal); // ?? like store.set() better ?? is NEEDED TO HOOK INTO MONKEY-PATCH OF OTHER THINGS (like store-value method retention)
    // ?? ABOVE assumes we have the entire value (this will change when multiple keys are involved)
    // store.update( (state) => updateState({state, persistOpenClosed: newVal}) );
  }, crossCommunicateLocalStorageChanges);

  // that's all folks :-)
  return store;
}
