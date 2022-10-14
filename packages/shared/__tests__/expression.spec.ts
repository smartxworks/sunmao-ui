import { parseExpression } from '../src/utils/expression';

describe('parseExpression function', () => {
  it('can parse {{}} expression', () => {
    expect(parseExpression('value')).toMatchObject(['value']);
    expect(parseExpression('{{{id: 123}}}')).toMatchObject([['{id: 123}']]);
    expect(parseExpression('{{ {id: 123} }}')).toMatchObject([[' {id: 123} ']]);
    expect(parseExpression('Hello, {{ value }}!')).toMatchObject([
      'Hello, ',
      [' value '],
      '!',
    ]);

    expect(parseExpression('{{input1.value}}')).toMatchObject([['input1.value']]);
    expect(parseExpression('{{fetch.data}}')).toMatchObject([['fetch.data']]);

    expect(parseExpression('{{{{}}}}')).toMatchObject([[[]]]);

    expect(parseExpression('{{ value }}, {{ input1.value }}!')).toMatchObject([
      [' value '],
      ', ',
      [' input1.value '],
      '!',
    ]);

    const multiline = parseExpression(`{{
    { id: 1 }
    }}`);
    expect(multiline).toMatchInlineSnapshot(`
        Array [
          Array [
            "
            { id: 1 }
            ",
          ],
        ]
      `);
  });
});
