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
  return typeof ref === 'object' && ref.constructor === Object;
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
