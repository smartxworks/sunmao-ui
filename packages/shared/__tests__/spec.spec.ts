import { Type } from '@sinclair/typebox';
import { AnyTypePlaceholder } from '../src';
import { generateDefaultValueFromSpec } from '../src/utils/spec';

describe('generateDefaultValueFromSpec function', () => {
  it('can parse array', () => {
    const type = Type.Array(
      Type.Object({
        foo: Type.Number(),
      })
    );
    expect(generateDefaultValueFromSpec(type)).toEqual([]);
    expect(generateDefaultValueFromSpec(type, { genArrayItemDefaults: true })).toEqual([
      { foo: 0 },
    ]);
    const type2 = Type.Array(Type.String());
    expect(generateDefaultValueFromSpec(type2)).toEqual([]);
    expect(generateDefaultValueFromSpec(type2, { genArrayItemDefaults: true })).toEqual([
      '',
    ]);
  });
  it('can parse number', () => {
    const type = Type.Number();
    expect(generateDefaultValueFromSpec(type)).toEqual(0);
  });
  it('can parse optional and the value is the default value of its type', () => {
    const type = Type.Optional(Type.Object({ str: Type.Optional(Type.String()) }));
    expect(generateDefaultValueFromSpec(type)).toEqual({ str: '' });
  });
  it('can parse object', () => {
    const type = Type.Object({
      key: Type.String(),
      value: Type.Array(Type.String()),
    });
    expect(generateDefaultValueFromSpec(type)).toMatchObject({ key: '', value: [] });
    expect(
      generateDefaultValueFromSpec(type, { genArrayItemDefaults: true })
    ).toMatchObject({ key: '', value: [''] });
  });

  it('can parse enum', () => {
    expect(
      generateDefaultValueFromSpec(
        Type.KeyOf(
          Type.Object({
            foo: Type.String(),
            bar: Type.String(),
          })
        )
      )
    ).toEqual('foo');
  });

  it('can parse anyOf', () => {
    expect(
      generateDefaultValueFromSpec(
        Type.Union([
          Type.KeyOf(
            Type.Object({
              column: Type.String(),
              'column-reverse': Type.String(),
              row: Type.String(),
              'row-reverse': Type.String(),
            })
          ),
          Type.Array(
            Type.KeyOf(
              Type.Object({
                column: Type.String(),
                'column-reverse': Type.String(),
                row: Type.String(),
                'row-reverse': Type.String(),
              })
            )
          ),
        ])
      )
    ).toEqual('column');
  });
  it('can parse allOf', () => {
    expect(
      generateDefaultValueFromSpec(
        Type.Intersect([
          Type.Object({ x: Type.Number() }),
          Type.Object({ y: Type.Number() }),
        ])
      )
    ).toEqual({ x: 0, y: 0 });
  });
  it('can parse array type', () => {
    expect(
      generateDefaultValueFromSpec({
        type: ['string', 'number'],
      })
    ).toEqual('');
    expect(
      generateDefaultValueFromSpec({
        type: ['number', 'string'],
      })
    ).toEqual(0);
  });
  it('can parse any type', () => {
    expect(generateDefaultValueFromSpec({})).toEqual('');
    expect(generateDefaultValueFromSpec({}, { returnPlaceholderForAny: true })).toEqual(
      AnyTypePlaceholder
    );
    expect(
      (
        generateDefaultValueFromSpec(
          Type.Object({ foo: Type.Object({ bar: Type.Any() }) }),
          { returnPlaceholderForAny: true }
        ) as any
      ).foo.bar
    ).toEqual(AnyTypePlaceholder);
  });
});
