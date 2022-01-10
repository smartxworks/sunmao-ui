import { FieldModel } from '../../src/AppModel/FieldModel';

describe('Field test', () => {
  it('parse static property', () => {
    const field = new FieldModel('Hello, world!');
    expect(field.isDynamic).toEqual(false);
    expect(field.refs).toEqual([]);
    expect(field.rawValue).toEqual('Hello, world!');
  });

  it('parse expression', () => {
    const field = new FieldModel('{{input.value}} + {{select.value}}');
    expect(field.isDynamic).toEqual(true);
    expect(field.refs).toEqual(['input', 'select']);
    expect(field.rawValue).toEqual('{{input.value}} + {{select.value}}');
  });

  it('parse object property', () => {
    const field = new FieldModel({raw: '{{input.value}}', format: 'md'});
    expect(field.isDynamic).toEqual(false);
    expect(field.refs).toEqual([]);
    expect(field.rawValue).toEqual({raw: '{{input.value}}', format: 'md'});
    expect(field.getProperty('raw').value).toEqual('{{input.value}}');
    expect(field.getProperty('raw').isDynamic).toEqual(true);
    expect(field.getProperty('raw').refs).toEqual(['input']);
    expect(field.getProperty('format').value).toEqual('md');
    expect(field.getProperty('format').isDynamic).toEqual(false);
    expect(field.getProperty('format').refs).toEqual([]);
  });
});
