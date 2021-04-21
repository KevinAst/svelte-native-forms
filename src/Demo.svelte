<script context="module">
 import persistentWritable     from './util/persistentWritable';
 import bindStoreValueMethods  from './util/bindStoreValueMethods';

 // PUBLIC API is provided through a "module scoped" custom store
 // - this is possible because <Demo> is a "singleton" component ... only one instance is allowed
 // - demo Custom Store (see "export" below):
 //   * Store API:
 //     + showCode(): void
 //     + showDemo(): void
 //   * Store-Value:
 //     {
 //       show: 'demo'/'code',
 //       isShowingCode(): boolean, // true: when code is visible
 //       isShowingDemo(): boolean, // true: when demo is visible
 //     }

 // INTERNAL constants
 const CODE = 'code';
 const DEMO = 'demo'; // our fallback default

 // our base store ... a persistentWritable
 const store = persistentWritable({
   key: 'show',
   initialFallback: {show: DEMO},
   safeguard: false,                           // ??$$ vary this (for fun)
   crossCommunicateLocalStorageChanges: false, // ??$$ vary this (for fun)
 });

 // bind store-value methods (encapsulating business logic)
 bindStoreValueMethods(store, {
   // NOTE: by reasoning over non-default (i.e. CODE),
   //       we DEFAULT all unknown values to the desired DEMO fallback
   isShowingCode() { return this.show === CODE ? true : false; }, 
   isShowingDemo() { return !this.isShowingCode(); },
 });

 // our custom store (the <Demo> PUBLIC API)
 export const demo = {
   subscribe: store.subscribe,
   showCode: () => store.set({show: CODE}),
   showDemo: () => store.set({show: DEMO}),
 };
</script>


<script>
 import DynamicsTableUnder from './demo/DynamicsTableUnder.svelte'; // ?? temp: see "pretend" note (below)
 import ShowCode           from './util/ui/ShowCode.svelte';
 import {fade}             from 'svelte/transition';

 const demoComp = DynamicsTableUnder;          // ?? pretend we are hooked into our selector
 const demoCode = 'DynamicsTableUnder.svelte'; // ?? ditto
</script>

<!-- our active Demo -->
<div id="DemoContainer">
  {#if $demo.isShowingDemo()}
    <div in:fade={{delay: 400, duration: 200}}
         out:fade={{duration: 400}}>
      <svelte:component this={demoComp}/>
    </div>
  {:else}
    <div in:fade={{delay: 400, duration: 200}}
         out:fade={{duration: 400}}>
      <ShowCode moduleName={demoCode}/>
    </div>
  {/if}
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
