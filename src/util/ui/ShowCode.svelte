<script>
 import {HighlightSvelte}           from "svelte-highlight";
 import {atomOneDark, atomOneLight} from "svelte-highlight/styles";
 import fetchTextResource           from "../fetchTextResource";

 // AI/L8TR: tap into tw-themes to control dark/light (requires reflection from tw-themes)
 //          WowZee: by tapping into tw-themes background color, atomOneDark/atomOneLight code themes are virtually the same
 //                  BECAUSE: most of what changes is the background
 //                  MINOR STUFF: like carets <>
 //                  STILL BETTER TO SWITCH UP atomOneDark/atomOneLight

 // devise the theme "in effect"
 // AI: try making CSS overrides here (rather than mutating this theme)
 const codeTheme = atomOneDark
   .replaceAll('overflow-x: auto', 'overflow-x: visable')              // our app controls horizontal scroll bars
   .replaceAll(/background:.*;/g,  'background: var(--twt-backdrop);') // tap into same background color
   .replaceAll(/padding:.*;/g,     ''); // our app controls all padding
 // console.log(`XX codeTheme: ${codeTheme}`);

 // INPUT: the code module to display
 export let moduleName; // ... EX: 'Basics.svelte', 'DynamicsTableUnder.svelte', etc.
</script>

<svelte:head>
  {@html codeTheme}
</svelte:head>

{#await fetchTextResource(`/demoCode/${moduleName}`)}
  <p>...waiting</p>
{:then code}
  <HighlightSvelte {code} style="font-size: 0.7rem" />
{:catch error}
  <p style="color: red">Problem accessing module {moduleName} ...{error.message}</p>
{/await}
