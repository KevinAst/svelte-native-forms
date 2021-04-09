<script context="module">
 import {writable} from 'svelte/store';
 import {getAppStateItem,
         setAppStateItem, 
         registerAppStateChangeHandler}  from './util/appStateRetention';

 // PUBLIC API is provided through a "module scoped" custom store
 // - this is possible because <Demo> is a "singleton" component ... only one instance is allowed
 // - demo Custom Store (see "export" below):
 //   * Store API:
 //     + showCode(): void
 //     + showDemo(): void
 //   * Store Value:
 //     {
 //       show: 'demo'/'code'
 //       isShowingCode(): boolean, // true: when code is visible
 //       isShowingDemo(): boolean, // true: when demo is visible
 //     }

 // INTERNAL constants
 const CODE = 'code';
 const DEMO = 'demo'; // our fallback default
 const showKey  = 'show';

 // our initial state comes from the persistent appStateRetention
 // ... with a fallback of 'demo'
 const initialState = getAppStateItem(showKey) || DEMO;

 // methods held in our store value
 // ... NOTE: BY reasoning over non-default (i.e. 'code'),
 //           we DEFAULT all unknown values to the desired 'demo' fallback
 function isShowingCode() { return this.show === CODE ? true : false; }
 function isShowingDemo() { return this.show !== CODE ? true : false; }

 // INTERNAL helper to set our store state
 function setState(show) {
   // retain local state in our store value
   set({show, isShowingCode, isShowingDemo});
   // sync state change in our appStateRetention
   setAppStateItem(showKey, show);
 }

 // our reflexive store :-)
 const {subscribe, set, update} = writable({show: initialState, isShowingCode, isShowingDemo});
 export const demo = { // our custom store (the <Demo> PUBLIC API)
   subscribe,
   showCode: () => setState(CODE),
   showDemo: () => setState(DEMO),
 };

 // sync changes FROM: appStateRetention TO: our local state
 // ... this can change "externally" by the user via the URL Site Hash
 registerAppStateChangeHandler(showKey, ({newVal}) => {
   // console.log(`XX AppStateChangeHandler for demo store (key: '${showKey}'): syncing to '${newVal}'`);
   setState(newVal);
 });
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
