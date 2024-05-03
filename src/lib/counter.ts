import { Autotracking, tracked } from "$lib";

class Counter extends Autotracking {

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

	incrementAll() {
		this.increment();
		this.increment2();
	}

	decrementAll() {
		this.decrement();
		this.decrement2();
	}

}

export default Counter;