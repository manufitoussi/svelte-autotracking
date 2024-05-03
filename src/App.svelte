<script lang="ts">
  import { useStore } from "$lib";
  import Counter, { DoubleCounter } from "./lib/counter";
  import Named from "./lib/named";
  import { Owner } from "./lib/nested";
  const named = useStore(new Named());
  const counter = useStore(new Counter());
  const doubleCounter = useStore(new DoubleCounter());
  const owner = useStore(new Owner());

  import { afterUpdate } from "svelte";
  afterUpdate(() => {
    console.log("update page", arguments);
  });
</script>

<main>
  <h1>Sample Autotracking</h1>

  <div class="card">
    <h2>
      <code>Named</code> class with autotracking capabilities from decorator
    </h2>
    <dl>
      <dt>name field</dt>
      <dd>{$named.name}</dd>
      <dt>other name field</dt>
      <dd>{$named.otherName}</dd>
    </dl>
    <button on:click={() => $named.changeName("hello")}>Call change name</button
    >
    <button on:click={() => $named.resetOtherName()}
      >Call reset other name</button
    >
  </div>

  <div class="card">
    <h2><code>Counter</code> class with autotracking capabilities</h2>
    <dl>
      <dt>count field</dt>
      <dd>{$counter.count}</dd>
    </dl>
    <button on:click={() => $counter.increment()}>+</button>
    <button on:click={() => $counter.decrement()}>-</button>
  </div>

  <div class="card">
    <h2>
      <code>DoubleCounter</code> class with autotracking capabilities inheriting
      from Counter
    </h2>
    <dl>
      <dt>count field</dt>
      <dd>{$doubleCounter.count}</dd>
      <dt>
        <button on:click={() => $doubleCounter.increment()}>+</button>
        <button on:click={() => $doubleCounter.decrement()}>-</button>
      </dt>
      <dt>count2 field</dt>
      <dd>{$doubleCounter.count2}</dd>
      <dt>
        <button on:click={() => $doubleCounter.increment2()}>+</button>
        <button on:click={() => $doubleCounter.decrement2()}>-</button>
      </dt>
      <dt>Both</dt>
      <dt>
        <button on:click={() => $doubleCounter.incrementAll()}>+</button>
        <button on:click={() => $doubleCounter.decrementAll()}>-</button>
      </dt>
    </dl>
  </div>

  <div class="card">
    <h2><code>Counter</code> nested class</h2>
    <dl>
      <dt><code>owner.nested.count</code> field</dt>
      <dd>{$owner.nested.count}</dd>
    </dl>
    <button on:click={() => $owner.nested.increment()}>+</button>
    <button on:click={() => $owner.nested.decrement()}>-</button>
  </div>
</main>

<style>
</style>
