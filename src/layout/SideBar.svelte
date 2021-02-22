<script context="module">
 // PUBLIC API is provided through a "module scoped" sideBar custom store
 // - this is possible because <SideBar> is a "singleton" component ... only one instance is allowed
 // - sideBar Custom Store:
 //   * Store API:
 //     + open():   void ... open  SideBar
 //     + close():  void ... close SideBar
 //     + toggle(): void ... toggle SideBar open/close
 //   * Store Value:
 //     {
 //       isOpen: boolean, // open: true, closed: false
 //       width:  int,     // actual SideBar width (user can change)
 //                        // ... needed to offset <AppContainer> for OPEN <SideBar>
 //     }
 import {writable} from 'svelte/store';

 // promote our sideBar PUBLIC API through this "module scoped" custom store
 const initialOpen  = true; // AI: adjust from app-specific retention (local storage, URL hash, etc.)
 const initialWidth = 250;  // AI: adjust from app-specific retention (local storage, URL hash, etc.)
 const {subscribe, set, update} = writable({
   isOpen: initialOpen,
   width:  initialWidth,
 });
 export const sideBar = { // our custom store (which is the SideBar PUBLIC API)
   subscribe,
   open:   () => update( (state) => ({...state, isOpen: true})  ),
   close:  () => update( (state) => ({...state, isOpen: false}) ),
   toggle: () => update( (state) => ({...state, isOpen: !state.isOpen}) ),
 };

 // AI: OVERKILL: insure SideBar has been instantiated (may be some timing issues here)
 // AI: OVERKILL: restrict multiple instances
</script>

<script>
 // <SideBar>
 //   - SideBar Menu Container (i.e. LeftNav)
 //   - a "singleton" component ... only one instance is allowed
 //   - fills entire height of browser window
 //   - flex container (flex-direction: col) of following:
 //     * <SideBarItem>  ... multiple items
 //   - adjusts left position for visibility (open/close)
 //     * via inline style.left
 //   - SideBar width is adjustable (BY user via drag operation)
 import {onMount}  from 'svelte';

 let sideBarElm;

 // control SideBar visibility -AND- dynamic width changes
 // NOTE: reflexivity based on changes to: `$sideBar.isOpen` -and- `$sideBar.width` (our. the dependencies)
 $: if (sideBarElm) { // ... conditional accounts for an `undefined` sideBarElm (till it is bound)
   // adjust dynamic width changes
   sideBarElm.style.width = `${$sideBar.width}px`;

   // adjust open/close
   // - when opened: anchor it at left (0)
   // - when closed: shove it to the far left (out of sight) using negative coordinates
   sideBarElm.style.left  = $sideBar.isOpen ? '0' : `-${$sideBar.width}px`;
 }

 // monitor SideBar width changes
 // ... in onMount() to accommodate sideBarElm binding
 onMount( () => {
   const ro = new ResizeObserver( (entries) => {
     // NOTE: Because we only monitor ONE element, we bypass `entries`
     //       and go straight to the horses mouth
     const newWidth_withScroll = sideBarElm.offsetWidth;
     const newWidth_noScroll   = sideBarElm.clientWidth;
     // console.log(`XX our SideBar width has changed!!!`, {newWidth_withScroll, newWidth_noScroll});

     // reflexively update our width change
     update( (state) => ({...state, width: newWidth_withScroll}) );
   });
   ro.observe(sideBarElm); // ... there is a second param that specifies which box model to adhear to (default: content-box)

   // cleanup - on component desctuction
   return () => {
     ro.disconnect();
   };
 });
</script>

<!-- SIMULATE: SideBar Flex container WITH full height of screen, and resize control --> 
<div class="absolute h-screen flex flex-col resize-x overflow-x-hidden transition-left bg-red-200"
     bind:this={sideBarElm}>

  <!-- SIMULATE SideBar Header (fixed height coorelates with height in <NavBar>) -->
  <div class="flex-none h-12 bg-green-50">
    SIMULATE SideBar Header
  </div>

  <!-- SIMULATE SideBarItems WITH it's independent scroll bars -->
  <div class="flex-1 overflow-y-auto">

    <!-- SIMULATE SideBarItem -->
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
    <div>Item 4</div>
    <div>Item 5</div>
    <div>Item 6</div>
    <div>Item 7</div>
    <div>Item 8</div>
    <div>Item 9<br/>... what happens if this is really big</div>
    <div>Item 10</div>
    <div>Item 11</div>
    <div>Item 12</div>
    <div>Item 13</div>
    <div>Item 14</div>
    <div>Item 15</div>
    <div>Item 16</div>
    <div>Item 17</div>
    <div>Item 18</div>
    <div>Item 19</div>
    <div>Item 20</div>
  </div>
</div>

<style>
 /* carve out our own style (rather than customize tailwind for left ONLY property) */
 /* NOTE: tailwind usage of `transition-all duration-500` THWARTS resizing by user dragging (unsure why) */
 .transition-left {
   transition: left 0.5s; /* NOTE: duration should match animation in <AppContainer> */
 }
</style>
