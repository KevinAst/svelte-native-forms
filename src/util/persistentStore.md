# persistentStore svelte store

`persistentStore()` is a thin layer on top of the svelte [`Writable`]
that persists the store-value.  The store is automatically persisted
whenever it's store-value changes.

The persistence mechanism employs the [App State Retention]
philosophy, meaning that either [URL Hash Storage] is used _when the
designated key is specified in the URL hash_, or the browser's [Local
Storage] is employed _in all other cases_.  This provides the
flexibility of directing the initial store state from the URL _(when
desired)_.

A supplied `key` serves as the storage key.  By default, the persisted
value is a string, which can be a simple string or a [JSONized] string
for more complex structures (JSON usage can be overridden as needed).


<!--- *** Section ************************************************************************* ---> 
## At a Glance

- [Getting Started]
- [API:]
  - [`persistentStore({key, initialFallback, \[startSubscriptionNotifier\]}): writable`]
- [Examples]
  - [Doo Dee Doo]


<!--- *** Section ************************************************************************* ---> 
## Getting Started

?? review basic example with all the defaults

?? discuss concepts of where to put the state

<!--- *** Section ************************************************************************* ---> 
## API:


<!--- *** Section ************************************************************************* ---> 
## `persistentStore()`

<ul><!--- indentation hack for github - other attempts with style is stripped (be careful with number bullets) ---> 

`persistentStore()` binds the supplied svelte [`Writable`] `store`,
making it persistent.  _Please refer to the [Introduction] for a more
complete description_.

**API:**

```js
+ persistentStore({key, initialFallback, [startSubscriptionNotifier]}): writable
```

**Parameters:**
_please note that named parameters are used to more easily accommodate
parameter omission (employing default semantics)_:

- **`key`**: {string} - the persistent storage key.

- **`store`**: {[`Writable`]} - the svelte [`Writable`] store
  to be be persisted.  This `store` will be enabled to automatically
  persist it's store-value whenever it changes.

- **`[safeguard]`**: {boolean} - an indicator as to whether the
  storage value should be obfuscated (true) or not (false - the
  DEFAULT).

  **DEFAULT**: `false`

- **`[crossCommunicateLocalStorageChanges]`**: {boolean} - a directive
  to register change handlers for "Local Storage" changes (see: [App
  State Retention])

  **DEFAULT**: `false`

**Return:** {[`Writable`]} - as a convenience, the supplied
 `store` is returned, supporting chaining.  The "persistent" bindings
 have been applied to this `store`.

</ul>


<!--- *** Section ************************************************************************* ---> 
## Examples

?? introduce various samples

- [Doo Dee Doo]



<!--- *** Section ************************************************************************* ---> 
## Doo Dee Doo

<ul><!--- indentation hack for github - other attempts with style is stripped (be careful with number bullets) ---> 

?? describe this sample



<!--- *** REFERENCE LINKS ************************************************************************* ---> 
<!---     NOTE: some links are duplicated with alias link label text                                --->

<!--- **tw-themes** ---> 
[Introduction]:              #persistentstore-svelte-store
[Getting Started]:           #getting-started
[API:]:                      #api
  <!--- NOTE: each function supports different link labels (with and without API)  ---> 
  [`persistentStore()`]:     #persistentstore
  [`persistentStore({key, initialFallback, \[startSubscriptionNotifier\]}): writable`]: #persistentstore
[Examples]:                  #examples
  [Doo Dee Doo]:             #doo-dee-doo

<!--- external links ---> 
[`Writable`]:                https://svelte.dev/docs#writable
[App State Retention]:       appStateRetention.js
[URL Hash Storage]:          urlHashStorage.js
[Local Storage]:             localStorage.js
[JSONized]:                  https://www.digitalocean.com/community/tutorials/js-json-parse-stringify
