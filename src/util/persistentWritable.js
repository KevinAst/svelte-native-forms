import check                    from './check';
import checkNamedParamStructure from './checkNamedParamStructure';
import {isString,
        isBoolean,
        isPlainObject,
        isFunction}             from './typeCheck';
import {writable}               from 'svelte/store';
import {getAppStateItem,
        setAppStateItem,
        registerAppStateChangeHandler} from './appStateRetention';

// SEE: persistentWritable.md for complete documentation
export default function persistentWritable(namedParams={}) {

  // validate parameters
  const checkParam = check.prefix('persistentWritable() parameter violation: ');

  // ... descturcture our individual namedParams
  const {key,
         initialFallback,
         startSubscriptionNotifier,
         safeguard = false,
         crossCommunicateLocalStorageChanges = false,
         ...unknownNamedArgs} = isPlainObject(namedParams) ? namedParams : {};

  // ... check overall named parameter structure
  checkNamedParamStructure(checkParam, namedParams, arguments, unknownNamedArgs);

  // ... key
  checkParam(key,            'key is required');
  checkParam(isString(key),  'key must be a string');
  
  // ... initialFallback
  checkParam(initialFallback !== undefined, 'initialFallback is required');

  // ... startSubscriptionNotifier
  if (startSubscriptionNotifier) {
    checkParam(isFunction(startSubscriptionNotifier),  'startSubscriptionNotifier must be a function (when supplied)');
  }

  // ... safeguard
  checkParam(isBoolean(safeguard), 'safeguard must be a boolean (when supplied), NOT: ', safeguard);

  // ... crossCommunicateLocalStorageChanges
  checkParam(isBoolean(crossCommunicateLocalStorageChanges), 'crossCommunicateLocalStorageChanges must be a boolean (when supplied), NOT: ', crossCommunicateLocalStorageChanges);
  
  // define our initial store value
  // ... either previously persisted
  // ... or supplied by client
  const storeValue = getAppStateItem(key) || initialFallback;

  // create our base writable
  const store = writable(storeValue, startSubscriptionNotifier);

  // inject hooks to automate persistence whenever the store changes
  // NOTE: This process DOES DO NOT use a store subscription, so as to NOT
  //       "taint" the subscription count (if needed by our client).
  //       RATHER we simply "front" both the set/update store functions
  //       (the only way the store can change).
  // ... our value-added set function
  const set = (value) => {
    // original functionality
    store.set(value);
    // persist
    setAppStateItem(key, value, safeguard);
  };
  // ... our value-added update function
  const update = (clientCallback) => {
    // our value-added persistCallback
    const persistCallback = (value) => {
      // client update transformation to value
      const newValue = clientCallback(value);
      // persist the newValue
      setAppStateItem(key, newValue, safeguard);
      // expose newValue to svelte
      return newValue;
    };
    // hook into the original update process using our value-added persistCallback
    store.update(persistCallback);
  };
  // ... the persistentStore (with our value-added set/update)
  const persistentStore = {...store, set, update};

  // sync changes in our persistent storage to our local store
  // ... persistent storage can "externally" change, either by:
  //     - the URL Site Hash (by the user) -or- 
  //     - crossCommunicateLocalStorageChanges
  registerAppStateChangeHandler(key, ({newVal}) => {
    console.log(`?? AppStateChangeHandler for persistentWritable store (key: '${key}'): syncing to:`, {newVal});
    persistentStore.set(newVal); // ?? like persistentStore.set() better ?? is NEEDED TO HOOK INTO MONKEY-PATCH OF OTHER THINGS (like store value method retention)
    // ?? ABOVE assumes we have the entire value (this will change when multiple keys are involved)
    // persistentStore.update( (state) => updateState({state, persistOpenClosed: newVal}) );
  }, crossCommunicateLocalStorageChanges);

  // that's all folks :-)
  return persistentStore;
}
