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

Because your stores are now persistent, when you re-launch your web
page, it will pick up where you last left off ... **Very Kool
Indeed**!!

> From a usage perspective, **a caution must be given to avoid using
> this mechanism as an application database**!  Neither [Local
> Storage] or svelte stores were intended for this _(for a variety of
> reasons)_.
>
> With that said, **a great use of `persistentStore` is application
> control state**!  For example: a selected theme _(with dark mode)_,
> or a SideBar open/close indicator, etc.  Using a `persistentStore`,
> your state is retained across browser sessions, and the developer
> doesn't even have to think about it ... it just works!

A `key` parameter is configured that serves as the persistent storage
key.  The persisted value is always a string.  Complex store-values
are automatically encoded using a [JSONized] string _(this can be
overridden as needed)_.  In addition the persisted value can be
obfuscated _(for sensitive data)_.

`persistentStore()` encapsulates all the "detailed wiring" needed
to use [App State Retention] in your svelte store, **making it
extremely easy to enable persistent stores**.  This encapsulation
covers the three-fold aspects of 1. svelte store initialization from
persistent storage, 2. auto-syncing svelte store changes to persistent
storage, and 3. auto-syncing changes from the persistent storage to
the svelte store.


<!--- *** Section ************************************************************************* ---> 
## At a Glance

- [Getting Started]
- [API:]
  - [`persistentStore()`]
- [Concepts]
  - [Complex Store Values]
  - [Overriding JSONization (back to strings)]
  - [Breaking a Store into Multiple Persistent Keys]


<!--- *** Section ************************************************************************* ---> 
## Getting Started

Here is a very basic example of using `persistentStore`:

```js
 // our base store (a persistent writable)
 const {subscribe, set} = persistentStore({
   key:   'show',
   store: writable('demo'),
   // safeguard: true, // see BULLET 4. (below)
 });

 // our "public" custom store (with "controlled" setter methods)
 export const show = {
   subscribe,
   showCode: () => set('code'),
   showDemo: () => set('demo'),
 };
```

The `show` store is a simple directive that indicates whether the app
should visualize a **demo** or **code** _(the source code of the
demo)_.  The store-value is a simple string containing either 'demo'
or 'code'.

Let's run our app, with the following URL:

```
https://my-app.org/app/
```

1. Because our store is persistent, you can see the current value in
   [Local Storage].  Open your browser's **DevTools**, and activate the
   "Application" tab.  You will see the new "show" entry _(as defined
   by the `key` parameter - above)_:
 
   **DevTools** "Application" Tab:
   ```
   Key     Value
   =====   ======
   show:   'demo'
   ```
 
2. As you change the store-value, you will see [Local Storage] syncs
   automatically!
 
   **DevTools** "Application" Tab:
   ```
   Key     Value
   =====   ======
   show:   'code'
   ```
 
3. If you re-launch the web page, it will pick up where you last left
   off, because your store is persistent!!
 
4. If you are dealing with sensitive data, activate the `safeguard`
   parameter _(above)_, and you will see that the data is is now
   obfuscated.
 
   **DevTools** "Application" Tab:
   ```
   Key     Value
   =====   ===============
   show:   'afesaZGVtbw=='
   ```

5. If you wish to drive the state from your URL _(rather than [Local
   Storage])_, simply add the following hash to your URL:

   ```
   https://my-app.org/app/#show=code
   ```

   - Now the state is persisted in the URL, rather than [Local
     Storage].  If you change the store-value, the URL will reflect
     this change.

   - This allows you to specify the initial value from the URL itself.
     This is especially useful in things like `iframe` usage.

   - You can also change the hash value in the URL, and it will
     automatically sync to your local svelte store **(very kool)**.

This example just "touches the surface".  There are more options to
consider.  The [Concepts] section covers this in more detail.


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
+ persistentStore({key,
                   store,
                   [safeguard],
                   [encode],
                   [decodeAndSync],
                   [crossCommunicateLocalStorageChanges]}): writable
```

**Parameters:**
_please note that named parameters are used to more easily accommodate
parameter omission (employing the default semantics)_:

- **`key`**: {string | string[]} - the persistent storage key.  

  Normally this will be a single key, but multiple keys can be
  supplied _(i.e. an array of keys)_ when multiple storage units are
  needed for a given svelte store.  When multiple keys are supplied,
  both the `encode` and `decodeAndSync` parameters must also be
  defined, so as to determine the partitioning of the store-value to
  it's keys.  For an example of this, please refer to the [Breaking a
  Store into Multiple Persistent Keys] discussion.

- **`store`**: {[`Writable`]} - the svelte [`Writable`] store
  to be be persisted.  This `store` will be enabled to automatically
  persist it's store-value whenever it changes.

- **`[safeguard]`**: {boolean} - an optional indicator as to whether
  the storage value should be obfuscated (true) or not (false - the
  DEFAULT).  _This is useful when dealing with sensitive data._

  **DEFAULT**: `false`

- **`[encode]`**: {function} - an optional handler that encodes a
  store-value to a string per app-specific requirements.  _This is
  useful when you wish to override the default [JSONization] process
  _(which can be a bit cryptic)_ into a "more user friendly" and
  "human interpretable" string.  This is especially true when [URL
  Hash Storage] is in effect, because it is visible in the URL
  itself._

  **NOTE**: When supplied, **both** `encode` and `decodeAndSync` must
  be provided together.  They are bookends _so to speak_.

  ```js
  + encode(key, storeValue): string
  ```

  Encode the supplied `storeValue` _(in the context of `key`)_ in the
  returned string.  This may be a full or partial representation of
  the `storeValue`, depending on whether the `persistentStore` has one
  or multiple `key`s.

  For examples of this, please refer to the discussions in [Overriding
  JSONization (back to strings)] and [Breaking a Store into Multiple
  Persistent Keys].

  **INTERNALLY**: `setAppStateItem()` will simply pass through this
  "persistent" encoded string _(conditionally performing a safeguard
  as directed)_.

  **DEFAULT**: pass through simple string-based `storeValue`, and
  [JSONize] complex `storeValue`s.

- **`[decodeAndSync]`**: {function} - an optional handler that decodes
  a persistent-value and syncs it to a store, per app-specific
  requirements.  _This is useful for the same reasons given in the
  `encode` parameter._

  **NOTE**: When supplied, **both** `encode` and `decodeAndSync`
  must be provided together.  They are bookends _so to speak_.

  ```js
  + decodeAndSync(key, persistentValue, store): void
  ```

  Decode the supplied `persistentValue` _(in the context of `key`)_
  and sync this to the supplied `store`.  This `persistentValue` may
  be a full or partial representation of the `store`, depending on
  whether the `persistentStore` has one or multiple `key`s.  **HINT**:
  A full representation can sync with a `store.set()`, while a partial
  representation should sync with a `store.update()`.

  For examples of this, please refer to the discussions in [Overriding
  JSONization (back to strings)] and [Breaking a Store into Multiple
  Persistent Keys].

  **DEFAULT**: directly use the `persistentValue` _(reversing any [JSONization])_
  in a store set operation - `store.set(persistentValue)`.

- **`[crossCommunicateLocalStorageChanges]`**: {boolean} - a directive
  to register change handlers for "Local Storage" changes (see: [App
  State Retention])

  For an example of this, please refer to the ?? discussion.

  **DEFAULT**: `false`

**Return:** {[`Writable`]} - as a convenience, the supplied
`store` is returned, supporting chaining.  The "persistent" bindings
have been applied to this `store`.

</ul>


<!--- *** Section ************************************************************************* ---> 
## Concepts

The [Getting Started] section covered a very basic example of
`persistentStore()`.  This section progressively builds additional
concepts and options used in this utility.

- [Complex Store Values]
- [Overriding JSONization (back to strings)]
- [Breaking a Store into Multiple Persistent Keys]


<!--- *** Section ************************************************************************* ---> 
## Complex Store Values

Let's see what happens when our store-value is more complex.  In this
sample we introduce a new store, managing multiple items wrapped in an
object.

```js
// our base store (a persistent writable)
const {subscribe, update} = persistentStore({
  key:   'sidebar',
  store: writable({ 
    isOpen: true,  // the sideBar open/closed state
    width:  300    // the sideBar width
  }),
  // safeguard: true, // see BULLET 4. (below)
});

// our "public" custom store (with "controlled" setter methods)
export const sideBar = {
  subscribe,
  open:     ()      => update( (state) => ({...state, isOpen: true}) ),
  close:    ()      => update( (state) => ({...state, isOpen: false}) ),
  toggle:   ()      => update( (state) => ({...state, isOpen: !state.isOpen}) ),
  setWidth: (width) => update( (state) => ({...state, width}) ),
};
```

You can see that the `sideBar` store-value is an object that contains
two items:

- isOpen: true ... the sideBar open/closed state
- width:  300  ... the sideBar width

As we have seen before, by running our app with no URL hash keys, all
our persistent state will come from [Local Storage].

```
https://my-app.org/app/
```

1. Because our store is persistent, your **DevTools** "Application"
   tab will show the new [Local Storage] "sidebar" entry _(as defined
   by the `key` parameter - above)_:
 
   **DevTools** "Application" Tab:
   ```
   Key       Value
   =======   ===================================
   sidebar:  'asonja{"isOpen":true,"width":400}'
   ```

   You can see that `persistentStore()` **automatically handles
   object-based store-values** through [JSONization].  **Very nice
   indeed**!
 
2. As before, changing the store-value auto syncs the [Local Storage].
 
   **DevTools** "Application" Tab:
   ```
   Key       Value
   =======   ====================================
   sidebar:  'asonja{"isOpen":false,"width":350}'
   ```
 
3. If you re-launch the web page, it will pick up where you last left
   off, because your store is persistent!!

4. As before, if you are dealing with sensitive data, activate the `safeguard`
   parameter _(above)_, and you will see that the data is is now
   obfuscated.
 
   **DevTools** "Application" Tab:
   ```
   Key       Value
   =======   ===================================================
   sidebar:  'afesaYXNvbmpheyJpc09wZW4iOnRydWUsIndpZHRoIjo0MDB9'
   ```

5. Everything is great, until we attempt to drive this state from our
   URL.  The system will actually throw an error if you attempt to
   plug in one of these state values:

   ```
   http://localhost:5000/#sidebar=asonja{"isOpen":false,"width":350}
   ```

   **ERROR**: Unexpected token % in JSON at position 1

   <!--- INTERNAL NOTE *************************************************************************

   - Wow: THIS "safeguarded" JSONIZED state actually works (open REALLY WIDE)
     http://localhost:5000/#sidebar=afesaYXNvbmpheyJpc09wZW4iOnRydWUsIndpZHRoIjo1OTR9

   - Wow: THIS "safeguarded" JSONIZED state ALSO works (closed REALLY WIDE)
     http://localhost:5000/#sidebar=afesaYXNvbmpheyJpc09wZW4iOmZhbHNlLCJ3aWR0aCI6NTk0fQ==
     > with the ADDITIONAL "safeguard" encoding (unsure if it will stay):
     http://localhost:5000/#sidebar=afesaYXNvbmpheyJpc09wZW4iOmZhbHNlLCJ3aWR0aCI6NTk0fQ@E@@E@

    ---> 

   [JSONized] state would require additional encoding in order for it
   to be held in our URL.  

   However, if you think about it doesn't make a lot of sense to
   support this at all.  _**We typically want URL directives to
   be "more user friendly" and "human interpretable"**_.  It is for
   this reason that `persistentStore()` does **NOT** support this.

   There are ways to resolve this issue _(see next example)_.



<!--- *** Section ************************************************************************* ---> 
## Overriding JSONization (back to strings)

As we have seen _from the prior example ([Complex Store Values])_,
the default [JSONization] process is fine for [Local Storage] but is
**NOT** all that great [URL Hash Storage].

As previously mentioned, it doesn't make a lot of sense to use this
obscure JSON syntax in the URL. _**Typically our URL directives
should be "more user friendly" and "human interpretable"**_.

What we need is a way to override the default [JSONization] process,
and get back to a more palatable string.

?? RETRO POINT: %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

Enter the ?? option.


<!--- *** Section ************************************************************************* ---> 
## Breaking a Store into Multiple Persistent Keys

?? TOC

?? RETRO POINT: %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

?? You may need to break a single store-value into multiple persistent
keys.  This supports things like one store aspect to come from a URL
Hash, while the remainder comes from Local Storage.



<!--- *** REFERENCE LINKS ************************************************************************* ---> 
<!---     NOTE: some links are duplicated with alias link label text                                --->

<!--- **tw-themes** ---> 
[Introduction]:              #persistentstore-svelte-store
[Getting Started]:           #getting-started
[API:]:                      #api
  [`persistentStore()`]:     #persistentstore
[Concepts]:                  #concepts
  [Complex Store Values]:    #complex-store-values
  [Overriding JSONization (back to strings)]:       #overriding-jsonization-back-to-strings
  [Breaking a Store into Multiple Persistent Keys]: #breaking-a-store-into-multiple-persistent-keys


<!--- external links ---> 
[`Writable`]:                https://svelte.dev/docs#writable
[App State Retention]:       appStateRetention.js
[URL Hash Storage]:          urlHashStorage.js
[Local Storage]:             localStorage.js
[JSONize]:                   https://www.digitalocean.com/community/tutorials/js-json-parse-stringify
[JSONized]:                  https://www.digitalocean.com/community/tutorials/js-json-parse-stringify
[JSONization]:               https://www.digitalocean.com/community/tutorials/js-json-parse-stringify
