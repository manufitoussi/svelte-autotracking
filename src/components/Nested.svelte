<script lang="ts">
  import { Owner } from "$app/lib/nested";
  import { useStore } from "$lib";
  import { afterUpdate } from "svelte";

  const owner = useStore(new Owner());
  let updateCount = 0;
  afterUpdate(() => {
    updateCount++;
  });
</script>

<div class="card">
  <h2><code>Counter</code> nested class</h2>
  <dl>
    <dt><code>owner.nested.count</code> field</dt>
    <dd data-testid="count">{$owner.nested.count}</dd>
  </dl>
  <button data-testid="increment" on:click={() => $owner.nested.increment()}
    >+</button
  >
  <button data-testid="decrement" on:click={() => $owner.nested.decrement()}
    >-</button
  >

  <p><small data-testid="updateCount">{updateCount}</small></p>
</div>
