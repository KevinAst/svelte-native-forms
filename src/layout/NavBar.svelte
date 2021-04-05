<script>
 // <NavBar>
 //   - NavBar Container
 //   - a "singleton" component ... only one instance is allowed
 //   - height coorelates with height in <SideBar> header
 //     * is instiated at top of page (see: <AppContainer>)
 import {sideBar}              from './SideBar.svelte';
 import ThemeSelector          from './ThemeSelector.svelte';
 import ThemeInversionSelector from './ThemeInversionSelector.svelte';
 import Icon                   from '../util/ui/Icon.svelte';
 import Menu                   from '../util/ui/Menu.svelte';
 import MenuItem               from '../util/ui/MenuItem.svelte';
 import Separator              from '../util/ui/Separator.svelte';
 import * as demo              from '../Demo.svelte';

 let isShowingCode = demo.isShowingCode();
 function showCode() {
   isShowingCode = true;
   demo.showCode();
 }
 function showDemo() {
   isShowingCode = false;
   demo.showDemo();
 }

 let userMenu;

</script>

<!-- NavBar
     - height correlates with height in <SideBar> header (when single line)
       ... accomplished here with py (below)
     - the flex-wrap (below) prevents NavBar from exceeding browser window width
       ... preventing browser-based scroll bars
       ... we want all scrolling to occur within sub-panels
           ALLOWING our NavBar to always be visible at the top of our app
 -->
<nav class="flex-none bg-primaryLight 
            DIVIDER border-accentBorder border-b-2">
  <div class="flex flex-wrap justify-between px-3 py-2.5">

    <!-- Left Section of NavBar -->
    <div class="flex">
      <div class="ml-1 flex items-center space-x-2">
        <Icon name="menu"
              title="Toggle SideBar"
              class="PRIMARY-COLOR text-primary
                     HOVER-COLOR   hover:text-primaryDark
                     CURSOR        select-none cursor-pointer"
              on:click={sideBar.toggle}/>

        <!-- Selected Sample -->
        <span class="SELECTED-COLOR  bg-primary text-onDark
                     CURSOR          select-none cursor-pointer
                     OTHER           px-3 py-2 rounded-md text-sm font-medium">
          Dashboard
        </span>

        <!-- Non-Selected Samples -->
        <span class="NON-SELECTED-COLOR text-onLight
                     HOVER              hover:bg-primary hover:text-onDark
                     CURSOR          select-none cursor-pointer
                     OTHER              px-3 py-2 rounded-md text-sm font-medium">
          Team
        </span>
        <span class="NON-SELECTED-COLOR text-onLight
                     HOVER              hover:bg-primary hover:text-onDark
                     CURSOR             select-none cursor-pointer
                     OTHER              px-3 py-2 rounded-md text-sm font-medium">
          Projects
        </span>
      </div>
    </div>  <!-- end of ... Left Section of NavBar -->

    <!-- Right Section of NavBar -->
    <div class="flex items-center">
      <div class="ml-4 flex-shrink-0 flex items-center">

        <!-- code/demo toggle -->
        <span class="{isShowingCode ? 'bg-primary text-onDark' : 'text-onLight'}
                     HOVER  hover:bg-primary hover:text-onDark
                     CURSOR select-none cursor-pointer
                     OTHER  px-3 py-2 rounded-md text-sm font-medium"
              on:click={showCode}>
          Code
        </span>
        <span class="{!isShowingCode ? 'bg-primary text-onDark' : 'text-onLight'}
                     HOVER  hover:bg-primary hover:text-onDark
                     CURSOR select-none cursor-pointer
                     OTHER  px-3 py-2 rounded-md text-sm font-medium"
              on:click={showDemo}>
          Demo
        </span>

        <!-- User dropdown -->
        <div class="ml-3 relative">
          <button class="bg-secondary
                         flex text-sm rounded-full
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondaryDark focus:ring-secondaryLight"
                  on:click={userMenu.openMenu}>
            <Icon name="person"
                  class="PRIMARY-COLOR text-primary
                         HOVER-COLOR   hover:text-primaryDark
                         CURSOR        select-none cursor-pointer"/>
          </button>
          <Menu bind:this={userMenu}>
            <MenuItem on:click={() => alert('Coming Soon: User Info')}>User Info</MenuItem>
            <Separator title="Themes"/>
            <MenuItem on:click={(e) => e.stopPropagation()}><ThemeSelector/></MenuItem>
            <MenuItem on:click={(e) => e.stopPropagation()}><ThemeInversionSelector/></MenuItem>
            <Separator/>
            <MenuItem on:click={() => alert('Coming Soon: About')}>About</MenuItem>
          </Menu>

        </div>
      </div>
    </div> <!-- end of ... Right Section of NavBar -->

  </div>
</nav>

