<script context="module">
 // our DEFAULT state/behavior, before <Demo> is mounted
 // ... needed to avoid race condition (used before component is mounted)
 let show_D = 'demo';
 export const demoAPI_D = {
   isShowingCode: () => show_D==='code',
   isShowingDemo: () => show_D==='demo',
   showCode:      () => show_D = 'code',
   showDemo:      () => show_D = 'demo',
 };
 const resolveDemoAPI = () => _demoAPI || demoAPI_D;

 // our singleton binding to our component instance
 let _demoAPI;
 export const isShowingCode = () => resolveDemoAPI().isShowingCode();
 export const isShowingDemo = () => resolveDemoAPI().isShowingDemo();
 export const showCode      = () => resolveDemoAPI().showCode();
 export const showDemo      = () => resolveDemoAPI().showDemo();
</script>

<script>
 import DynamicsTableUnder from './demo/DynamicsTableUnder.svelte'; // ?? temp: see "pretend" note (below)
 import ShowCode           from './util/ui/ShowCode.svelte';
 import {fade}             from 'svelte/transition';
 import {onMount}          from 'svelte';

 const demoComp = DynamicsTableUnder;          // ?? pretend we are hooked into our selector
 const demoCode = 'DynamicsTableUnder.svelte'; // ?? ditto

 let show = show_D; // reflexive state for what to display 'code'/'demo'
 // our public API:
 export const demoAPI = {
   isShowingCode: () => show==='code',
   isShowingDemo: () => show==='demo',
   showCode:      () => show = 'code',
   showDemo:      () => show = 'demo',
 };

 // maintain our singleton binding to our public API (when <Demo> is mounted)
 onMount(() => {
   // retain our external binding
   _demoAPI = demoAPI;

   // return function to invoke when unmounted
	 return () => _demoAPI = null;
 });
</script>

<!-- our active Demo -->
<div id="DemoContainer">
  {#if show === 'demo'}
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
