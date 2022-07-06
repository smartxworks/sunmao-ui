import { Type } from '@sinclair/typebox';
import { generateDefaultValueFromSpec } from '../src/utils/spec';

describe('generateDefaultValueFromSpec function', () => {
  it('can parse array', () => {
    const type = Type.Array(Type.Object({}));
    expect(generateDefaultValueFromSpec(type)).toMatchObject([]);
  });
  it('can parse number', () => {
    const type = Type.Number();
    expect(generateDefaultValueFromSpec(type)).toEqual(0);
  });
  // Type.Optional can only be judged by the modifier feature provided by the typebox,
  // but this would break the consistency of the function,
  // and it doesn't seem to make much sense to deal with non-object optional alone like Type.Optional(Type.String())
  // Therefore it is possible to determine whether an object's property is optional using spec.required,
  // and if the property is within Type.Object is optional then it is not required.
  it('can parse optional', () => {
    const type = Type.Optional(Type.Object({ str: Type.Optional(Type.String()) }));
    expect(generateDefaultValueFromSpec(type)).toEqual({ str: undefined });
  });
  it('can parse object', () => {
    const type = Type.Object({
      key: Type.String(),
      value: Type.Array(Type.String()),
    });
    expect(generateDefaultValueFromSpec(type)).toMatchObject({ key: '', value: [] });
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
});
