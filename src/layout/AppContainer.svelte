<script>
 // <AppContainer ??attr>
 //   - Full Application Container (everything EXCEPT <SideBar>)
 //   - ?? fills entire width/height of browser window
 //   - ?? flex container (flex-direction: col) of following:
 //     * <NavBar>  ... Navigation Bar
 //     * <TabBar>  ... OPTIONAL (not in this app)
 //     * <AppMain> ... Scrollable container of Primary App Content
 //   - ?? adjusts left position to account for <SideBar>
 //     * via inline style.marginLeft
 //     * interacts directly with <SideBar> for this interaction
</script>

<!-- SIMULATE: AppContainer Flex WITH left adjustment of <SideBar> --> 
<!-- outer div needed to anchor full width/height of screen -->
<div class="w-screen h-screen bg-red-50">
  <!-- inner div provides flex container WITH full height of container, and dynamic adjustments for <SideBar> -->
  <div class="h-full flex flex-col"
       style="margin-left: 200px;">

    <!-- SIMULATE NavBar (fixed height coorelates with height in <SideBar> header) -->
    <div class="flex-none h-12 bg-green-50">
      SIMULATE NavBar
      <br/>
      Line 2
      <br/>
      Line 3
    </div>

    <!-- SIMULATE TabBar -->
    <div class="flex-none bg-yellow-50">
      SIMULATE TabBar
    </div>

    <!-- SIMULATE AppMain WITH it's independent scroll bars -->
    <div class="flex-1 overflow-x-auto overflow-y-auto bg-blue-50">
      <p>AppMain: First entry</p>
      <p>Now is the time for every good man to come to the aid of their country</p>
      <div style="width: 800px; height: 200px;" class="block bg-blue-100">
        Test a wide and tall item
      </div>
      <p>Now is the time for every good man to come to the aid of their country</p>
      <p>Now is the time for every good man to come to the aid of their country</p>
      <p>Now is the time for every good man to come to the aid of their country</p>
      <p>Now is the time for every good man to come to the aid of their country</p>
      <p>Now is the time for every good man to come to the aid of their country</p>
      <p>Now is the time for every good man to come to the aid of their country</p>
      <p>Now is the time for every good man to come to the aid of their country</p>
      <p>Now is the time for every good man to come to the aid of their country</p>
      <p>Now is the time for every good man to come to the aid of their country</p>
      <p>Now is the time for every good man to come to the aid of their country</p>
      <p>AppMain: Last entry</p>
    </div>

  </div>
</div>
