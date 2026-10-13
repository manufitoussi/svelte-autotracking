import { Counter, DoubleCounter } from '$app/lib/counter';
import { Autotracking, tracked, useStore } from '$lib';
import { afterEach, describe, expect, it, vi } from 'vitest';

class List extends Autotracking {

	@tracked
	items: number[] = [];

	@tracked
	date = new Date(2024, 0, 1);
}

function countUpdates(instance: Counter | List) {
	const counter = { updates: 0 };
	useStore(instance).subscribe(() => counter.updates++);
	counter.updates = 0;
	return counter;
}

describe('edge cases', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('does not trigger an update when an array is mutated in place', () => {
		const list = new List();
		const counter = countUpdates(list);

		list.items.push(1);
		expect(counter.updates).toBe(0);

		list.items = [...list.items, 2];
		expect(counter.updates).toBe(1);
	});

	it('does not trigger an update when the new value is equal', () => {
		const list = new List();
		list.items = [1, 2];
		const counter = countUpdates(list);

		list.items = [1, 2];
		list.date = new Date(2024, 0, 1);
		expect(counter.updates).toBe(0);

		list.date = new Date(2024, 0, 2);
		expect(counter.updates).toBe(1);
	});

	it('does not trigger updates while autotracking is stopped', () => {
		const counter = new Counter();
		const updates = countUpdates(counter);
		const store = useStore(counter);

		store.stopAutotrack();
		expect(store.isAutotracking()).toBe(false);
		counter.increment();
		counter.increment();
		expect(updates.updates).toBe(0);
		expect(counter.count).toBe(2);

		store.startAutotrack();
		counter.increment();
		expect(updates.updates).toBe(1);
	});

	it('keeps tracked values per instance', () => {
		const a = new Counter();
		const b = new Counter();

		a.increment();
		expect(a.count).toBe(1);
		expect(b.count).toBe(0);
	});

	it('warns when a tracked field is shadowed by an instance property', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => { });

		const counter = new DoubleCounter();
		// What class fields with [[Define]] semantics (`useDefineForClassFields: true`) do.
		Object.defineProperty(counter, '_count2', { value: 0, writable: true, enumerable: true, configurable: true });

		useStore(counter);
		useStore(new DoubleCounter());
		expect(warn).toHaveBeenCalledTimes(1);
		expect(warn.mock.calls[0][0]).toContain('"_count2"');
		expect(warn.mock.calls[0][0]).toContain('useDefineForClassFields');
	});

	it('does not warn with [[Set]] semantics', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => { });

		useStore(new Counter());
		useStore(new List());
		expect(warn).not.toHaveBeenCalled();
	});
});
