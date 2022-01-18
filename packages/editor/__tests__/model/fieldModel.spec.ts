import { FieldModel } from '../../src/AppModel/FieldModel';

describe('Field test', () => {
  it('parse static property', () => {
    const field = new FieldModel('Hello, world!');
    expect(field.isDynamic).toEqual(false);
    expect(field.refs).toEqual({});
    expect(field.rawValue).toEqual('Hello, world!');
  });

  it('parse expression', () => {
    const field = new FieldModel('{{input.value}} + {{list[0].text}}');
    expect(field.isDynamic).toEqual(true);
    expect(field.refs).toEqual({ input: ['value'], list: ['[0]', '[0].text'] });
    expect(field.rawValue).toEqual('{{input.value}} + {{list[0].text}}');
  });

  it('parse object property', () => {
    const field = new FieldModel({ raw: '{{input.value}}', format: 'md' });
    expect(field.isDynamic).toEqual(false);
    expect(field.refs).toEqual({});
    expect(field.rawValue).toEqual({ raw: '{{input.value}}', format: 'md' });
    expect(field.getProperty('raw')!.rawValue).toEqual('{{input.value}}');
    expect(field.getProperty('raw')!.isDynamic).toEqual(true);
    expect(field.getProperty('raw')!.refs).toEqual({ input: ['value'] });
    expect(field.getProperty('format')!.rawValue).toEqual('md');
    expect(field.getProperty('format')!.isDynamic).toEqual(false);
    expect(field.getProperty('format')!.refs).toEqual({});
  });

  it('parse array property', () => {
    const field = new FieldModel({ data: [1, '{{fetch.data}}'] });
    expect(field.isDynamic).toEqual(false);
    expect(field.refs).toEqual({});
    expect(field.rawValue).toEqual({ data: [1, '{{fetch.data}}'] });
    expect(field.getProperty('data')!.rawValue).toEqual([1, '{{fetch.data}}']);
    expect(field.getProperty('data')!.isDynamic).toEqual(false);
    expect(field.getProperty('data')!.refs).toEqual({});
    expect(field.getProperty('data')!.getProperty(0)!.rawValue).toEqual(1);
    expect(field.getProperty('data')!.getProperty(0)!.isDynamic).toEqual(false);
    expect(field.getProperty('data')!.getProperty(1)!.rawValue).toEqual('{{fetch.data}}');
    expect(field.getProperty('data')!.getProperty(1)!.isDynamic).toEqual(true);
    expect(field.getProperty('data')!.getProperty(1)!.refs).toEqual({ fetch: ['data'] });
  });
});
