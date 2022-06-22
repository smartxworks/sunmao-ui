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
