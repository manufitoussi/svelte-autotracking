import { Counter, DoubleCounter } from '$app/lib/counter';
import { Owner } from '$app/lib/nested';
import { silentSet, triggerUpdate, useStore } from '$lib';
import { describe, expect, it } from 'vitest';

describe('autotraking', () => {
	it('Autotracking class with only one tracked field', () => {
		const counter = new Counter();

		expect(counter.count).toBe(0);

		const store = useStore(counter);

		let currentCount = 0;

		let updateCount = 0;

		store.subscribe((counter) => {
			updateCount++;
			expect(counter.count).toBe(currentCount);
		});

		expect(updateCount).toBe(1);

		currentCount = 1;
		counter.increment();
		expect(updateCount).toBe(2);

		currentCount = 2;
		counter.increment();
		expect(updateCount).toBe(3);

		currentCount = 1;
		counter.decrement();
		expect(updateCount).toBe(4);

		triggerUpdate(counter);
		expect(updateCount).toBe(5);

		silentSet(counter, '_count', 6);
		expect(updateCount).toBe(5);
		currentCount = 6;
		triggerUpdate(counter);
		expect(updateCount).toBe(6);

		currentCount = 10;
		counter.forceCount(10);
		expect(updateCount).toBe(7);

	});

	it('Autotracking class with two tracked fields', () => {
		const counter = new DoubleCounter();

		expect(counter.count).toBe(0);
		expect(counter.count2).toBe(0);

		const store = useStore(counter);

		let currentCount = 0;
		let currentCount2 = 0;

		let updateCount = 0;

		store.subscribe((counter) => {
			updateCount++;
			expect(counter.count).toBe(currentCount);
			expect(counter.count2).toBe(currentCount2);
		});

		expect(updateCount).toBe(1);

		currentCount = 1;
		currentCount2 = 1;
		counter.incrementAll();
		expect(updateCount).toBe(2);

		store.stopAutotrack();
		counter.incrementBoth();
		store.startAutotrack();
		expect(updateCount).toBe(2);

		currentCount = 3;
		currentCount2 = 2;
		counter.increment();
		expect(updateCount).toBe(3);

	});

	it('Autotracking class with nested', () => {

		const owner = new Owner();
		const nested = owner.nested;

		expect(nested.count).toBe(0);

		const nestedStore = useStore(nested);
		const store = useStore(owner);

		expect(nestedStore).toBe(store);

		let currentCount = 0;
		let updateCount = 0;

		store.subscribe((owner) => {
			updateCount++;
			expect(owner.nested.count).toBe(currentCount);
		});

		expect(updateCount).toBe(1);

		currentCount = 1;
		nested.increment();
		expect(updateCount).toBe(2);

		store.stopAutotrack();
		currentCount = 2;
		nested.increment();
		store.startAutotrack();

		expect(updateCount).toBe(2);
		triggerUpdate(nested);
		expect(updateCount).toBe(3);

		currentCount = 3;
		nested.increment();
		expect(updateCount).toBe(4);

		currentCount = 10;
		silentSet(nested, 'count', 10);
		expect(updateCount).toBe(4);

		triggerUpdate(nested);
		expect(updateCount).toBe(5);
	});



});