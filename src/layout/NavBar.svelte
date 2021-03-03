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

        <ThemeSelector/>

        <ThemeInversionSelector/>

        <Icon name="notifications"
              class="PRIMARY-COLOR text-primary
                     HOVER-COLOR   hover:text-primaryDark
                     CURSOR        select-none cursor-pointer"/>

        <!-- Profile dropdown -->
        <div class="ml-3 relative">
          <button class="bg-secondary
                         flex text-sm rounded-full
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondaryDark focus:ring-secondaryLight"
                  id="user-menu">
            <Icon name="person"
                  class="PRIMARY-COLOR text-primary
                         HOVER-COLOR   hover:text-primaryDark
                         CURSOR        select-none cursor-pointer"/>
          </button>
          <!--
               Profile dropdown panel, show/hide based on dropdown state.

               Entering: "transition ease-out    duration-200"
               From:     "transform  opacity-0   scale-95"
               To:       "transform  opacity-100 scale-100"
               Leaving:  "transition ease-in     duration-75"
               From:     "transform  opacity-100 scale-100"
               To:       "transform  opacity-0   scale-95"
             -->
          <div class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1
                      bg-primaryLight
                      ring-2 ring-accentBorder ring-opacity-5
                      CONTENT-RELATED text-sm font-bold select-none cursor-pointer"
               role="menu"
               aria-orientation="vertical"
               aria-labelledby="user-menu">
            <span class="block px-4 py-2 text-onLight hover:bg-primary hover:text-onDark" role="menuitem">Your Profile</span>
            <span class="block px-4 py-2 text-onLight hover:bg-primary hover:text-onDark" role="menuitem">Settings</span>
            <span class="block px-4 py-2 text-onLight hover:bg-primary hover:text-onDark" role="menuitem">Sign Out</span>
          </div>
        </div>
      </div>
    </div> <!-- end of ... Right Section of NavBar -->

  </div>
</nav>

