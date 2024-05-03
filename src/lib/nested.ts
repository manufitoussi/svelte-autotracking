import { Autotracking, AutotrackingFromStore, tracked, type IAutotrackable } from "$lib";

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