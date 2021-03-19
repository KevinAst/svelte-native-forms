<script>
 // A separator line (within a <Menu>) with optional title

 // EX:     <Menu bind:this={profileMenu}>
 //           <MenuItem on:click={handleMyProfile}>My Profile</MenuItem>
 //           <Separator/>
 //           <MenuItem on:click={handleSettings}}>Settings</MenuItem>
 //           <Separator title="Themes"/>
 //           <MenuItem on:click={handleSignOut}>Sign Out</MenuItem>
 //         </Menu>

 // INPUT: optional separator title (centered)
 export let title = '';
</script>

<div class="relative">
  <!-- separator line  -->
  <div class="absolute inset-0 flex items-center">
    <div class="w-full border-t-2 border-accentBorder"></div>
  </div>
  <!-- optional title ... center: justify-center ... left: justify-start  -->
  {#if title}
  <div class="relative flex justify-center">
    <span class="px-2 bg-primaryLight text-sm text-onLight">
      {title}
    </span>
  </div>
  {/if}
</div>
