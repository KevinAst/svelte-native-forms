<script>
 import DynamicsTableUnder from '../demo/DynamicsTableUnder.svelte'; // ?? pretend we are hooked into our selector
 let Demo = DynamicsTableUnder;
</script>

<!-- AppMain (with independent scroll bars ... promoting our active <Demo/> -->
<div class="flex-1 overflow-x-auto overflow-y-auto p-3 bg-backdrop text-onLight">
  <svelte:component this={Demo}/>
</div>
