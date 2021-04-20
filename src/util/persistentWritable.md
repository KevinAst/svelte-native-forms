# persistentWritable svelte store

`persistentWritable()` is a thin layer on top of [svelte `writable()`]
that persists the store value.  The store is automatically persisted
whenever it's value changes.

The persistence mechanism employs the [App State Retention]
philosophy, meaning that either [URL Hash Storage] is used _when the
designated key is specified in the URL hash_, or the browser's [Local
Storage] is employed _in all other cases_.  This provides the
flexibility of directing the initial store state from the URL _(when
desired)_.

A supplied `key` serves as the storage key.  By default the store
value is [JSONized], but can be overridden.


<!--- *** Section ************************************************************************* ---> 
## At a Glance

- [Getting Started]
- [API:]
  - [`persistentWritable({key, initialFallback, \[startSubscriptionNotifier\]}): writable`]
- [Examples]
  - [Doo Dee Doo]


<!--- *** Section ************************************************************************* ---> 
## Getting Started

?? review basic example with all the defaults

?? discuss concepts of where to put the state

<!--- *** Section ************************************************************************* ---> 
## API:


<!--- *** Section ************************************************************************* ---> 
## `persistentWritable()`

<ul><!--- indentation hack for github - other attempts with style is stripped (be careful with number bullets) ---> 

The `persistentWritable()` function creates a [svelte `writable()`]
store that is persistent _(please refer to the [Introduction] for a
complete description)_.

**API:**

```js
+ persistentWritable({key, initialFallback, [startSubscriptionNotifier]}): writable
```

**Parameters:**
_note that named parameters are used (unlike [svelte `writable()`]) so
as to easily accommodate parameter omission (employing default
semantics)_:

- **`key`**: {string} - the persistent storage key.

- **`initialFallback`**: {any} - the initial store value _(same as in
  [svelte `writable()`])_, **except** used only as a **fallback - when
  NOT previously persisted**.

- **`[startSubscriptionNotifier]`**: {function} - the optional
  subscription start/stop notification callback (same as [svelte
  `writable()`]).

  **DEFAULT**: none _(i.e. not used)_

- **`[safeguard]`**: {boolean} - an indicator as to whether the
  storage value should be obfuscated (true) or not (false - the
  DEFAULT).

  **DEFAULT**: `false`

- **`[crossCommunicateLocalStorageChanges]`**: {boolean} - a directive
  to register change handlers for "Local Storage" changes (see: [App
  State Retention])

  **DEFAULT**: `false`

**Return:** {`writable`} - a "persistent" svelte writable store.

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
[Introduction]:              #persistentwritable-svelte-store
[Getting Started]:           #getting-started
[API:]:                      #api
  <!--- NOTE: each function supports different link labels (with and without API)  ---> 
  [`persistentWritable()`]:  #persistentwritable
  [`persistentWritable({key, initialFallback, \[startSubscriptionNotifier\]}): writable`]: #persistentwritable
[Examples]:                  #examples
  [Doo Dee Doo]:             #doo-dee-doo

<!--- external links ---> 
[svelte `writable()`]:       https://svelte.dev/docs#writable
[App State Retention]:       appStateRetention.js
[URL Hash Storage]:          urlHashStorage.js
[Local Storage]:             localStorage.js
[JSONized]:                  https://www.digitalocean.com/community/tutorials/js-json-parse-stringify
