import { isFunction, isArray } from 'lodash-es';
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
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, args, handlerError);

    if (res && isPromise(res)) {
      res.catch(err => {
        if (handlerError) {
          handlerError(new Error(String(err)));
        }
      });
    }

    return res;
  } else if (isArray(fn)) {
    const values = [];

    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], args, handlerError));
    }

    return values;
  }

  return [];
}
