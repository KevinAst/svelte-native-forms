import {isPlainObject}  from './typeCheck';

/**
 * A convenience assertion validation utility that performs checks
 * related to any named parameter structural problems.
 * 
 * This logic is encapsulated here because it a repetitive requirement
 * by many functions :-)
 * 
 * USAGE:
 * ```js
 * function myFunc(namedParams={}) {
 * 
 *   // ***
 *   // *** validate parameters
 *   // ***
 * 
 *   const checkParam = check.prefix('myFunc() parameter violation: ');
 * 
 *   // descturcture our individual namedParams
 *   // NOTE 1: Done here (rather in the function signature) to have access
 *   //         to the overall `namedParams` variable - for validation purposes!
 *   // NOTE 2: Done early to have access to `unknownNamedArgs`, requiring conditional
 *   //         isPlainObject() check.
 *   const {key,
 *          initial,
 *          ...unknownNamedArgs} = isPlainObject(namedParams) ? namedParams : {};
 * 
 *   // ... check overall named parameter structure
 *   checkNamedParamStructure(checkParam, namedParams, arguments, unknownNamedArgs);
 * 
 *   // >>> resume app-specific parameter validation
 *   // ... key
 *   checkParam(key,            'key is required');
 *   checkParam(isString(key),  'key must be a string');
 * 
 *   // ... snip snip
 * }
 * ```
 *
 * @param {checkFn} check - the check assertion utility function,
 * typically prefixed with `check.prefix()` to give proper context
 * to emitted exceptions.
 *
 * @param {plainObj} namedParams - the plain object holding all named
 * parameters.
 * 
 * @param {argsObj} args - the implicit `arguments` object
 * (accessible within standard JavaScript functions).
 *
 * @param {string[]} unknownNamedArgs - an array of unknown named
 * arguments, typically defined using ES6 "rest parameters".
 * 
 * @throws {Error} an Error is thrown for any named parameter
 * structural problem.
 */
export default function checkNamedParamStructure(check, namedParams, args, unknownNamedArgs) {
  // verify that `namedParams` is an appropriate type (an object wrapper of key/value pairs)
  check(isPlainObject(namedParams), `only named parameters may be supplied`);

  // verify that no extraneous positional parameters were supplied
  // NOTE: when defaulting entire struct, arguments.length is 0
  check(args.length <= 1, `unrecognized positional parameters (only named parameters can be specified) ... ${args.length} positional parameters were found`);

  // verify NO unrecognized named parameters were supplied
  const unknownNamedArgKeys = Object.keys(unknownNamedArgs);
  check(unknownNamedArgKeys.length === 0,  `unrecognized named parameter(s): ${unknownNamedArgKeys}`);
}


// quick-and-dirty tests
// import check           from './check';
// import {isString,
//         isPlainObject} from './typeCheck';
// 
// function test(testing, fn, expectingErr) {
//   try {
//     fn();
//     if (expectingErr) {
//       console.log(`FAIL: testing '${testing}': expected error but NON emitted`);
//     }
//     else {
//       console.log(`PASS: testing '${testing}': NOT expecting error and NO error was emitted`);
//     }
//   }
//   catch (err) {
//     if (expectingErr) {
//       console.log(`PASS: testing '${testing}': expecting error `, {err});
//     }
//     else {
//       console.log(`FAIL: testing '${testing}': UNEXPECTED error `, {err});
//     }
//   }
// }
// 
// function functUnderTest(namedParams={}) {
// 
//   // ***
//   // *** validate parameters
//   // ***
// 
//   const checkParam = check.prefix('functUnderTest() parameter violation: ');
// 
//   // descturcture our individual namedParams
//   // NOTE 1: Done here (rather in the function signature) to have access
//   //         to the overall `namedParams` variable - for validation purposes!
//   // NOTE 2: Done early to have access to `unknownNamedArgs`, requiring conditional
//   //         isPlainObject() check.
//   const {key,
//          initial,
//          ...unknownNamedArgs} = isPlainObject(namedParams) ? namedParams : {};
// 
//   // ... check overall named parameter structure
//   checkNamedParamStructure(checkParam, namedParams, arguments, unknownNamedArgs);
// 
//   // ... key
//   checkParam(key,            'key is required');
//   checkParam(isString(key),  'key must be a string');
//   
//   // ... initial
//   checkParam(initial, 'initial is required');
// }
// 
// test('only named parameters may be supplied', () => functUnderTest(123), true);
// test('unrecognized positional parameters', () => functUnderTest({key:'myKey', initial:'supplied'}, 456), true);
// test('unrecognized named parameter(s)', () => functUnderTest({key:'myKey', initial:'supplied', rogue1:'rogue1', rogue2:'rogue2'}), true);
// 
// test('all good', () => functUnderTest({key:'myKey', initial:'supplied'}), false);
// test('key is required', () => functUnderTest(), true);
// test('key must be a string', () => functUnderTest({key:123}), true);
// test('initial is required', () => functUnderTest({key:'myKey'}), true);
