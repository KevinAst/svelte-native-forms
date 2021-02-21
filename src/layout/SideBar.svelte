<script>
 // <SideBar ??attr>
 //   - SideBar Menu Container (i.e. LeftNav)
 //   - fills entire height of browser window
 //   - flex container (flex-direction: col) of following:
 //     * <SideBarItem>  ... multiple items
 //   - ?? adjusts left position for visibility (open/close)
 //     * via inline style.left
 //   - ?? width is adjustable BY user (via drag operation)
 //   - ?? promotes reflective store
 //     * ?? open/close API
 //     * ?? width (so <AppContainer> can adjust for this)
</script>

<!-- SIMULATE: SideBar Flex container WITH full height of screen, and resize control --> 
<div class="absolute h-screen flex flex-col resize-x overflow-x-hidden bg-red-200"
     style="left: -0px; width: 200px;">

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
