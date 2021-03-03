<script>
 import           './layout/colorTheme'; // initialize our color themes EARLY in our app's life-cycle
 import App  from './App.svelte';
</script>

<!-- launch our production App -->
<App/>

<!-- setup Tailwind CSS (NOTE: do NOT believe lang="postcss" is needed) -->
<style global lang="postcss">

 /* only apply purgecss on utilities, per Tailwind docs */
 /* purgecss start ignore */
 @tailwind base;
 @tailwind components;
 /* purgecss end ignore */

 @tailwind utilities;
</style>
