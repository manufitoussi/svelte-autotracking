// Smoke test of the packed library, run against the installed Svelte version.
// Usage: node scripts/smoke-test.cjs (from a project where the package is installed)
const assert = require('node:assert');
const path = require('node:path');
// Resolve modules from the current directory, not from this repository.
const load = require('node:module').createRequire(path.join(process.cwd(), 'index.js'));
const { Autotracking, tracked, useStore } = load('svelte-autotracking');

class Counter extends Autotracking { }
tracked(Counter.prototype, 'count');

const counter = new Counter();
counter.count = 0;
let updates = 0;
useStore(counter).subscribe(() => updates++);
counter.count = 1;

assert.strictEqual(updates, 2);
console.log(`svelte-autotracking OK with svelte ${load('svelte/package.json').version}`);
