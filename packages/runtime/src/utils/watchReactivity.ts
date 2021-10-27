// forked from https://github.com/vue-reactivity/watch/blob/master/src/index.ts by Anthony Fu
// ported from https://github.com/vuejs/vue-next/blob/master/packages/runtime-core/src/apiWatch.ts by Evan You

/* eslint-disable @typescript-eslint/ban-types */

import {
  ComputedRef,
  effect,
  Ref,
  ReactiveEffectOptions,
  isReactive,
  isRef,
  stop,
} from '@vue/reactivity';
import { hasChanged, isArray, isFunction, isObject, NOOP, isPromise } from '@vue/shared';

export function callWithErrorHandling(fn: Function, type: string, args?: unknown[]) {
  let res;
  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, type);
  }
  return res;
}

export function callWithAsyncErrorHandling(
  fn: Function | Function[],
  type: string,
  args?: unknown[]
): any[] {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, type, args);
    if (res && isPromise(res)) {
      res.catch(err => {
        handleError(err, type);
      });
    }
    return res;
  }

  const values = [];
  for (let i = 0; i < fn.length; i++)
    values.push(callWithAsyncErrorHandling(fn[i], type, args));

  return values;
}

function handleError(err: unknown, type: String) {
  console.error(new Error(`[@vue-reactivity/watch]: ${type}`));
  console.error(err);
}

export function warn(message: string) {
  console.warn(createError(message));
}

function createError(message: string) {
  return new Error(`[reactivue]: ${message}`);
}

export type WatchEffect = (onInvalidate: InvalidateCbRegistrator) => void;

export type WatchSource<T = any> = Ref<T> | ComputedRef<T> | (() => T);

export type WatchCallback<V = any, OV = any> = (
  value: V,
  oldValue: OV,
  onInvalidate: InvalidateCbRegistrator
) => any;

export type WatchStopHandle = () => void;

type MapSources<T> = {
  [K in keyof T]: T[K] extends WatchSource<infer V>
    ? V
    : T[K] extends object
    ? T[K]
    : never;
};

type MapOldSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V>
    ? Immediate extends true
      ? V | undefined
      : V
    : T[K] extends object
    ? Immediate extends true
      ? T[K] | undefined
      : T[K]
    : never;
};

type InvalidateCbRegistrator = (cb: () => void) => void;
const invoke = (fn: Function) => fn();
const INITIAL_WATCHER_VALUE = {};

export interface WatchOptionsBase {
  /**
   * @depreacted ignored in `@vue-reactivity/watch` and will always be `sync`
   */
  flush?: 'sync' | 'pre' | 'post';
  onTrack?: ReactiveEffectOptions['onTrack'];
  onTrigger?: ReactiveEffectOptions['onTrigger'];
}

export interface WatchOptions<Immediate = boolean> extends WatchOptionsBase {
  immediate?: Immediate;
  deep?: boolean;
}

// Simple effect.
export function watchEffect(
  effect: WatchEffect,
  options?: WatchOptionsBase
): WatchStopHandle {
  return doWatch(effect, null, options);
}

// overload #1: array of multiple sources + cb
// Readonly constraint helps the callback to correctly infer value types based
// on position in the source array. Otherwise the values will get a union type
// of all possible value types.
export function watch<
  T extends Readonly<Array<WatchSource<unknown> | object>>,
  Immediate extends Readonly<boolean> = false
>(
  sources: T,
  cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>,
  options?: WatchOptions<Immediate>
): WatchStopHandle;

// overload #2: single source + cb
export function watch<T, Immediate extends Readonly<boolean> = false>(
  source: WatchSource<T>,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchOptions<Immediate>
): WatchStopHandle;

// overload #3: watching reactive object w/ cb
export function watch<T extends object, Immediate extends Readonly<boolean> = false>(
  source: T,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchOptions<Immediate>
): WatchStopHandle;

// implementation
export function watch<T = any>(
  source: WatchSource<T> | WatchSource<T>[],
  cb: WatchCallback<T>,
  options?: WatchOptions
): WatchStopHandle {
  return doWatch(source, cb, options);
}

function doWatch(
  source: WatchSource | WatchSource[] | WatchEffect,
  cb: WatchCallback | null,
  { immediate, deep, onTrack, onTrigger }: WatchOptions = {}
): WatchStopHandle {
  let getter: () => any;
  if (isArray(source) && !isReactive(source)) {
    getter = () =>
      // eslint-disable-next-line array-callback-return
      source.map(s => {
        if (isRef(s)) return s.value;
        else if (isReactive(s)) return traverse(s);
        else if (isFunction(s)) return callWithErrorHandling(s, 'watch getter');
        else warn('invalid source');
      });
  } else if (isRef(source)) {
    getter = () => source.value;
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else if (isFunction(source)) {
    if (cb) {
      // getter with cb
      getter = () => callWithErrorHandling(source, 'watch getter');
    } else {
      // no cb -> simple effect
      getter = () => {
        if (cleanup) cleanup();

        return callWithErrorHandling(source, 'watch callback', [onInvalidate]);
      };
    }
  } else {
    getter = NOOP;
  }

  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }

  let cleanup: () => void;
  const onInvalidate: InvalidateCbRegistrator = (fn: () => void) => {
    cleanup = (runner as any).options.onStop = () => {
      callWithErrorHandling(fn, 'watch cleanup');
    };
  };

  let oldValue = isArray(source) ? [] : INITIAL_WATCHER_VALUE;
  const applyCb = cb
    ? () => {
        const newValue = runner();
        if (deep || hasChanged(newValue, oldValue)) {
          // cleanup before running cb again
          if (cleanup) cleanup();

          callWithAsyncErrorHandling(cb, 'watch callback', [
            newValue,
            // pass undefined as the old value when it's changed for the first time
            oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue,
            onInvalidate,
          ]);
          oldValue = newValue;
        }
      }
    : undefined;

  const scheduler = invoke;

  const runner = effect(getter, {
    lazy: true,
    onTrack,
    onTrigger,
    scheduler: applyCb ? () => scheduler(applyCb) : scheduler,
  });

  // initial run
  if (applyCb) {
    if (immediate) applyCb();
    else oldValue = runner();
  } else {
    runner();
  }

  const stopWatcher = function () {
    stop(runner);
  };
  stopWatcher.effect = runner;
  return stopWatcher;
}

function traverse(value: unknown, seen: Set<unknown> = new Set()) {
  if (!isObject(value) || seen.has(value)) return value;

  seen.add(value);
  if (isArray(value)) {
    for (let i = 0; i < value.length; i++) traverse(value[i], seen);
  } else if (value instanceof Map) {
    value.forEach((_, key) => {
      // to register mutation dep for existing keys
      traverse(value.get(key), seen);
    });
  } else if (value instanceof Set) {
    value.forEach(v => {
      traverse(v, seen);
    });
  } else {
    for (const key of Object.keys(value)) traverse(value[key], seen);
  }
  return value;
}
