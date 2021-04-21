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
for more complex structures _(JSON usage can be overridden as needed)_.


<!--- *** Section ************************************************************************* ---> 
## At a Glance

- [Usage]
- [API:]
  - [`persistentStore()`]
- [Examples]
  - [Doo Dee Doo]


<!--- *** Section ************************************************************************* ---> 
## Usage

From a usage perspective, I would caution against using this as an
application database.  Neither [Local Storage] or svelte stores were
intended for that _(for a variety of reasons)_.

With that said, a great use of `persistentStore` is application
control state.  For example: a selected theme _(with dark mode)_, or a
SideBar open/close indicator, etc.  Using a `persistentStore`, your
state is retained across browser sessions, and the developer doesn't
even have to think about it ... it just works!

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
 
3. If you re-launch the web page, it will pick up where you left off,
   because your store is persistent!!
 
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

This example is just the tip of the iceberg.  There are many more
options to consider.  The [Examples] section covers this in more
detail.


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
+ persistentStore({key, store, [safeguard], [crossCommunicateLocalStorageChanges]}): writable
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

We have covered a very basic example in the [Usage] section.  The
samples in this section progressively build on additional options of
`persistentStore()`.

- [Doo Dee Doo]
- ?? Complex Store Values (default to JSONization) ... move on to SideBar.svelte  #sidebar=open/closed&sidebarw=300
- ?? Overriding JSONization (back to strings) ... The default JSONization is fine for Local Storage, but may not be all that great for URL Hashes (it works but is a bit ugly).
- ?? Breaking a Store into Multiple States ... You may need to break a single store-value into multiple persistent keys.  This supports things like one store aspect to come from a URL Hash, while the remainder comes from Local Storage.


<!--- *** Section ************************************************************************* ---> 
## Doo Dee Doo

<ul><!--- indentation hack for github - other attempts with style is stripped (be careful with number bullets) ---> 

?? describe this sample

</ul>


<!--- *** REFERENCE LINKS ************************************************************************* ---> 
<!---     NOTE: some links are duplicated with alias link label text                                --->

<!--- **tw-themes** ---> 
[Introduction]:              #persistentstore-svelte-store
[Usage]:                     #usage
[API:]:                      #api
  [`persistentStore()`]:     #persistentstore
[Examples]:                  #examples
  [Doo Dee Doo]:             #doo-dee-doo

<!--- external links ---> 
[`Writable`]:                https://svelte.dev/docs#writable
[App State Retention]:       appStateRetention.js
[URL Hash Storage]:          urlHashStorage.js
[Local Storage]:             localStorage.js
[JSONized]:                  https://www.digitalocean.com/community/tutorials/js-json-parse-stringify
