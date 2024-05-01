import { isEqual } from "./tools";
import { writable } from "svelte/store";

import { type Invalidator, type Subscriber, type Unsubscriber, type Updater } from "svelte/store";

export interface IAutotrackableStore<T extends IAutotrackable<T>> {
  subscribe: (run: Subscriber<T>, invalidate?: Invalidator<T>) => Unsubscriber;
  update: (fn: Updater<T>) => void;
  set: (value: T) => void;
}

export interface IAutotrackable<T> {
  _store: any;
  get store(): any;
  updateSubscribers(): void;
}

function _createAutotracked<T extends IAutotrackable<T>>(instance: T) {
  const { subscribe, update, set } = writable(instance);
  const store = {
    subscribe,
    update,
    set,
  };
  instance._store = store;
  return store;
}
/**
 * Get the autotrackable store of an autotrackable instance.
 * @param instance Autotrackable instance
 * @returns Autotrackable store
 * 
 * @example
 * ```ts
 * import { getStore } from 'svelte-autotracking';
 * const store = getStore(instance);
 * ```
 */
export function getStore<T extends IAutotrackable<T>>(instance: T): IAutotrackableStore<T> {
  return instance.store;
}

/**
 * Field decorator to declare as tracked.
 * 
 * Must be used in a class decorated with {@link Autotracking} or which extends one.
 * @param target Autotrackable class.
 * @param key Name of the field to track.
 * @example
 * ```ts
 * import { tracked, Autotacking, IAutotrackable } from 'svelte-autotracking';
 * 
 * ⁣@Autotacking
 * class Named {
 * 
 *   ⁣@tracked
 *   name = 'The Counter';
 *    
 * }
 * 
 * interface Named extends IAutotrackable<Named> { }
 * ```
 */
export function tracked<T>(target: T, key: string) {

  const Class = target as T;

  Object.defineProperty(Class, `_${key}`, {
    writable: true,
    value: undefined,
  });

  Object.defineProperty(Class, key, {
    get() {
      return this[`_${key}`];
    },
    set(value) {
      const oldValue = this[`_${key}`];
      if (isEqual(oldValue, value)) return;
      this[`_${key}`] = value;
      this.updateSubscribers();
    }
  });
}

/**
 * Class decorator to declare as autotrackable.
 * 
 * Adds autotracking capabilities to the class : 
 * - A store property is added to the class instance.
 * - The store property is updated when a tracked field is modified.
 * - The store property can be used to subscribe to changes.
 * - The updateAction decorator can be used to automatically update subscribers after a method call.
 * - The manual call to updateSubscribers() can be used to force an update.
 * 
 * **Note:** Don't forget to extend the class interface with  {@link IAutotrackable}.
 * 
 * @example
 * ```ts
 * import { Autotacking, tracked, IAutotrackable } from 'svelte-autotracking';
 * 
 * ⁣@Autotacking
 * class Named {
 * 
 *   ⁣@tracked
 *   name = 'The name';
 * 
 * }
 * 
 * interface Named extends IAutotrackable<Named> { };
 * 
 * ```
 *  
 * @param constructor The class to be decorated.
 * @returns The new class with autotracking capabilities.
 */
export function Autotracked<T extends { new(...args: any[]): {} }>(constructor: T) {
  class AutoTrackingClass extends constructor implements IAutotrackable<T> {
    _store: any = null;

    get store() {
      if (!this._store) {
        this._store = _createAutotracked(this);
      }

      return this._store;
    }

    updateSubscribers() {
      if (this._store)
        this._store.update(() => this);
    }

  };

  return AutoTrackingClass;
}

/**
 * Base class to add autotracking capabilities to a class.
 * 
 * Adds autotracking capabilities to the class : 
 * - A store property is added to the class instance.
 * - The store property is updated when a tracked field is modified.
 * - The store property can be used to subscribe to changes.
 * - The updateAction decorator can be used to automatically update subscribers after a method call.
 * - The manual call to updateSubscribers() can be used to force an update.
 * 
 * @example
 * ```ts
 * import { Autotracking, tracked } from 'svelte-autotracking';
 * 
 * ⁣class Named extends Autotracking {
 * 
 *   ⁣@tracked
 *   name = 'The name';
 * 
 * }
 * 
 * ```
 */
export class Autotracking implements IAutotrackable<Autotracking> {
  _store: any = null;

  get store() {
    if (!this._store) {
      this._store = _createAutotracked(this);
    }

    return this._store;
  }

  updateSubscribers() {
    if (this._store)
      this._store.update(() => this);
  }
}

/**
 * Method decorator to trigger an update on subscribers after the method call.
 * @param target Autotrackable class.
 * @param propertyKey Method name.
 * @param descriptor Method descriptor.
 */
export function updateAction<T extends IAutotrackable<T>>(target: T, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    const result = originalMethod.apply(this, args);
    (this as T).updateSubscribers();
    return result;
  }
}
