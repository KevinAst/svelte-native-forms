<script>
 import {scale}        from 'svelte/transition';
 import {clickOutside} from './clickOutside.js'; // clickOutside action takes down menu

 // EX:     <Menu bind:this={profileMenu}>
 //           <MenuItem on:click={handleMyProfile}>My Profile</MenuItem>
 //           <MenuItem on:click={handleSettings}}>Settings</MenuItem>
 //           <MenuItem on:click={handleSignOut}>Sign Out</MenuItem>
 //         </Menu>
 // 
 // NOTES:  - by default any <MenuItem> click will close the menu
 //           ... to leave menu up, invoke e.stopPropagation()
 //               <MenuItem on:click={(e) => { e.stopPropagation(); handleSettings() }}>Settings</MenuItem>

 let isOpen = false;

 export function openMenu() {
   isOpen = true;
 }

 export function closeMenu() {
   isOpen = false;
 }

 // 'Escape' key takes down menu
 function handleEscape(e) {
   if (isOpen && e.key === 'Escape') {
     closeMenu();
   }
 }
</script>

<svelte:window on:keyup={handleEscape}/>

<!-- Menu Container -->
{#if isOpen}
<div class="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1
            bg-primaryLight
            ring-2 ring-accentBorder ring-opacity-5
            CONTENT-RELATED text-sm font-bold select-none cursor-pointer"
     in:scale={{duration: 250, start: 0.95}}
     out:scale={{duration: 250, start: 0.95}}
     on:click={closeMenu}
     use:clickOutside
     on:click-outside={closeMenu}>
  <slot/> <!-- Menu Content via slots: <MenuItem> -->
</div>
{/if}
