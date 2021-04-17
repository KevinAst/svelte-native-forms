// taken from: https://codeburst.io/throttling-and-debouncing-in-javascript-646d076d0a44

/**
 * Wrap `fn` with a throttling algorithm that reduces it's trigger
 * rate to the supplied `delay`.
 * 
 * @param {int} delay the amount of time (in mills) to delay the
 * invocation of `fn`.
 *
 * @param {function} the function to wrap.
 * 
 * @return {function} a new function that wraps `fn` with the
 * throttling implementation.
 */
// AI: KJB: this algorithm is NOT QUITE RIGHT: it will NOT correctly execute the last callback
export function throttled(delay, fn) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  }
}

/**
 * Wrap `fn` with a debouncing algorithm that zeros the trigger rate
 * until a period of calm has transpired (as specified by `delay`).
 * 
 * @param {int} delay the amount of "calm" time (in mills) before the
 * `fn` is invoked.
 *
 * @param {function} the function to wrap.
 * 
 * @return {function} a new function that wraps `fn` with the
 * debouncing implementation.
 */
export function debounced(delay, fn) {
  let timerId;
  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      timerId = null;
      return fn(...args);
    }, delay);
  }
}
