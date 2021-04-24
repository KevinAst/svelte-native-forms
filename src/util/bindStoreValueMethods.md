# Svelte Store-Value Methods

[`bindStoreValueMethods()`] is a thin layer on top of the svelte
[`Writable`] store that introduces **store-value methods**!

Have you ever wanted to have object-oriented methods in a store-value?
I know this is somewhat "unconventional", but I have found it to be
extremely useful.  In svelte, there are techniques to encapsulate
business logic in store methods _(using custom stores)_, **so WHY NOT
in the store-value itself**?

As a simple example, consider this: `$myStore.isOpen()` and/or
`$myStore.isClosed()`.  These methods encapsulate business logic,
reasoning about the internal state of the store-value, rather than
requiring the app to have this knowledge _(repeated throughout the
application)_.

In the past I have introduced store-value methods in application code,
but it was always difficult _(and cumbersome)_ to insure the methods
were maintained correctly on store `set()` and `update()` operations.

**This utility makes the process seamless**.


<!--- *** Section ************************************************************************* ---> 
## At a Glance

- [Usage]
- [How Do It Know?]
- [API:]
  - [`bindStoreValueMethods(store, methods): Writable`]


<!--- *** Section ************************************************************************* ---> 
## Usage

To use [`bindStoreValueMethods()`] simply follow this pattern:

```js
const store = bindStoreValueMethods( writable({show: 'demo'}), {
  isShowingCode() { return this.show === 'code' ? true : false; }, 
  isShowingDemo() { return !this.isShowingCode(); },
});
```

You can see the store-value is an object with a single data element:

```js
{
  show: 'demo'
}
```

This `bindStoreValueMethods()` invocation will bind the following
methods to this object:

```js
{
  show: 'demo',
  isShowingCode() { return this.show === 'code' ? true : false; }, 
  isShowingDemo() { return !this.isShowingCode(); }
}
```

**NOTE**: Here are a couple of things to consider:

1. Application logic that updates the store-value _(via `set()` or
   `update()`)_ is **not** concerned with these methods.  The methods
   are retained automatically by this utility.  In other words, the
   updating logic is strictly focused on the store-value data.

   As an example, the following `set()` will retain the two methods
   _(even though they are NOT specified in the operation)_:

   ```js
   store.set({show: 'code'})
   ```

1. It may go without saying, but in order to use this utility, your
   svelte store-value must be an object, in order to have a place to
   bind the methods.

2. If the methods access the value state (through a `this` reference),
   they **cannot** be arrow functions.


<!--- *** Section ************************************************************************* ---> 
## How Do It Know?

<ul>

Ever heard the joke about the thermos keeping **"hot things hot"**,
and **"cold thing cold"?** The confused bystander asked: **"How do it
know?"**

You may be wondering how this utility works.  Internally, this is
accomplished by injecting hooks in the store's `set()` and `update()`
functions that maintain the store-value methods.

As a result, application logic never has to worry about this tedious
task.  **In other words the application logic focuses strictly on the
data within the store-value**.

</ul>


<!--- *** Section ************************************************************************* ---> 
## API:


<!--- *** Section ************************************************************************* ---> 
## `bindStoreValueMethods()`

<ul>

Bind "value" methods into the supplied svelte `Writable` store.

**API:**

```js
+ bindStoreValueMethods(store, methods): Writable
```

**Parameters:**

- **`store`**: {Writable} - the svelte `Writable` store whose
  store-value is to be bound to the supplied `methods`.  The
  store-value MUST BE a plain object, in order to bind the methods.

- **`methods`**: {Object} - the methods to bind ... a plain object
  with name/method (key/value) pairs.  **NOTE** If the the methods
  access value state (through a `this` reference), they **cannot** be
  arrow functions.

**Return:** {Writable} - as a convenience, the supplied store is
  returned, supporting chaining.

</ul>





<!--- internal links ---> 
[Usage]:                        #usage
[How Do It Know?]:              #how-do-it-know
[API:]:                         #api
  [`bindStoreValueMethods()`]:                         #bindstorevaluemethods
  [`bindStoreValueMethods(store, methods): Writable`]: #bindstorevaluemethods

<!--- external links ---> 
[`Writable`]:                https://svelte.dev/docs#writable
