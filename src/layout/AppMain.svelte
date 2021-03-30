<script>
 import DynamicsTableUnder from '../demo/DynamicsTableUnder.svelte'; // ?? pretend we are hooked into our selector
 let Demo = DynamicsTableUnder;
</script>

<!-- AppMain (with independent scroll bars ... promoting our active <Demo/> -->
<div id="DemoContainer" class="flex-1 overflow-x-auto overflow-y-auto p-3 bg-backdrop text-onLight">
  <svelte:component this={Demo}/>
</div>

<style>
 /* style demo characteristics WITHOUT tailwind in the demo itself
    (because SNF is independent of tailwind)

    REQUIREMENTS:
    - work well with all my color themes
    - styling applied WITHOUT utilizing tailwind css classes IN DEMO
      - INCLUDING: SNF error styling (AI: must devise error color
        in our theme that works well with all color schemes)
    - works when code pulled out of demo app (so user can apply in 
      their own code-base)
 */
 @layer base {
   /* <button> elms are common in our demo samples */
   #DemoContainer :global(button) {
     @apply inline-flex items-center p-1 border border-primary shadow-sm text-sm font-medium rounded text-onLight bg-primaryLight hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary
   }

   /* <input type="text"> */
   #DemoContainer :global(input[type="text"]) {
     @apply m-1 py-0.5 px-1 border-2 border-primary bg-primaryLight text-onLight
   }

   /* <input type="radio"> ... NO WORK: to style a native radio button without custom images */
   #DemoContainer :global(input[type="radio"]:checked) {
     color: red;
     @apply border-primary bg-secondaryLight
   }

   /* <hr/> */
   #DemoContainer :global(hr) {
     @apply m-2 border-0 h-1 bg-primary shadow-md
   }
 }
</style>
