# Svelte Autotracking

> A library to automatically track changes on Svelte stores with decorators.

It's freely inspired by the [`@tracked` decorator](https://api.emberjs.com/ember/release/functions/@glimmer%2Ftracking/tracked) from Ember.js, and it's meant to be used with [Svelte stores](https://svelte.dev/docs/svelte-store).

If you're using Svelte stores, you know that you need create complex logic (like derived stores and custom store) to track changes on your components. Even the simplest of them.

This library aims to simplify this process by providing a set of decorators and helpers that you can use to :
- automatically track changes on your object logic
- and automaticaly create stores to be cosumed by your components.

> You have just to concentrate on your logic, create your objects and let the library handle the rest.

## Example

You can create a class with autotracking capabilities by extending the `Autotracking` class and using the `@tracked` decorator on the properties you want to track.

```ts

import { Autotracking, tracked } from "svelte-autotracking";

/**
 * Counter class with autotracking capabilities.
 */
export class Counter extends Autotracking {

  @tracked
  _count = 0;

  get count() {
    return this._count;
  }

  increment() {
    this._count += 1;
  }

  decrement() {
    this._count -= 1;
  }

}

```

And then, you can use it in your Svelte components like this:

```html
<script>
  import { Counter } from "./Counter.js";
  import { useStore } from "svelte-autotracking";

  const counter = useStore(new Counter());
</script>

<h1>{$counter.count}</h1>
<button on:click={() => $counter.increment()}>+</button>
<button on:click={() => $counter.decrement()}>-</button>
```

So, when you click on the buttons, the `count` property will be automatically updated and the component will re-render. And even if you create a derived class from the `Counter`.


## Installation

```bash
npm install svelte-autotracking
```

or 

```bash
yarn add svelte-autotracking
```

## Requirements : Decorators

This library uses the [decorators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields#decorators) feature of JavaScript, which is currently a stage 2 proposal. So, you need to enable it in your project.

If you're using TypeScript, you can enable it by adding the following configuration to your `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "target": "ES6" // or higher
  }
}
```

If you're using Babel, you can enable it by installing the `@babel/plugin-proposal-decorators` plugin:

```bash 
npm install --save-dev @babel/plugin-proposal-decorators
```

And then, add it to your Babel configuration:

```json
{
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }]
  ]
}
```


---


## How to use this library

### `Autotracking` class

You can create a class with autotracking capabilities by extending the `Autotracking` class.

```ts
import { Autotracking } from "svelte-autotracking";

class MyClass extends Autotracking {
  // your code here
}
```

### `@tracked` decorator

You can use the `@tracked` decorator to automatically track changes on the properties of your class.

```ts
import { Autotracking, tracked } from "svelte-autotracking";

export class MyClass extends Autotracking {
  @tracked
  property = "value";

  method(newValue: string) {
    this.property = newValue;
  }
}
```

So, when you change the `property` value, the component will re-render. even :
  - if you change the value directly
  - if you change the value in a method (like `method` in the example above)
  - if you change the value in a nested object
  - if you derive a new class from `MyClass`


### `useStore` function

You can use the `useStore` function to create a store from an instance of a class with autotracking capabilities.

```ts
import { MyClass } from "./MyClass.js";

const myClass = new MyClass();
const store = useStore(myClass);
```

And then, you can use the `store` in your Svelte components like this:

```html
<script>
  import { MyClass } from "./MyClass.js";
  import { useStore } from "svelte-autotracking";

  const myClass = new MyClass();
  const store = useStore(myClass);
</script>

<h1>{$store.property}</h1>
<button on:click={() => $store.property = "new value"}>Change value</button>
<button on:click={() => $store.method("another new value")}>Change value by method</button>
```

So, when you click on the buttons, the `property` value will be automatically updated and the component will re-render.

### Add capabilities to an existing class

You can add autotracking capabilities to class by using the `Autotracked` decorator.

```ts
import { Autotracked, tracked, type IAutotrackable } from "svelte-autotracking";

@Autotracked
export class MyClass {
  
  @tracked
  property = "value";

  method(newValue: string) {
    this.property = newValue;
  }
}

interface MyClass extends IAutotrackable<Named> { }

```
In this example, the `MyClass` class will have autotracking capabilities, and you can use it in your Svelte components.

> ⚠️ Don't forget to add the `IAutotrackable` interface to the class.<br>
> The `@Autotracked` decorator is a class decorator that adds the autotracking capabilities to the class. And the `IAutotrackable` interface is a generic interface that extends the `IAutotrackable` interface with the properties of the class. Without it, in the component, you will not have class features recognition.

### use the `@tracked` decorator in a nested object

Sometimes, you may want to track changes on a nested object. You can do this by using the `@tracked` decorator on the properties of the nested object and declaring the nested object as autotrackable but by using its parent class.

```ts
import { Autotracking, AutotrackingFromStore, tracked, type IAutotrackable } from 'svelte-autotracking';

export class Owner extends Autotracking {
  nested: Nested;

  constructor() {
    super();
    this.nested = new Nested(this);
  }
}

interface INested extends IAutotrackable<Owner> {
  owner: Owner;
}

export default class Nested extends AutotrackingFromStore(
  // function to get the owner that brings the autotracking capabilities
  function (this: INested) { return this.owner; }
) implements INested {

  owner: Owner;

  @tracked
  count = 0;

  constructor(owner: Owner) {
    super();
    this.owner = owner;
  }

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }
}

```

In this example, the `Nested` class is a nested object of the `Owner` class. And the `Owner` class is the parent class of the `Nested` class. So, you can use the `@tracked` decorator on the properties of the `Nested` class and declare the `Nested` class as autotrackable by using the `IAutotrackable` interface with the `Owner` class.

And then, you can use the `Nested` class in your Svelte components like this:

```html
<script>
  import { Owner } from "./Owner.js";
  import { useStore } from "svelte-autotracking";

  const owner = useStore(new Owner());
  const nested = owner.nested;

</script>

<h1>{$nested.count}</h1>

or

<h1>{$owner.nested.count}</h1>

<button on:click={() => $nested.increment()}>+</button>
<button on:click={() => $nested.decrement()}>-</button>
```

### Trigger a manual update

You can trigger a manual update by calling the `triggerUpdate` method the autotracked object.

```ts
import { triggerUpdate } from "svelte-autotracking";
import { MyClass } from "./MyClass.js";

const myClass = new MyClass();

// trigger a manual update
triggerUpdate(myClass);

```

### Use the `@updateAfter` decorator

You can use the `@updateAfter` decorator to automatically update the store when a method is called event if no property is decorated with `@tracked`.

```ts

import { Autotracking, tracked, updateAfter } from "svelte-autotracking";

export class MyClass extends Autotracking {
  property = "value";

  @updateAfter
  method(newValue: string) {
    this.property = newValue;
  }
}

```

In this example, the `method` method will automatically update the store when it's called, even if the `property` property is not decorated with `@tracked`. So, in a Svelte component, when you call the `method` method, the component will re-render.

### Silent change value without triggering an update

You can change the value of a property without triggering an update by using the `silentSet` function.

```ts
import { silentSet } from "svelte-autotracking";

const myClass = new MyClass();

// change the value without triggering an update
silentSet(myClass, "property", "new value");

```

## Explanation

The `@tracked` decorator is a property decorator that automatically tracks changes on the property of a class. When you change the value of the property, the component will re-render.

Autotracking automatically adds a writable store and `@tracked` decorator add a call to the update function of the store when the property is changed. that's all.


---

## Author

See `AUTHORS.md` for more information.

---

## License

This project is licensed under the `MIT License`. See `LICENSE.md` for details.

---

_&copy;2024 Emmanuel FITOUSSI_
