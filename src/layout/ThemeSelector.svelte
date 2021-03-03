<script>
 // <ThemeSelector>
 //   - Theme Selector Control
 import {onMount} from 'svelte';
 import Icon      from '../util/ui/Icon.svelte';
 import DCT       from './colorTheme';

 let theme;
 onMount( () => {
   theme = DCT.getActiveThemeName();
 });
</script>

<span class="text-onLight
             HOVER   hover:bg-primary hover:text-onDark
             CURSOR  select-none cursor-pointer
             OTHER   mr-1 px-3 py-2 rounded-md text-sm font-medium"
      title="Adjust Theme Color">

  <Icon name="arrow_back_ios"
        title="Prior Theme"
        size="100%"
        class="hover:text-primaryDark"
        on:click={() => theme = DCT.activatePriorTheme()}/>

  {theme}

  <Icon name="arrow_forward_ios"
        title="Next Theme"
        size="100%"
        class="hover:text-primaryDark"
        on:click={() => theme = DCT.activateNextTheme()}/>
</span>
