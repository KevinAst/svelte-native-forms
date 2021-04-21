import check               from './check';
import {isPlainObject,
        isFunction,
        isSvelteWritable}  from './typeCheck';
import {get}               from 'svelte/store';

/**
 * Bind "value" methods into the supplied svelte `Writable` store.
 * 
 * Have you ever wanted to have methods in a store-value?  I know this
 * is somewhat "unconventional", but I have found it to be extremely
 * useful.  In svelte, there are techniques to encapsulate business
 * logic in store methods (using custom stores), so WHY NOT in the
 * store-value itself?
 * 
 * As a simple example, consider this: `$myStore.isOpen()` and/or
 * `$myStore.isClosed()`.  These methods encapsulate business logic,
 * reasoning about the internal state of the store-value, rather than
 * requiring the app to have this knowledge (repeated throughout the
 * application).
 * 
 * In the past I have introduced store-value methods in application code,
 * but it was always difficult (and cumbersome) to insure the methods
 * were maintained correctly on store set() and update() operations.
 * This utility makes the process **seamless**.
 * 
 * This is accomplished by injecting hooks in the store's set/update
 * functions that maintain the store-value methods.  As a result,
 * application logic never has to worry about this tedious task.  In
 * other words the application logic focuses strictly on the data
 * within the store-value.
 *
 * **Example**:
 *
 * ```js
 *  const store = bindStoreValueMethods( writable({show: 'demo'}), {
 *    // NOTE: by reasoning over non-default (i.e. 'code'),
 *    //       we DEFAULT all unknown values to the desired 'demo' fallback
 *    isShowingCode() { return this.show === 'code' ? true : false; }, 
 *    isShowingDemo() { return !this.isShowingCode(); },
 *  });
 * ```
 *
 * @param {Writable} store - the svelte `Writable` store whose
 * store-value is to be bound to the supplied `methods`.  The
 * store-value MUST BE a plain object, in order to bind the methods.
 *
 * @param {Object} methods - the methods to bind ... a plain
 * object with name/method (key/value) pairs.  **NOTE** If the
 * the methods access value state (through a `this` reference),
 * they **cannot** be arrow functions.
 * 
 * @return {SvelteStore} as a convenience, the supplied store is
 * returned, supporting chaining.
 */
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
