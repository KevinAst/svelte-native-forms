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

 // NOTE: Currently ALL default semantics are defined in this module
 //       - this is FINE if <SideBar> is considered part of our app
 //       - AI: If if however we want to make <SideBar> a reusable component, this is a Code Smell :-(

 // AI: CONSIDER if we want <SideBar> to be a reusable component
 //     - determine HOW content is supplied
 //       OP0: component parameters (such as header content, etc.)
 //       OP1: svelte slots
 //       OP2: registration API (useful for dynamic run-time resources - as in visualize-it)
 //       OP3: combination of OP1/OP2

 import {writable}      from 'svelte/store';
 import persistentStore from '../util/persistence/persistentStore';

 // our base store (a persistent writable)
 const {subscribe, update} = persistentStore({
          // we use two distinct persistent keys to allow 
          // partitioning storage between URL hash and Local Storage
   key:   ['sidebar',   // ... syntax: sidebar=open, sidebar=closed
           'sidebarw'], // ... syntax: sidebarw=250
   store: writable({ 
     isOpen: true,  // the sidebar open/closed state
     width:  300    // the sidebar width
   }),
   encode: (key, storeValue) => {
     if (key === 'sidebar') {
       return storeValue.isOpen ? 'open' : 'closed';
     }
     else {
       return '' + storeValue.width;
     }
   },
   decodeAndSync: (key, persistentValue, store) => {
     if (key === 'sidebar') {
       // NOTE: BY reasoning over non-default (i.e. 'closed'),
       //       we DEFAULT all unknown values to the desired 'open' fallback
       const isOpen = persistentValue === 'closed' ? false : true;
       store.update( (storeValue) => ({...storeValue, isOpen}) );
     }
     else {
       let width = parseInt(persistentValue, 10);
       if (Number.isNaN(width)) {
         width = 250; // DEFAULT invalid number
       }
       store.update( (storeValue) => ({...storeValue, width}) );
     }
   },
 });

 // our "public" custom store (with "controlled" setter methods)
 export const sideBar = {
   subscribe,
   open:     ()      => update( (state) => ({...state, isOpen: true}) ),
   close:    ()      => update( (state) => ({...state, isOpen: false}) ),
   toggle:   ()      => update( (state) => ({...state, isOpen: !state.isOpen}) ),
   setWidth: (width) => update( (state) => ({...state, width}) ),
 };

 // AI: OVERKILL: insure SideBar has been instantiated (may be some timing issues here)
 // AI: OVERKILL: restrict multiple instances
</script>

<script>
 // <SideBar>
 //   - SideBar Menu Container (i.e. LeftNav)
 //   - a "singleton" component ... only one instance is allowed
 //   - fills entire height of browser window
 //     * header is fixed (at top)
 //     * content is independently scrollable
 //   - flex container (flex-direction: col) of following:
 //     * <SideBarItem> ... multiple items
 //   - adjusts left position for visibility (open/close)
 //     * via inline style.left
 //   - SideBar width is adjustable (BY user via drag operation)
 import {onMount}   from 'svelte';
 import Icon        from '../util/ui/Icon.svelte';
 import {debounced} from '../util/dampen';
 import {slide}     from 'svelte/transition';

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
   const ro = new ResizeObserver( debounced(100, (entries) => {
     // NOTE: Because we only monitor ONE element, we bypass `entries`
     //       and go straight to the horses mouth
     const newWidth_withScroll = sideBarElm.offsetWidth;
     const newWidth_noScroll   = sideBarElm.clientWidth;
     // console.log(`XX our SideBar width has changed!!!`, {newWidth_withScroll, newWidth_noScroll});

     // reflexively update our width change
     sideBar.setWidth(newWidth_withScroll);

   }) );
   ro.observe(sideBarElm); // ... there is a second param that specifies which box model to adhear to (default: content-box)

   // cleanup - on component desctuction
   return () => {
     ro.disconnect();
   };
 });

 // AI: temporary state (will be refactored when data driven)
 let selectedItem = 0; // AI: PUNT: this is too hoaky without some data to hang our hats on
 let expanded = true;  // AI: very hoaky till we have some data to hang our hats on
 $: expandedIcon = expanded ? 'expand_more' : 'expand_less';
</script>

<!-- SideBar Flex container WITH full height of screen, and resize control --> 
<div class="LAYOUT  absolute h-screen flex flex-col resize-x overflow-x-hidden transition-left 
            MISC    pb-2 bg-primaryLight overflow-y-auto
            DIVIDER border-accentBorder border-r-2"
     bind:this={sideBarElm}>

  <!-- SideBar Header (fixed height [via p-4 adjustment] coorelates with height in <NavBar>) -->
  <div class="p-4
              text-onLight text-base font-bold
              border-transparent border-l-8
              CURSOR  select-none
              LAYOUT  flex items-center">
    <Icon name="clear_all"
          class="mr-3 text-primary"/>
    Select a Demo ...
  </div>


  <!-- SideBarItems WITH it's independent scroll bars -->
  <nav class="LAYOUT flex-1 overflow-y-auto
              MISC   p-2 space-y-1 text-sm font-medium"
       aria-label="Sidebar">

    <!-- Selected Sample -->
    <span class="SELECTED-COLOR  bg-primary text-onDark
                 SELECTED-BORDER border-secondary border-l-8
                 CURSOR  select-none cursor-pointer
                 OTHER group flex items-center px-2 py-2 rounded-md">
      <!-- Selected Icon -->
      <Icon name="home"
            class="mr-3
                   SELECTED-COLOR text-primaryLight"/>
      SEL: Dashboard
      <!-- Selected Notice -->
      <span class="SELECTED-COLOR bg-primaryLight text-onLight
                   ml-auto inline-block py-0.5 px-3 text-xs font-medium rounded-full">
        2
      </span>
    </span>

    <!-- With expandable sections -->
    <span class="NON-SELECTED-COLOR text-onLight
                 NON-SELECTED-BORDER  border-transparent border-l-8
                 HOVER hover:bg-primary hover:text-onDark
                 CURSOR  select-none cursor-pointer
                 OTHER group flex items-center px-2 py-2 rounded-md"
          on:click={()=>expanded = !expanded}>
      <Icon name="folder"
            class="mr-3 
                   PRIMARY-COLOR text-primary
                   HOVER-COLOR   group-hover:text-primaryLight"/>
      Projects
      <!-- KJB: ml-auto moves to right (auto receives it's share of unused space) -->
      <!--      JUST LIKE: mx-auto would center in remaining space -->
      <Icon name={expandedIcon}
            class="ml-auto 
                   PRIMARY-COLOR text-primary
                   HOVER-COLOR   group-hover:text-primaryLight"/>
    </span>

    <!-- Expandable link section -->
    {#if expanded}
    <div class="space-y-1"
         transition:slide="{{duration: 300}}">
      <span class="NON-SELECTED-COLOR text-onLight
                   NON-SELECTED-BORDER  border-transparent border-l-8
                   HOVER hover:bg-primary hover:text-onDark
                   CURSOR  select-none cursor-pointer
                   OTHER group flex items-center pl-11 px-2 py-2 rounded-md">
        Overview
      </span>

      <span class="text-onLight
                   border-transparent border-l-8
                   hover:bg-primary hover:text-onDark
                   CURSOR  select-none cursor-pointer
                   group flex items-center pl-11 px-2 py-2 rounded-md">
        Members
      </span>

      <span class="text-onLight
                   border-transparent border-l-8
                   hover:bg-primary hover:text-onDark
                   CURSOR  select-none cursor-pointer
                   group flex items-center pl-11 px-2 py-2 rounded-md">
        Calendar
      </span>

      <span class="text-onLight
                   border-transparent border-l-8
                   hover:bg-primary hover:text-onDark
                   CURSOR  select-none cursor-pointer
                   group flex items-center pl-11 px-2 py-2 rounded-md">
        Settings
      </span>
    </div>
    {/if}

    <!-- Non-Selected Sample -->
    <span class="NON-SELECTED-COLOR text-onLight
                 NON-SELECTED-BORDER  border-transparent border-l-8
                 HOVER hover:bg-primary hover:text-onDark
                 CURSOR  select-none cursor-pointer
                 OTHER group flex items-center px-2 py-2 rounded-md">
      <!-- Non-Selected Icon -->
      <Icon name="people"
            class="mr-3 
                   PRIMARY-COLOR text-primary
                   HOVER-COLOR   group-hover:text-primaryLight"/>
      NON-SEL: Team
      <!-- Non-Selected Notice -->
      <span class="PRIMARY-COLOR             bg-primaryDark              text-onDark
                   HOVER-COLOR   group-hover:bg-primaryLight group-hover:text-onLight
                   ml-auto inline-block py-0.5 px-3 text-xs font-medium rounded-full">
        3
      </span>
    </span>

  </nav>
</div>


<style>
 /* carve out our own transition style (rather than customize tailwind for left ONLY property) */
 /* NOTE: tailwind usage of `transition-all duration-500` THWARTS resizing by user dragging (unsure why) */
 .transition-left {
   transition: left 0.5s; /* NOTE: duration should match animation in <AppContainer> */
 }
</style>
