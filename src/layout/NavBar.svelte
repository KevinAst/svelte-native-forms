<script>
 import {sideBar} from './SideBar.svelte';
</script>

<!-- SIMULATE NavBar (fixed height coorelates with height in <SideBar> header) -->
<div class="flex-none h-12 bg-pink-300">
  SIMULATE NavBar.svelte <button on:click={sideBar.toggle}>Toggle SideBar</button>
  <br/>
  Line 2
  <br/>
  Line 3
</div>
