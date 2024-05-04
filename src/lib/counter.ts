import { Autotracking, tracked, updateAction } from "$lib";

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

	@updateAction
	forceCount(value: number) {
		// @ts-ignore
		this.__count = value;
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

	@updateAction
	incrementAll() {
		this.silentSet('_count', this.count + 1);
		this.silentSet('_count2', this.count2 + 1);
	}

	@updateAction
	decrementAll() {
		this.silentSet('_count', this.count - 1);
		this.silentSet('_count2', this.count2 - 1);
	}

}

export default Counter;