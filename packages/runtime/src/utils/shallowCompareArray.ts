export function shallowCompareArray<T>(arr1: Array<T>, arr2: Array<T>): boolean {
  if (arr1.length !== arr2.length) return false;
  for (const i in arr1) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}
