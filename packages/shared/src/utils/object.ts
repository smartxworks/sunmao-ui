export function traverse(value: unknown, seen: Set<unknown> = new Set()) {
  if (typeof value !== 'object' || seen.has(value)) return value;

  seen.add(value);

  if (Array.isArray(value)) {
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
  } else if (value) {
    for (const key of Object.keys(value))
      traverse(value[key as keyof typeof value], seen);
  }

  return value;
}

export function isPromise(value: object): value is Promise<unknown> {
  return value instanceof Promise;
}

export function shallowCompare(obj1: any, obj2: any) {
  if (typeof obj1 === 'object' && typeof obj2 === 'object') {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
    for (const key in obj1) {
      if (key in obj2 && obj1[key] === obj2[key]) {
        continue;
      } else {
        return false;
      }
    }
    return true;
  }
  return obj1 === obj2;
}
