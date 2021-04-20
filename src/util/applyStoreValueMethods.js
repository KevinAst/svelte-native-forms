import check           from './check';
import {isPlainObject,
        isFunction}    from './typeCheck';

/**
 * Apply "value" methods into the supplied svelte store.
 * 
 * I know this is somewhat unconventional, but I LIKE IT!
 *
 * This is accomplished by monkey patching in value-added set/update
 * store methods that maintains the store value methods.
 *
 * @param {SvelteStore} store - the svelte store to apply.
 *
 * @param {Object} methods - the methods to apply ... a plain
 * object with name/method (key/value) pairs.
 * 
 * @return {SvelteStore} the supplied store.
 */
export default function applyStoreValueMethods(store, methods) {

  // validate parameters
  const checkParam = check.prefix('applyStoreValueMethods() parameter violation: ');

  // ... store
  checkParam(store, 'store is required');
  checkParam(store.subscribe && store.set && store.update,  'store must be svelte store');

  // ... methods
  checkParam(methods,                 'methods is required');
  checkParam(isPlainObject(methods),  'methods must be a plain object with name/method (key/value) pairs');

  // monkey patch in value-added set/update store methods to maintain the store value methods
  // ... set()
  const originalSet = store.set;
  store.set = (value) => {
    const valueWithMethods = {...value, ...methods};
    // console.log(`XX IN applyStoreValueMethods() ... value-added set() to maintain our store value methods: `, {before: value, after: valueWithMethods});
    originalSet(valueWithMethods);
  };
  // ... update()
  const originalUpdate = store.update;
  store.update = (clientCallback) => {
    const applyCallback = (value) => {
      // apply client transformation to value
      const newValue = clientCallback(value);
      // insure our methods are in-tact
      const newValueWithMethods = {...newValue, ...methods};
      // console.log(`XX IN applyStoreValueMethods() ... value-added update() to maintain our store value methods: `, {before: newValue, after: newValueWithMethods});
      // expose newValueWithMethods to svelte
      return newValueWithMethods;
    };
    // hook into the original update process using our value-added applyCallback
    originalUpdate(applyCallback);
  };
  
  // apply the store-value methods to accommodate bootstrap startup
  // - this is a protective measure in case the initial store value
  //   DOES NOT contain the methods
  // - this WILL be the case when initialized from persistent storage
  //   BECAUSE methods are NOT serialized to persistent storage
  // console.log(`XX IN applyStoreValueMethods() ... BEFORE initial apply`);
  store.update( (value) => value);
  // console.log(`XX IN applyStoreValueMethods() ... AFTER initial apply`);

  // that's all folks :-)
  return store;
}
