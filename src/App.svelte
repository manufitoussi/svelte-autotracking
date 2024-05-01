<script lang="ts">
  import { getStore } from "$lib";
  import Counter, { DoubleCounter } from "./lib/counter";
  import Named from "./lib/named";
  const named = getStore(new Named());
  const counter = getStore(new Counter());
  const doubleCounter = getStore(new DoubleCounter());

  import { afterUpdate } from 'svelte';
  afterUpdate(() => {
    console.log('update page', arguments);
  });
</script>

<main>
  <h1>Sample Autotracking</h1>

  <div class="card">
    <p>Named [{$named.name}]</p>
    <p>Other Named [{$named.otherName}]</p>
    <button on:click={() => $named.resetOtherName()}>reset other name</button>
  </div>

  <div class="card">
    <h2>Counter</h2>
    <p>Counter : {$counter.count}</p>
    <button on:click={() => $counter.increment()}>+</button>
    <button on:click={() => $counter.decrement()}>-</button>
  </div>

  <div class="card">
    <h2>Double Counter</h2>
    <p>Counters : {$doubleCounter.count} {$doubleCounter.count2}</p>
    <button on:click={() => $doubleCounter.increment()}>+</button>
    <button on:click={() => $doubleCounter.decrement()}>-</button>
    <button on:click={() => $doubleCounter.increment2()}>+</button>
    <button on:click={() => $doubleCounter.decrement2()}>-</button>
    <button on:click={() => $doubleCounter.incrementAll()}>+</button>
    <button on:click={() => $doubleCounter.decrementAll()}>-</button>
  </div>
</main>

<style>
</style>
