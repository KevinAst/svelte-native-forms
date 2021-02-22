<script>
 // <AppContainer>
 //   - Full Application Container (WITH <SideBar>)
 //   - fills entire width/height of browser window
 //   - flex container (flex-direction: col) of following:
 //     * <NavBar>  ... Navigation Bar
 //     * <TabBar>  ... OPTIONAL (not in this app)
 //     * <AppMain> ... Scrollable container of Primary App Content
 //   - adjusts left position to account for <SideBar>
 //     * via inline style.marginLeft
 //     * interacts directly with <SideBar> for this interaction

 import SideBar,
        {sideBar} from './SideBar.svelte';
 import NavBar    from './NavBar.svelte';
 import AppMain   from './AppMain.svelte';

 let appContainerElm;

 // adjust <AppContainer> left-offset to accomidate SideBar (when open)
 // ... reflexively updated when a: open/close, and b: SideBar width changes
 $: if (appContainerElm) { // ... conditional accounts for an `undefined` appContainerElm (till it is bound)
   appContainerElm.style.marginLeft = $sideBar.isOpen ? `${$sideBar.width}px`: '0px';     
 }
</script>

<!-- our <SideBar> --> 
<SideBar/>

<!-- our <AppContainer> --> 
<!-- outer div needed to anchor full width/height of screen -->
<div class="w-screen h-screen bg-red-50">
  <!-- inner div provides flex container WITH full height of container, and dynamic adjustments for <SideBar> -->
  <div class="h-full flex flex-col transition-margin-left"
       bind:this={appContainerElm}>

    <NavBar/>

    <!-- place <TabBar> here (if needed)
    <div class="flex-none bg-yellow-50">
      SIMULATE TabBar
    </div>
    -->

    <AppMain/>

  </div>
</div>

<style>
 /* carve out our own style (rather than customize tailwind for margin-left ONLY property) */
 .transition-margin-left {
   transition: margin-left 0.5s; /* NOTE: duration should match animation in <SideBar> */
 }
</style>
