import { isPromise } from './object';

export function callWithErrorHandling(
  fn: Function,
  args?: unknown[],
  handlerError?: (err: Error) => void
) {
  let res;

  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    if (handlerError) {
      handlerError(new Error(String(err)));
    }
  }

  return res;
}

export function callWithAsyncErrorHandling(
  fn: Function | Function[],
  args?: unknown[],
  handlerError?: (err: Error) => void
): any[] {
  if (typeof fn === 'function') {
    const res = callWithErrorHandling(fn, args, handlerError);

    if (res && isPromise(res)) {
      res.catch(err => {
        if (handlerError) {
          handlerError(new Error(String(err)));
        }
      });
    }

    return res;
  } else if (Array.isArray(fn)) {
    const values = [];

    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], args, handlerError));
    }

    return values;
  }

  return [];
}

export function memo<T, P extends any[]>(
  fn: (...params: P) => T,
  compare: (preParams: P | [], newParams: P) => boolean
): (...params: P) => T {
  let result: T | null = null;
  let preParams: P | [] = [];

  return function (...params) {
    if (result !== null && compare(preParams, params)) {
      return result;
    } else {
      preParams = params;
      return (result = fn(...params));
    }
  };
}
