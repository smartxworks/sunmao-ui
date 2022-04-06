import { EQ, NOT, GT, LT, GTE, LTE, AND, OR } from '../src/constants/condition';
import { shouldRender } from '../src/utils/condition';
import type { Condition } from '../src/types/condition';

describe('conditional render', () => {
  it('equal condition', () => {
    // type === 'button'
    const conditions: Condition[] = [
      {
        key: 'type',
        [EQ]: 'button',
      },
    ];

    expect(shouldRender(conditions, { type: 'button' })).toBe(true);
    expect(shouldRender(conditions, { type: 'text' })).toBe(false);
  });

  it('not equal condition', () => {
    // type !== 'text'
    const conditions: Condition[] = [
      {
        key: 'type',
        [NOT]: 'text',
      },
    ];

    expect(shouldRender(conditions, { type: 'button' })).toBe(true);
    expect(shouldRender(conditions, { type: 'text' })).toBe(false);
  });

  it('range condition', () => {
    // number >= 0 && number <= 10
    const conditions: Condition[] = [
      {
        key: 'number',
        [GTE]: 0,
        [LTE]: 10,
      },
    ];

    expect(shouldRender(conditions, { number: -1 })).toBe(false);
    expect(shouldRender(conditions, { number: 0 })).toBe(true);
    expect(shouldRender(conditions, { number: 1 })).toBe(true);
    expect(shouldRender(conditions, { number: 10 })).toBe(true);
    expect(shouldRender(conditions, { number: 11 })).toBe(false);
  });

  it('not in range condition', () => {
    // number < 0 || number > 10
    const conditions: Condition[] = [
      {
        or: [
          {
            key: 'number',
            [LT]: 0,
          },
          {
            key: 'number',
            [GT]: 10,
          },
        ],
      },
    ];

    expect(shouldRender(conditions, { number: -1 })).toBe(true);
    expect(shouldRender(conditions, { number: 0 })).toBe(false);
    expect(shouldRender(conditions, { number: 1 })).toBe(false);
    expect(shouldRender(conditions, { number: 10 })).toBe(false);
    expect(shouldRender(conditions, { number: 11 })).toBe(true);
  });

  it('unknown condition', () => {
    // type !== 'text'
    const conditions: any[] = [
      {
        key: 'type',
        [NOT]: 'text',
        unknown: 'value',
      },
    ];

    expect(shouldRender(conditions, { type: 'button' })).toBe(true);
    expect(shouldRender(conditions, { type: 'text' })).toBe(false);
  });
});
