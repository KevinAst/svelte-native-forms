# App State Retention

This utility promotes a set of functions that facilitate **App State
Retention**.  By retaining app state, when your app is restarted, it
will pick up where you last left off.

The promoted functions are considered to be the entry point for all
**App State Retention**, because they "front" all other storage APIs.
In other words, these functions are a thin layer on top of the other
APIs.

A key aspect of this utility is that both [URL Hash Storage] and
[Local Storage] are supported.  These storage devices are mutually
exclusive.

The [URL Hash Storage] takes precedence, and is used when the URL
**initially** contains the entry in question.  Otherwise it falls back
to [Local Storage].  This is a **novel idea** that places the client
user in control of this heuristic.  As an example, a URL Hash is
useful in an iframe context _(where you may want to specify various
characteristics)_.

The utility promotes both get and set functions.  It also supports a
two-way binding, through an event handler registration process.  Not
only can local state changes be persisted, but synchronization of
storage changes can be synced back to local state (for example when
the changes a URL Hash entry).


<!--- *** Section ************************************************************************* ---> 
## At a Glance

- [Usage]
- [URL Hash Syntax]
- [API:]
  - [`getAppStateItem(key): any`]
  - [`setAppStateItem(key, ref, \[safeguard\]): void`]
  - [`registerAppStateChangeHandler(key, handler, \[crossCommunicateLocalStorageChanges\]): void`]
  - [`getActiveUrlWithFullHash(): string`]


<!--- *** Section ************************************************************************* ---> 
## Usage

In order to make your app state persistent, consider the following
points:

1. App startup should initialize it's local app state from the
   retained state via [`getAppStateItem()`], with an app's own
   fallback default _(when NOT retained)_

2. Local app state is maintained in app logic as normal,
   however, in addition:

   - 2a. Local app state changes should be synced via [`setAppStateItem()`]

     NOTE: this should be invoked UNCONDITIONALLY:
     
     - Regardless of whether the local-state changed or not

     - The reason for this is: when Local Storage is in-use the
       "master source" for this state is NOT the one app instance!  it
       can come from multiple instances (in separate windows)

   - 2b. In addition, handlers should be registered to react to changes
     to the retained state

     - updating local app state appropriately
     - this is accomplished via: [`registerAppStateChangeHandler()`]
     - this monitors storage changes (they can change externally)


<!--- *** Section ************************************************************************* ---> 
## URL Hash Syntax

When specifying persistent entries in the URL, use the following
syntax:

**Example:**

```
https://svelte-native-forms.js.org/app/#theme=Teal-dark&sidebar=open&sidebarw=229&show=code
```

1. start out with a hash tag (#) at the end of the URL
2. each entry is a `key=value` pair
3. multiple entries are delineated with the ampersand (&)



<!--- *** Section ************************************************************************* ---> 
## API:

- [`getAppStateItem(key): any`]
- [`setAppStateItem(key, ref, \[safeguard\]): void`]
- [`registerAppStateChangeHandler(key, handler, \[crossCommunicateLocalStorageChanges\]): void`]
- [`getActiveUrlWithFullHash(): string`]


<!--- *** Section ************************************************************************* ---> 
## `getAppStateItem()`


<ul><!--- indentation hack for github - other attempts with style is stripped (be careful with number bullets) ---> 

Return the specified entry retained in our App State (if any).

**API:**

```js
+ getAppStateItem(key): any
```

**Parameters:**

- **`key`**: {string} - the unique key that catalogs this entry.

**Return:** {any} - the original entry retained in the set
operation, if any (undefined for none), implicitly unpacked to it's
original state.

</ul>




<!--- *** Section ************************************************************************* ---> 
## `setAppStateItem()`

<ul><!--- indentation hack for github - other attempts with style is stripped (be careful with number bullets) ---> 

Set the supplied entry in our App State.

Remember "URL Hash Storage" takes precedence over "Local Storage"
(when it pre-exists in the URL)

**API:**

```js
+ setAppStateItem(key, ref, [safeguard]): void
```

**Parameters:**

- **`key`**: {string} - the unique key that catalogs this entry.

- **`ref`**: {any} - the reference to store.  All types are supported
  (including null/undefined) EXCEPT functions or class-based objects.

- **`[safeguard]`**: {boolean} - an optional indicator as to whether
  the entry should be obfuscated (true) or not (false - the DEFAULT).

  **DEFAULT**: `false`

</ul>


<!--- *** Section ************************************************************************* ---> 
## `registerAppStateChangeHandler()`

<ul><!--- indentation hack for github - other attempts with style is stripped (be careful with number bullets) ---> 

Register handler when a specific key changes in our AppState.

This registration is a convenient way to synchronize the local app
state, when the underlying storage changes externally.

This will register the supplied handler for either "URL Hash" or
"Local Storage" changes, based on whether the specified key is part
of the "URL HASH" or not.  In other words these two registrations
are mutually exclusive.


**API:**

```js
+ registerAppStateChangeHandler(key, handler, [crossCommunicateLocalStorageChanges]): void
```

**Parameters:**

- **`key`**: {string} - the unique key that is monitored for change.

- **`handler`**: {function} - the function to invoke on change.

  **API:** _NOTE: named parameters are used:
  ```js
  + handler({oldVal, newVal}): void
  ```

- **`[crossCommunicateLocalStorageChanges]`**: {boolean} - a directive
  to register [Local Storage] handlers when appropriate.  By DEFAULT,
  this is `false`.  Please refer to "NOTE 2" (below).

  **DEFAULT**: `false`

```
NOTE 1: Remember, a "URL Hash" handler is fired not only on
        programmatic changes, but also external changes (when the
        user changes the hash value in their URL).

        As a result, this handler is a convenient way to
        synchronize the local app state.

NOTE 2: Remember, a "Local Storage" handler is "in essence" a
        technique to cross-communicate between windows
        (i.e. processes), because it is fired only in windows other
        than the one that made the change!
        
        For this reason it is rarely used.  As a result, to
        register a "Local Storage" change handlers, you must
        explicitly request this by setting the optional
        `crossCommunicateLocalStorageChanges` parameter to `true`.

        CAUTION: Be careful enabling "Local Storage" handlers that
                 are triggered by rapid-fire events (such a mouse
                 drag operations).  Because of the cross-process
                 synchronization this can cause an osculating
                 back-and-forth series of events that result in an
                 infinite thrashing process.

                 If you find yourself in this situation, consider:
                  - Throttling or Debouncing
                    * Throttling: a reduction of the trigger rate
                    * Debouncing: ZERO trigger rate until a period of calm
```

</ul>



<!--- *** Section ************************************************************************* ---> 
## `getActiveUrlWithFullHash()`

<ul><!--- indentation hack for github - other attempts with style is stripped (be careful with number bullets) ---> 

Return the active URL with full hash options, gleaned from ALL
persistent keys that are currently in-use (both [URL Hash Storage] and
[Local Storage] keys).

This is useful when devising a URL to be used in an embedded iframe.
You can "prune" it to the desired key directives 

**Example:**

```
https://svelte-native-forms.js.org/app/#theme=Teal-dark&sidebar=open&sidebarw=229&show=code
```

**API:**

```js
+ getActiveUrlWithFullHash(): string
```

**Parameters:**

- NONE

**Return:** {string} - the active URL (with full hash options).

```
TODO: Fully flesh out a usage pattern for getActiveUrlWithFullHash()
      EX: - this API could return an array of active hash key/value pairs
          - promote an "embed URL" dropdown options somewhere
            * use a dialog to allow the user to select the options in-use
            * provide ability to auto-generate a: URL, b: embedded iframe
```

</ul>



<!--- internal links ---> 

[Usage]:           #usage
[URL Hash Syntax]: #url-hash-syntax
[API:]:            #api

  [`getAppStateItem()`]:             #getappstateitem
  [`getAppStateItem(key): any`]:     #getappstateitem

  [`setAppStateItem()`]:                              #setappstateitem
  [`setAppStateItem(key, ref, \[safeguard\]): void`]: #setappstateitem

  [`registerAppStateChangeHandler()`]:                                                            #registerappstatechangehandler
  [`registerAppStateChangeHandler(key, handler, \[crossCommunicateLocalStorageChanges\]): void`]: #registerappstatechangehandler

  [`getActiveUrlWithFullHash()`]:           #getactiveurlwithfullhash
  [`getActiveUrlWithFullHash(): string`]:   #getactiveurlwithfullhash

<!--- external links ---> 
[URL Hash Storage]:          urlHashStorage.js
[Local Storage]:             localStorage.js
