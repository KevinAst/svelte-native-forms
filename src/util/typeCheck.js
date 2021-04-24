//***
//*** convenience type checkers with ZERO dependencies (i.e. NO lodash)
//***

// isArray(ref): boolean
export function isArray(ref) {
  return Array.isArray(ref);
}

// isBoolean(ref): boolean
export function isBoolean(ref) {
  return ref === true || ref === false;
}

// isPlainObject(ref): boolean
export function isPlainObject(ref) {
  return !!ref && typeof ref === 'object' && ref.constructor === Object;
}

// isClassObject(ref): boolean
export function isClassObject(ref) {
  var type = typeof ref;
  return !!ref && type === 'object' && !isPlainObject(ref) && !isArray(ref);
}

// isString(ref): boolean
export function isString(ref) {
  return typeof ref === 'string' || ref instanceof String;
}

// isFunction(ref): boolean
// ... from http://underscorejs.org/
export function isFunction(ref) {
  return !!(ref && ref.constructor && ref.call && ref.apply);
}

// isSvelteStore(ref): boolean
export function isSvelteStore(ref) {
  // duck type check :-)
  return !!ref && ref.subscribe;
}

// isSvelteWritable(ref): boolean
export function isSvelteWritable(ref) {
  // duck type check :-)
  return isSvelteStore(ref) && ref.set && ref.update;
}

// quick-and-dirty test of isClassObject(ref)
// function test(testing, ref, expecting) {
//   const isObj  = isClassObject(ref);
//   const result = isObj === expecting ? 'PASS' : 'FAIL';
//   console.log(`${result}: type ${testing} `, {ref, isObj});
// }
// 
// class MyClass {
//   constructor() {
//     this.foo = 'bar';
//   }
// }
// 
// test('number',    123,            false);
// test('string',    'foo',          false);
// test('boolean',   true,           false);
// test('array',     [1,2],          false);
// test('JSON',      {foo: 'bar'},   false);
// test('function',  test,           false);
// test('null',      null,           false);
// test('undefined', undefined,      false);
// test('myObject',  new MyClass(),  true);
// test('date',      new Date(),     true);

// test if arrays are valid JSON structure
// const myArr = [1,2,3];
// console.log(`isPlainObj(myArr): ${isPlainObject(myArr)}`) // ... false
// const myArrEncoded = JSON.stringify(myArr);    // ... "[1,2,3]"
// const myArrDecoded = JSON.parse(myArrEncoded); // ... [1,2,3]
// console.log(`encode/decode an array: `, {myArr, myArrEncoded, myArrDecoded});
