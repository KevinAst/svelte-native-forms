<script>
 import {onMount} from 'svelte';
 import {sideBar} from './SideBar.svelte';
 import Icon      from '../util/ui/Icon.svelte';
 import DCT       from './colorTheme';

 let theme;
 let inversion;
 onMount( () => {
   theme     = DCT.getActiveThemeName();
   inversion = DCT.getActiveInvertShade();
 });
</script>

<!-- Tailwind UI - NavBars -->

<!-- ?? TW UI - Dark with quick action -->


<!-- SIMULATE NavBar (fixed height coorelates with height in <SideBar> header)
<div class="flex-none h-12 bg-pink-300">
  SIMULATE NavBar.svelte <button on:click={sideBar.toggle}>Toggle SideBar</button>
  <br/>
  Line 2
  <br/>
  Line 3
</div>
-->

<!-- ?? TW UI - Dark with quick action -->
<!--  ?? remove h-12  -->
<nav class="flex-none bg-gray-800">
  <div class="max-w-7xl mx-auto px-3">
    <div class="flex justify-between h-14">
      <div class="flex">

        <div class="ml-1 flex items-center space-x-2">

          <Icon name="menu"
                title="Toggle SideBar"
                class="select-none cursor-pointer text-gray-400 hover:text-white"
                on:click={sideBar.toggle}/>
          
          <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
          <a href="#" class="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
          <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Team</a>
          <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Projects</a>
          <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Calendar</a>
        </div>
      </div>
      <div class="flex items-center">
        <div class="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">

          <span class="text-gray-300 hover:bg-gray-700 hover:text-white mr-1 px-3 py-2 rounded-md text-sm font-medium select-none cursor-pointer"
                title="Next Theme"
                on:click={() => theme = DCT.activateNextTheme()}>
            {theme}
          </span>

          <span class="text-gray-300 hover:bg-gray-700 hover:text-white mr-1 px-3 py-2 rounded-md text-sm font-medium select-none cursor-pointer"
                title="Toggle Dark/Light"
                on:click={() => inversion = DCT.toggleInvertShade()}>
            {inversion ? 'Dark' : 'Light'}
          </span>

          <Icon name="notifications"
                class="select-none cursor-pointer text-gray-400 hover:text-white"/>

          <!-- Profile dropdown -->
          <div class="ml-3 relative">
            <div>
              <button class="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu" aria-haspopup="true">
                <span class="sr-only">Open user menu</span>
                <img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixqx=jdLApQf8mZ&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
              </button>
            </div>
            <!--
                 Profile dropdown panel, show/hide based on dropdown state.

                 Entering: "transition ease-out duration-200"
                 From: "transform opacity-0 scale-95"
                 To: "transform opacity-100 scale-100"
                 Leaving: "transition ease-in duration-75"
                 From: "transform opacity-100 scale-100"
                 To: "transform opacity-0 scale-95"
               -->
            <div class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Your Profile</a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Settings</a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Sign out</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</nav>

