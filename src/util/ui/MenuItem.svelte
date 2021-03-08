<!-- 
     A <MenuItem> within a <Menu>
     ... see example in <Menu>
 -->
<span class="block px-4 py-2 text-onLight hover:bg-primary hover:text-onDark"
      on:click> <!-- event forwarding allows: <MenuItem on:click={xyz}/>  -->
  <slot/> <!-- MenuItem Content via slots -->
</span>
