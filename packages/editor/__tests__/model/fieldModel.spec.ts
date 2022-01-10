import { FieldModel } from '../../src/AppModel/FieldModel';

describe('Field test', () => {
  it('parse static property', () => {
    const field = new FieldModel('Hello, world!');
    expect(field.isDynamic).toEqual(false);
    expect(field.refs).toEqual([]);
    expect(field.value).toEqual('Hello, world!');
  });

  it('parse expression', () => {
    const field = new FieldModel('{{input.value}} + {{select.value}}');
    expect(field.isDynamic).toEqual(true);
    expect(field.refs).toEqual(['input', 'select']);
    expect(field.value).toEqual('{{input.value}} + {{select.value}}');
  });
});
