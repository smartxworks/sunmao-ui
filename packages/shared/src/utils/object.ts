import { isObject, isArray } from 'lodash-es';

export function traverse(value: unknown, seen: Set<unknown> = new Set()) {
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
    for (const key of Object.keys(value))
      traverse(value[key as keyof typeof value], seen);
  }

  return value;
}

export function isPromise(value: object): value is Promise<unknown> {
  return value instanceof Promise;
}
