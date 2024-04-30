import { isEqual } from "$lib/tools";
import { writable, type Invalidator, type Subscriber, type Unsubscriber, type Updater } from "svelte/store";

export interface Autotrackable<T> {
  _store: any;
  _startTracking: boolean;
  get store(): any;
  updateSubscribers(): void;
}

export interface AutotrackableStore<T extends Autotrackable<T>> {
  subscribe: (run: Subscriber<T>, invalidate?: Invalidator<T>) => Unsubscriber;
  update: (fn: Updater<T>) => void;
  set: (value: T) => void;
}

export function createAutotracked<T extends Autotrackable<T>>(instance: T) {
  const { subscribe, update, set } = writable(instance);
  const store = {
    subscribe,
    update,
    set,
  };
  instance._store = store;
  return store;
}

export function getStore<T extends Autotrackable<T>>(instance: T): AutotrackableStore<T> {
  return instance.store;
}

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

export function Autotacking<T extends { new(...args: any[]): {} }>(constructor: T) {
  console.log('Autotacking', constructor.name);
  class AutoTrackingClass extends constructor implements Autotrackable<T> {
    _store: any = null;

    get store() {
      if (!this._store) {
        this._store = createAutotracked(this);
      }

      return this._store;
    }

    _startTracking = false;

    updateSubscribers() {
      if (!this._startTracking) return;
      if (this._store)
        this._store.update(() => this);
    }

    constructor(...args: any[]) {
      super(...args);
      this._startTracking = true;
    }
  };

  return AutoTrackingClass;
}

export function updateAction<T extends Autotrackable<T>>(target: T, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    const result = originalMethod.apply(this, args);
    (this as T).updateSubscribers();
    return result;
  }
}
