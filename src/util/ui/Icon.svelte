<script>
 // FULL EXAMPLE -with- tailwind usage
 //
 //      <Icon name="folder_open"
 //            title="my title"
 //            class="bg-gray-800 text-gray-400" ... now passes through classes - can add tailwind colors ETC here
 //                                                  NOTE: text-2xl seems to be the DEFAULT size (hmmm)
 //                                                  ... BECAUSE .material-icons makes font-size: 24px (which is 1.5 the size of tw fonts - 16px)
 //            on:click={sideBar.toggle}
 //
 //            size="1.5rem"        ... OLD non-tailwind size override
 //                                     NOTE: 1.5rem seems to be the DEFAULT (hmmm)
 //                                           ... BECAUSE .material-icons makes font-size: 24px (which is 1.5 the size of tw fonts - 16px)
 //
 //            style="whatever"     ... OLD non-tailwind styling option
 //      />
 //
 // AI: update TOOLING.md for "Material Icon Setup" (once we decide HOW to resolve CSS conflicts with "css specificity"
 //     1. install material-icons
 //        - public/index.html
 //          =================
 //          ...
 //          <!-- KJB: Material UI Icons (used by src/util/ui/Icon.svelte)  -->
 //          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
 //        - network overhead (from <link>):
 //            1 kb: https://fonts.googleapis.com/icon?family=Material+Icons
 //          101 kb: https://fonts.gstatic.com/s/materialicons/v78/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2
 //        - NOTE: Can specify which of the icon themes are desired
 //          * Filled, Outlined, Rounded, Two-Tone, Sharp (choose the one you want):
 //            <link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet">
 //          * and change the material-icons css class reference (in Icon.svelte) to:
 //            - material-icons
 //            - material-icons-outlined
 //            - material-icons-two-tone
 //            - material-icons-round
 //            - material-icons-sharp
 //     2. referenced in app component: src/util/ui/Icon.svelte
 //     3. resolve tailwind/material-icons css "css specificity" conflicts
 //        a. tailwind.config.js
 //           ==================
 //           //          ... 
 //           // KJB: allow tailwind css classes to override others (ex: material-icons)
 //           important: true,
 //        b. ALTERNATE: use selector strategy
 //           ... see: https://tailwindcss.com/docs/configuration#selector-strategy
 //
 // AI: CONSIDER: adding general tailwind classes ALL the time
 //     GENERAL: select-none cursor-default (MUST resolve conflict with button cursor-pointer)
 // 
 // AI: CONSIDER: adding support for asButton option
 //     - adds needed tailwind classes PROB: some require alternate color (unknown by util)
 //       BUTTON RELATED:  cursor-pointer hover:text-white (client-supplied color)
 //                        NOTE: tailwind typically addes focus: directives on <input> buttons
 //                              FOCUS: is only applicable on button or input etc (text cannot have focus)
 //     - alternate: provide <IconButton> that wraps <Button>

 export let name;       // from Material Design icon names (https://material.io/resources/icons/)
                        // - use: 'NONE' for NO icon
                        // - DEPENDANCY: https://fonts.googleapis.com/icon?family=Material+Icons

 export let size = '';  // optional one-off size override ('1.4rem', '80%', 'small', etc.)
                        //         KEY: In this context, it is TRUELY GLOBAL, so be careful
                        //           * :global(.material-icons) {
                        //	            font-size: 1.4rem;
                        //           }

 export let style = ''; // OPTIONAL: inline styling

 let clazz = '';        // OPTIONAL: additional css classes (nice for tailwind)
 export {clazz as class};

 // provide optional one-off size override
 $: style += size ? ` font-size: ${size};` : '';
 // $: console.log(`xx Icon: style="${style}"`);
</script>

<!-- $$restProps pass through things like title="Tootip here" -->
{#if name !== 'NONE'}
  <i class="material-icons {clazz}" {style} on:click {...$$restProps}>{name}</i>
{/if}
