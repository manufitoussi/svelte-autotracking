import { Autotracking, tracked, updateAfter, silentSet } from "$lib";

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

	@updateAfter
	forceCount(value: number) {
		silentSet(this, '_count', value);
	}

}

/**
 * DoubleCounter class with autotracking capabilities inheriting from Counter.
 */
export class DoubleCounter extends Counter {

	@tracked
	_count2 = 0;

	get count2() {
		return this._count2;
	}

	increment2() {
		this._count2 += 1;
	}

	decrement2() {
		this._count2 -= 1;
	}

	incrementBoth() {
		this.increment();
		this.increment2();
	}

	decrementBoth() {
		this.decrement();
		this.decrement2();
	}

	@updateAfter
	incrementAll() {
		silentSet(this, '_count', this.count + 1);
		silentSet(this, '_count2', this.count2 + 1);
	}

	@updateAfter
	decrementAll() {
		silentSet(this, '_count', this.count - 1);
		silentSet(this, '_count2', this.count2 - 1);
	}

}

export default Counter;