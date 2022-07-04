import { Type } from '@sinclair/typebox';
import { parseTypeBox } from '../src/utils/spec';

describe('parseTypeBox function', () => {
  it('can parse array', () => {
    const type = Type.Array(Type.Object({}));
    expect(parseTypeBox(type)).toMatchObject([]);
  });
  it('can parse number', () => {
    const type = Type.Number();
    expect(parseTypeBox(type)).toEqual(0);
  });
  it('can parse optional', () => {
    const type = Type.Optional(Type.String());
    expect(parseTypeBox(type)).toEqual(undefined);
  });
  it('can parse object', () => {
    const type = Type.Object({
      key: Type.String(),
      value: Type.Array(Type.String()),
    });
    expect(parseTypeBox(type)).toMatchObject({ key: '', value: [] });
  });

  it('can parse enum', () => {
    expect(
      parseTypeBox(
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
      parseTypeBox(
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
      parseTypeBox(
        Type.Intersect([
          Type.Object({ x: Type.Number() }),
          Type.Object({ y: Type.Number() }),
        ])
      )
    ).toEqual({ x: 0, y: 0 });
  });
  it('can parse array type', () => {
    expect(
      parseTypeBox({
        type: ['string', 'number'],
      })
    ).toEqual('');
    expect(
      parseTypeBox({
        type: ['number', 'string'],
      })
    ).toEqual(0);
  });
});
