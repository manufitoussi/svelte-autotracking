<script lang="ts">
  import Named from "$app/lib/named";
  import { useStore } from "$lib";
  import { afterUpdate } from "svelte";

  const named = useStore(new Named());
  let updateCount = 0;
  afterUpdate(() => {
    updateCount++;
  });
</script>

<div class="card">
  <h2>
    <code>Named</code> class with autotracking capabilities from decorator
  </h2>
  <dl>
    <dt>name field</dt>
    <dd data-testid="name">{$named.name}</dd>
    <dt>other name field</dt>
    <dd data-testid="otherName">{$named.otherName}</dd>
  </dl>
  <button data-testid="changeName" on:click={() => $named.changeName("hello")}
    >Call change name</button
  >
  <button data-testid="resetOtherName" on:click={() => $named.resetOtherName()}
    >Call reset other name</button
  >

  <p><small data-testid="updateCount">{updateCount}</small></p>
</div>
