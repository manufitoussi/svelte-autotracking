<script lang="ts">
  import DoubleCounter from "$app/components/DoubleCounter.svelte";
  import Named from "$app/components/Named.svelte";
  import Nested from "$app/components/Nested.svelte";

  import { afterUpdate } from "svelte";
  afterUpdate(() => {
    console.log("update page", arguments);
  });
</script>

<main>
  <h1>Sample Autotracking</h1>

  <Named />

  <hr />

  <DoubleCounter />

  <hr />

  <Nested />
</main>

<style>
</style>
