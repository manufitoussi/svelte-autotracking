import { writable, type Invalidator, type Subscriber, type Unsubscriber, type Updater } from "svelte/store";
import { isEqual } from "./tools";

function createAutotracked<T extends IAutotrackable<T>>(instance: T) {
  const { subscribe, update, set } = writable(instance);
  const store = {
    subscribe,
    update,
    set,
    _isAutotracking: true,
    isAutotracking() {
      return store._isAutotracking;
    },
    stopAutotrack() {
      store._isAutotracking = false;
    },
    startAutotrack() {
      store._isAutotracking = true;
    },
  };
  instance.__autotracking_store = store;
  return store;
}

function getTrackedValue<T extends IAutotrackable<T>>(instance: T, key: string): any {
  return (instance as any)[`__autotracking_tracked_${key}`];
}

function setTrackedValue<T extends IAutotrackable<T>>(instance: T, key: string, value: any) {
  (instance as any)[`__autotracking_tracked_${key}`] = value;
}

/**
 * Autotrackable interface.
 */
export interface IAutotrackable<T> {
  __autotracking_store: any;
  __autotracking_getStore(): any;
  __autotracking_update(): void;
}


/**
 * Autotrackable store interface.
 */
export interface IAutotrackableStore<T extends IAutotrackable<T>> {
  subscribe: (run: Subscriber<T>, invalidate?: Invalidator<T>) => Unsubscriber;
  update: (fn: Updater<T>) => void;
  set: (value: T) => void;
  _isAutotracking: boolean;
  isAutotracking: () => boolean;
  stopAutotrack: () => void;
  startAutotrack: () => void;
}

/**
 * Use the autotrackable store of an autotrackable instance.
 * @param instance Autotrackable instance
 * @returns Autotrackable store
 * 
 * @example
 * ```ts
 * import { useStore } from 'svelte-autotracking';
 * const store = useStore(instance);
 * ```
 */
export function useStore<T extends IAutotrackable<T>>(instance: T): IAutotrackableStore<T> {
  return instance.__autotracking_getStore();
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

  Object.defineProperty(Class, `__autotracking_tracked_${key}`, {
    writable: true,
    value: undefined,
  });

  Object.defineProperty(Class, key, {
    get() {
      return getTrackedValue(this, key);
    },
    set(value) {
      const oldValue = getTrackedValue(this, key);
      if (isEqual(oldValue, value)) return;
      setTrackedValue(this, key, value);
      if (useStore(this)?.isAutotracking())
        triggerUpdate(this);
    },
  });
}

/**
 * Set a tracked field value without triggering an update to subscribers.
 * @param instance Autotrackable instance.
 * @param propertyKey Field name. 
 * @param value New value.
 */
export function silentSet<T extends IAutotrackable<T>>(instance: T, propertyKey: string, value: any) {
  setTrackedValue(instance, propertyKey, value);
}

/**
 * Trigger an update to subscribers of an autotrackable instance.
 * @param instance Autotrackable instance.
 */
export function triggerUpdate<T extends IAutotrackable<T>>(instance: T) {
  instance?.__autotracking_update();
}

/**
 * Class decorator to declare as autotrackable.
 * 
 * Adds autotracking capabilities to the class : 
 * - A store property is added to the class instance.
 * - The store property is updated when a tracked field is modified.
 * - The store property can be used to subscribe to changes.
 * - The updateAfter decorator can be used to automatically update subscribers after a method call.
 * - The manual call of triggerUpdate can be used to force an update.
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
    __autotracking_store: any = null;

    __autotracking_getStore() {
      if (!this.__autotracking_store) {
        this.__autotracking_store = createAutotracked(this);
      }

      return this.__autotracking_store;
    }

    __autotracking_update() {
      if (this.__autotracking_store)
        this.__autotracking_store.update(() => this);
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
 * - The updateAfter decorator can be used to automatically update subscribers after a method call.
 * - The manual call of triggerUpdate() can be used to force an update.
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
export class Autotracking extends AutotrackingFromStore() { };


/**
 * Base class to add autotracking capabilities to a class. Store is provided by a function that return the main Autotraking object.
 * 
 * @param fromStore Function that returns the main Autotraking object.
 * @returns The new class with autotracking capabilities.
 * 
 */
export function AutotrackingFromStore(fromStore: (() => IAutotrackable<Autotracking>) | undefined = undefined) {
  return class Autotracking implements IAutotrackable<Autotracking> {
    __autotracking_store: any = null;

    __autotracking_getStore() {
      if (fromStore) {
        const owner = fromStore.bind(this)();
        return owner ? useStore(owner) : null;
      }

      if (!this.__autotracking_store) {
        this.__autotracking_store = createAutotracked(this);
      }

      return this.__autotracking_store;
    }

    __autotracking_update() {
      if (fromStore)
        return triggerUpdate(fromStore.bind(this)());
      if (this.__autotracking_store)
        this.__autotracking_store.update(() => this);
    }
  }
}

/**
 * Method decorator to trigger an update on subscribers after the method call.
 * @param target Autotrackable class.
 * @param propertyKey Method name.
 * @param descriptor Method descriptor.
 */
export function updateAfter<T extends IAutotrackable<T>>(target: T, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    const result = originalMethod.apply(this, args);
    triggerUpdate(this as T);
    return result;
  }
}
