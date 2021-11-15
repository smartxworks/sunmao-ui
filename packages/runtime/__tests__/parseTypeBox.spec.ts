import { Type } from '@sinclair/typebox';
import { parseTypeBox } from '../src/utils/parseTypeBox';

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
});
