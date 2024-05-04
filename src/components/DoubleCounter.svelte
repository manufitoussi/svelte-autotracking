<script lang="ts">
  import { DoubleCounter } from "$app/lib/counter";
  import { useStore } from "$lib";
  import { afterUpdate } from "svelte";

  const doubleCounter = useStore(new DoubleCounter());
  let updateCount = 0;
  afterUpdate(() => {
    updateCount++;
  });
</script>

<div class="card">
  <h2>
    <code>DoubleCounter</code> class with autotracking capabilities inheriting from
    Counter
  </h2>
  <dl>
    <dt>count field</dt>
    <dd data-testid="count">{$doubleCounter.count}</dd>
    <dt>
      <button on:click={() => $doubleCounter.increment()}>+</button>
      <button on:click={() => $doubleCounter.decrement()}>-</button>
    </dt>
    <dt>count2 field</dt>
    <dd data-testid="count2">{$doubleCounter.count2}</dd>
    <dt>
      <button on:click={() => $doubleCounter.increment2()}>+</button>
      <button on:click={() => $doubleCounter.decrement2()}>-</button>
    </dt>
    <dt>Both</dt>
    <dt>
      <button data-testid="incrementBoth" on:click={() => $doubleCounter.incrementAll()}>+</button>
      <button on:click={() => $doubleCounter.incrementBoth()}>-</button>
    </dt>
  </dl>

  <p><small data-testid="updateCount">{updateCount}</small></p>
</div>
