/**
 * Promote indicators as to the run-time environment in which we are
 * running.
 *
 * USAGE:
 *
 *   import {isBrowser, isNode, isWebWorker} from "./util/env";
 *
 *   if (isBrowser) {
 *     ... do browser only stuff
 *   }
 *    
 *   if (isNode) {
 *     ... do node.js only stuff
 *   }
 *    
 *   if (isWebWorker) {
 *     ... do web worker only stuff
 *   }
 *
 * SEE: https://www.npmjs.com/package/browser-or-node
 *      https://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
 */

const isBrowser   = typeof window !== 'undefined' && typeof window.document !== 'undefined';

const isWebWorker = typeof self === 'object' &&
                    self.constructor &&
                    self.constructor.name === 'DedicatedWorkerGlobalScope';

const isNode      = typeof process !== 'undefined' &&
                    process.versions != null &&
                    process.versions.node != null;

export {isBrowser, isWebWorker, isNode};
