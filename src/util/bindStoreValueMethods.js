import check               from './check';
import {isPlainObject,
        isFunction,
        isSvelteWritable}  from './typeCheck';
import {get}               from 'svelte/store';


// *************************************************************
// *** SEE: bindStoreValueMethods.md for complete documentation
// *************************************************************


export default function bindStoreValueMethods(store, methods) {

  // validate parameters
  const checkParam = check.prefix('bindStoreValueMethods() parameter violation: ');

  // ... store
  checkParam(store,                     'store is required');
  checkParam(isSvelteWritable(store),   'store must be a svelte Writable store');
  checkParam(isPlainObject(get(store)), 'store-value must be a plain object - in order to bind the methods');

  // ... methods
  checkParam(methods,                'methods is required');
  checkParam(isPlainObject(methods), 'methods must be a plain object with name/method (key/value) pairs');

  // monkey patch value-added set/update store methods to maintain the store-value methods
  // ... set()
  const originalSet = store.set;
  store.set = (value) => {
    const valueWithMethods = {...value, ...methods};
    // console.log(`XX IN bindStoreValueMethods() ... value-added set() to maintain our store-value methods: `, {before: value, after: valueWithMethods});
    originalSet(valueWithMethods);
  };
  // ... update()
  const originalUpdate = store.update;
  store.update = (clientCallback) => {
    const bindCallback = (value) => {
      // bind client transformation to value
      const newValue = clientCallback(value);
      // insure our methods are in-tact
      const newValueWithMethods = {...newValue, ...methods};
      // console.log(`XX IN bindStoreValueMethods() ... value-added update() to maintain our store-value methods: `, {before: newValue, after: newValueWithMethods});
      // expose newValueWithMethods to svelte
      return newValueWithMethods;
    };
    // hook into the original update process using our value-added bindCallback
    originalUpdate(bindCallback);
  };
  
  // do an "initial" binding of the store-value methods to accommodate
  // the bootstrap startup process
  // - this is a protective measure in case the initial store-value
  //   DOES NOT contain the methods
  // - this WILL be the case when initialized from persistent storage
  //   BECAUSE methods are NOT serialized to persistent storage
  // console.log(`XX IN bindStoreValueMethods() ... BEFORE initial bind`);
  store.update( (value) => value);
  // console.log(`XX IN bindStoreValueMethods() ... AFTER initial bind`);

  // that's all folks :-)
  return store;
}
