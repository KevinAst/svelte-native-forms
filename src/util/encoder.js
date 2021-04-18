import check           from './check';
import {isString,
        isFunction,
        isClassObject,
        isArray,
        isPlainObject} from './typeCheck';

/**
 * Encode the supplied ref into a string representation.
 *
 * - supporting an optional safeguard (obfuscate content making it
 *   obscure to public visibility)
 *
 * - employing embedded-recognition so the process can be reversed using
 *   self-recognition
 *
 * TERMINOLOGY:
 *
 * - encode:  package content into a string representation (which can
 *            be reversed) ... ex: obj2str
 *
 * - decode:  reverse the process of encode()
 *
 * - safeguard: obfuscate content so as to make it obscure to public
 *              visibility
 *              NOTE: this is a "lighter weight" process than full
 *                    encryption
 *
 * - embedded-recognition: the ability to recognize and reverse the
 *                         process of either encoding and/or
 *                         safeguarding, producing the original
 *                         ref (that was encoded)
 *
 * @param {any} ref the reference to encode.  All types are supported
 * (including null/undefined) EXCEPT functions or class-based objects.
 * NOTE: encode() **assumes** that supplied arrays and JSON objects do NOT
 * contain these un-supported types.
 *
 * @param {boolean} [safeguard=false] an indicator as to whether the
 * result should be obfuscated (true) or not (false - the DEFAULT).
 * 
 * @return {string} an encoded representation of the supplied ref.
 */
export function encode(ref, safeguard=false) {

  // validate our parameters
  const checkParam = check.prefix('encode() parameter violation: ');

  // ... ref: we even encode anything (even null/undefined) - EXCEPT functions or class-based objects
  checkParam( !(isFunction(ref) || isClassObject(ref)),  'ref can be ANY type BUT a function or a class-based object)');

  // ... safeguard
  checkParam(safeguard===true || safeguard===false, 'safeguard must be a boolean (true/false), NOT: ', safeguard);

  // encode the supplied ref into a string representation
  let encoded;
  // ... strings are processed as-is
  if (isString(ref)) {
    encoded = ref;
  }
  // ... handle `undefined` specifically (JSON does NOT handle `undefined` values)
  else if (ref === undefined) {
    encoded = demarkUndefined;
  }
  // ... plain JSON objects are: JSONIZED
  else if (isPlainObject(ref)) {
    encoded = demarkJsonEncoding + JSON.stringify(ref);
  }
  // ... all others (numbers, booleans, array, null)
  //     are: wrapped in a JSON structure and JSONIZED
  else {
    encoded = demarkJsonEncoding + JSON.stringify({apwra: ref});
  }

  // safeguard, when requested
  if (safeguard) {
    encoded = demarkSafeguard + obfuscate(encoded);
  }

  // thats all folks :-)
  return encoded;
}


/**
 * Decode the supplied ref, reversing the process of `encode()`.
 * 
 * NOTE: `decode()` can be invoked on a non-encoded ref, in which case
 *       it will simply pass-through the un-encoded ref.  This is a
 *       convenience, and is made possible by embedded-recognition.
 * 
 * @param {any} ref the reference item to decode ... either the
 * output of `encode()` (a recognized encoded string), or any other
 * reference (simply passed-through).
 * 
 * @return {any} the decoded representation of the supplied ref.
 */
export function decode(ref) {

  // RECENT RELAXATION: allow `undefined` to simply pass-through
  // // validate our parameters
  // const checkParam = check.prefix('decode() parameter violation: ');
  // 
  // // ... ref
  // checkParam(ref, 'ref is required');

  // simply pass-through any non-string ref
  // ... this includes things like `undefined`
  if (!isString(ref)) {
    return ref;
  }

  // KEY: at this point we know ref is a string :-)
  let result = ref;

  // unwind any safeguards
  if (result.indexOf(demarkSafeguard) === 0) {
    result = result.substring(demarkSafeguard.length);
    result = deobfuscate(result);
  }

  // unwind any JSON encodings
  if (result.indexOf(demarkJsonEncoding) === 0) {
    result = result.substring(demarkJsonEncoding.length);
    result = JSON.parse(result);
  }

  // unwind any primitive type wrappings
  if (result && result.hasOwnProperty('apwra')) {
    result = result.apwra;
  }

  // unwind `undefined` value
  if (result === demarkUndefined) {
    result = undefined;
  }

  // thats all folks :-)
  return result;
}

// embedded-recognition keywords - use Pig Latin phrases so as to NOT "stand out"
const demarkJsonEncoding = 'asonja'; // ... "json"
const demarkSafeguard    = 'afesa';  // ... "safe"
const demarkUndefined    = '__undefined__';

function obfuscate(str) {
  if (!window.btoa) {
    throw new Error('*** ERROR *** encode(): obfuscation NOT supported by this browser (btoa).');
  }
  const obfuscated = window.btoa(str);
  return obfuscated;
}

function deobfuscate(str) {
  if (!window.atob) {
    throw new Error('*** ERROR *** decode(): de-obfuscation NOT supported by this browser (atob).');
  }
  const clearTxt = window.atob(str);
  return clearTxt;
}

// quick-and-dirty test of encode()/decode()
// function test(testing, ref, safeguard=false, expectingError=false) {
//   let encoded;
//   try {
//     encoded = encode(ref, safeguard);
//   }
//   catch (err) {
//     if (expectingError) {
//       console.log(`PASS: Expected ERROR THROWN: testing ${testing} ERROR: ${err.message}`, {ref, safeguard, err});
//     }
//     else {
//       console.log(`FAIL: Unexpected ERROR THROWN: testing ${testing} ERROR: ${err.message}`, {ref, safeguard, err});
//     }
//     return;
//   }
//   const decoded = decode(encoded);
// 
//   // test results
//   if (isPlainObject(ref) || isArray(ref)) {
//     // test objects by a re-encoding of the decoded TO ACCOMMODATE deep comparison of objects
//     const result = encode(decoded, safeguard) === encoded ? 'PASS' : 'FAIL';
//     console.log(`${result}: testing ${testing} `, {ref, safeguard, encoded, decoded});
//   }
//   else {
//     // plain old test
//     const result = ref === decoded ? 'PASS' : 'FAIL';
//     console.log(`${result}: testing ${testing} `, {ref, safeguard, encoded, decoded});
//   }
// }
// function testError(testing, ref, safeguard=false) {
//   test(testing, ref, safeguard, true);
// }
// 
// test('string', 'DillWeed');
// test('string safeguarded', 'DillWeed', true);
// test('JSON', {a:123, z:'This is a test'});
// test('JSON safeguarded', {a:123, z:'This is a test'}, true);
// test('number', 123);
// test('number safeguarded', 123, true);
// test('boolean true', true);
// test('boolean true safeguarded', true, true);
// test('boolean false', false);
// test('boolean false safeguarded', false, true);
// test('null', null);
// test('null safeguarded', null, true);
// test('undefined', undefined);
// test('undefined safeguarded', undefined, true);
// test('array', [1, 'two', {wow: 'zee'}]);
// test('array safeguarded', [1, 'two', {wow: 'zee'}], true);
// 
// // test error conditions
// testError('function', test);
// class MyClass {
//   constructor() {
//     this.foo = 'bar';
//   }
// }
// testError('class-based object', new MyClass());
