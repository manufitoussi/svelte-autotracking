<script lang="ts">
  import { getStore } from "$lib/svelte-autotracking";
  import svelteLogo from "./assets/svelte.svg";
  import Named from "./lib/named";
  import viteLogo from "/vite.svg";
  const named = getStore(new Named());
</script>

<main>
  
  <h1>Sample Autotracking</h1>

  <div class="card">
    <p>Named [{$named.name}]</p>
    <p>Other Named [{$named.otherName}]</p>
    <button on:click={() => $named.resetOtherName()}>reset other name</button>
  </div>

</main>

<style>
 
</style>
