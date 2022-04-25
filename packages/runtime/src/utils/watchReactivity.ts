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
import { hasChanged, isArray, isFunction, NOOP } from '@vue/shared';
import {
  traverse,
  consoleError,
  consoleWarn,
  ConsoleType,
  callWithAsyncErrorHandling,
  callWithErrorHandling,
} from '@sunmao-ui/shared';

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
        else if (isFunction(s))
          return callWithErrorHandling(s, [], error => {
            consoleError(ConsoleType.Reactivity, 'getter', error.message);
          });
        else consoleWarn(ConsoleType.Reactivity, 'getter', 'invalid source');
      });
  } else if (isRef(source)) {
    getter = () => source.value;
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else if (isFunction(source)) {
    if (cb) {
      // getter with cb
      getter = () =>
        callWithErrorHandling(source, [], error => {
          consoleError(ConsoleType.Reactivity, 'getter', error.message);
        });
    } else {
      // no cb -> simple effect
      getter = () => {
        if (cleanup) cleanup();

        return callWithErrorHandling(source, [onInvalidate], error => {
          consoleError(ConsoleType.Reactivity, 'callback', error.message);
        });
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
      callWithErrorHandling(fn, [], error => {
        consoleError(ConsoleType.Reactivity, 'cleanup', error.message);
      });
    };
  };

  let oldValue = isArray(source) ? [] : INITIAL_WATCHER_VALUE;
  const applyCb = cb
    ? () => {
        const newValue = runner();
        if (deep || hasChanged(newValue, oldValue)) {
          // cleanup before running cb again
          if (cleanup) cleanup();

          callWithAsyncErrorHandling(
            cb,
            [
              newValue,
              // pass undefined as the old value when it's changed for the first time
              oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue,
              onInvalidate,
            ],
            error => {
              consoleError(ConsoleType.Reactivity, 'callback', error.message);
            }
          );
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
