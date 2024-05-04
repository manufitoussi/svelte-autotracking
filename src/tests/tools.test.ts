import { describe, it, expect } from 'vitest';
import { classify, typeOf, isEqual } from '$lib/tools';

describe('tools', () => {
	it('classify', () => {
		expect(classify('hello')).toBe('Hello');
		expect(classify('hello-you')).toBe('HelloYou');
		expect(classify('hello_you')).toBe('HelloYou');
		expect(classify('helloYou')).toBe('HelloYou');
		expect(classify('hello_You')).toBe('HelloYou');
		expect(classify('hello_you_bro')).toBe('HelloYouBro');
		expect(classify('Hello_You')).toBe('HelloYou');
		expect(classify('hello you')).toBe('Hello you');
		expect(classify('hello/you')).toBe('Hello/you');
	});

	it('typeOf', () => {

		// typeOf(null);                   // 'null'
		// typeOf(undefined);              // 'undefined'
		// typeOf('michael');              // 'string'
		// typeOf(new String('michael'));  // 'string'
		// typeOf(101);                    // 'number'
		// typeOf(new Number(101));        // 'number'
		// typeOf(true);                   // 'boolean'
		// typeOf(new Boolean(true));      // 'boolean'
		// typeOf([1, 2, 90]);             // 'array'
		// typeOf(/abc/);                  // 'regexp'
		// typeOf(new Date());             // 'date'
		// typeOf(event.target.files);     // 'filelist'
		// typeOf(new Error('teamocil'));  // 'error'
		// typeOf({ a: 'b' });             // 'object'

		expect(typeOf(null)).toBe('null');
		expect(typeOf(undefined)).toBe('undefined');
		expect(typeOf('michael')).toBe('string');
		expect(typeOf(new String('michael'))).toBe('string');
		expect(typeOf(101)).toBe('number');
		expect(typeOf(new Number(101))).toBe('number');
		expect(typeOf(true)).toBe('boolean');
		expect(typeOf(new Boolean(true))).toBe('boolean');
		expect(typeOf([1, 2, 90])).toBe('array');
		expect(typeOf(/abc/)).toBe('regexp');
		expect(typeOf(new Date())).toBe('date');
		expect(typeOf({ a: 'b' })).toBe('object');
		expect(typeOf(new Error('teamocil'))).toBe('error');
		expect(typeOf({})).toBe('object');
	});

	it('isEqual', () => {
		expect(isEqual(1, 1)).toBe(true);
		expect(isEqual(1, 2)).toBe(false);
		expect(isEqual(1, '1')).toBe(false);
		expect(isEqual(1, '1', { isWeakComparison: true })).toBe(true);
		expect(isEqual(1, '2', { isWeakComparison: true })).toBe(false);
		expect(isEqual('test', 'test')).toBe(true);
		expect(isEqual('test', 'test1')).toBe(false);
		expect(isEqual(true, true)).toBe(true);
		expect(isEqual(false, false)).toBe(true);
		expect(isEqual(true, false)).toBe(false);
		expect(isEqual(null, null)).toBe(true);
		expect(isEqual(undefined, undefined)).toBe(true);
		expect(isEqual(null, undefined)).toBe(false);
		expect(isEqual(NaN, NaN)).toBe(false);
		expect(isEqual([], [])).toBe(true);
		expect(isEqual([1, 2], [1, 2])).toBe(true);
		expect(isEqual([1, 2], [1, 3])).toBe(false);
		expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
		expect(isEqual([1, 2, 3], [1, 2])).toBe(false);

		const obj1 = { a: 1, b: 2 };
		const obj1bis = obj1;
		const obj2 = { a: 1, b: 2 };

		expect(isEqual(obj1, obj1)).toBe(true);
		expect(isEqual(obj1, obj1bis)).toBe(true);
		expect(isEqual(obj1, obj2)).toBe(false);

		const date = new Date();
		const dateBis = new Date(date.getTime());
		const date2 = new Date(date.getTime() + 1000);

		expect(isEqual(date, date)).toBe(true);
		expect(isEqual(date, dateBis)).toBe(true);
		expect(isEqual(date, date2)).toBe(false);

	});


});