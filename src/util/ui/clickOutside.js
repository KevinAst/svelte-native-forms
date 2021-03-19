/** 
 * Svelte action that dispatches a custom 'click-outside' event when
 * clicked outside supplied node.
 */
export function clickOutside(node) {
  
  // our click handler that orchestrates our process
  const handleClick = (event) => {
    if (node && 
        !node.contains(event.target) &&
        !event.defaultPrevented) {
      node.dispatchEvent( new CustomEvent('click-outside', node) );
    }
  }

  // register our handler
	document.addEventListener('click', handleClick, true);
  
  return {
    destroy() {
      // clean up our handler when our node goes out of scope
      document.removeEventListener('click', handleClick, true);
    }
	}
}
