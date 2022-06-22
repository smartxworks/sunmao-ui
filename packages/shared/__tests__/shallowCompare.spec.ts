import { shallowCompare } from '../src/utils/shallowCompare';

describe('shallowCompare function', () => {
  it('compare values', () => {
    expect(shallowCompare(undefined, undefined)).toBe(true);
    expect(shallowCompare(0, 0)).toBe(true);
    expect(shallowCompare(0, false)).toBe(false);
    expect(shallowCompare(undefined, {})).toBe(false);
    expect(shallowCompare({}, {})).toBe(true);
    expect(shallowCompare({ a: 1 }, { a: 1 })).toBe(true);
    expect(shallowCompare({ a: 1 }, { a: 1, b: 1 })).toBe(false);
    expect(shallowCompare({ a: undefined }, { b: undefined })).toBe(false);
    expect(shallowCompare([], [])).toBe(true);
    expect(shallowCompare([1, 2, 3, 4], [1, 2, 3, 4])).toBe(true);
    expect(shallowCompare([1, 2, 3, 4], [1, 2, 3, 4, 5])).toBe(false);
  });
});
