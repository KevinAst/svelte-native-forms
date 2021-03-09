<script>
 // <ThemeInversionSelector>
 //   - Theme Inversion Selector Control
 import {onMount} from 'svelte';
 import Icon      from '../util/ui/Icon.svelte';
 import DCT       from './colorTheme';

 let inversion;
 onMount( () => {
   inversion = DCT.getActiveInvertShade();
 });
</script>

<!-- removed: OTHER mr-1 px-3 py-2 (when placed in dropdown menu) -->
<div class="text-onLight
            CURSOR  select-none cursor-pointer
            OTHER   rounded-md text-sm font-medium"
     title="Toggle Dark/Light"
     on:click={() => inversion = DCT.toggleInvertShade()}>

  <!--  toggle indicator -->
  <span class="bg-primaryLight
               relative inline-flex flex-shrink-0
               h-3 w-7 border-2 border-transparent rounded-full cursor-pointer
               transition-colors ease-in-out duration-200
               outline-none ring-2 ring-offset-2 ring-secondary">
    <span class="{inversion ? 'translate-x-4' : 'translate-x-0'}
                 pointer-events-none
                 inline-block h-2 w-2
                 rounded-full bg-secondary shadow transform ring-0
                 transition ease-in-out duration-200"/>
  </span>

  &nbsp; Dark
</div>
