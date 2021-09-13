import { Type } from '@sinclair/typebox';
import { m } from 'framer-motion';
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
});
