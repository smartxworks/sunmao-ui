import { StateManager, parseExpression } from '../src/services/StateManager';

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

  it('can parse $listItem expression', () => {
    expect(parseExpression('{{ $listItem.value }}')).toMatchObject([
      '{{ $listItem.value }}',
    ]);
    expect(parseExpression('{{ $listItem.value }}', true)).toMatchObject([
      [' $listItem.value '],
    ]);
    expect(
      parseExpression(
        '{{ {{$listItem.value}}input.value + {{$moduleId}}fetch.value }}!',
        true
      )
    ).toMatchObject([
      [' ', ['$listItem.value'], 'input.value + ', ['$moduleId'], 'fetch.value '],
      '!',
    ]);
  });
});

describe('evalExpression function', () => {
  const scope = {
    value: 'Hello',
    input1: {
      value: 'world',
    },
    fetch: {
      data: [{ id: 1 }, { id: 2 }],
    },
    checkbox: {
      value: true,
    },
    $listItem: {
      value: 'foo',
    },
    $moduleId: 'moduleBar',
    fooInput: {
      value: 'Yes, ',
    },
    moduleBarFetch: {
      value: 'ok',
    },
  };
  const stateStore = new StateManager();
  it('can eval {{}} expression', () => {
    expect(stateStore.maskedEval('value', false, scope)).toEqual('value');
    expect(stateStore.maskedEval('{{true}}', false, scope)).toEqual(true);
    expect(stateStore.maskedEval('{{ false }}', false, scope)).toEqual(false);
    expect(stateStore.maskedEval('{{[]}}', false, scope)).toEqual([]);
    expect(stateStore.maskedEval('{{ [] }}', false, scope)).toEqual([]);
    expect(stateStore.maskedEval('{{ [1,2,3] }}', false, scope)).toEqual([1, 2, 3]);

    expect(stateStore.maskedEval('{{ {} }}', false, scope)).toEqual({});
    expect(stateStore.maskedEval('{{ {id: 123} }}', false, scope)).toEqual({ id: 123 });
    expect(stateStore.maskedEval('{{nothing}}', false, scope)).toEqual('{{ nothing }}');

    expect(stateStore.maskedEval('{{input1.value}}', false, scope)).toEqual('world');
    expect(stateStore.maskedEval('{{checkbox.value}}', false, scope)).toEqual(true);
    expect(stateStore.maskedEval('{{fetch.data}}', false, scope)).toMatchObject([
      { id: 1 },
      { id: 2 },
    ]);

    expect(stateStore.maskedEval('{{{{}}}}', false, scope)).toEqual(undefined);

    expect(
      stateStore.maskedEval('{{ value }}, {{ input1.value }}!', false, scope)
    ).toEqual('Hello, world!');
  });

  it('can eval $listItem expression', () => {
    expect(stateStore.maskedEval('{{ $listItem.value }}', false, scope)).toEqual(
      '{{ $listItem.value }}'
    );
    expect(stateStore.maskedEval('{{ $listItem.value }}', true, scope)).toEqual('foo');
    expect(
      stateStore.maskedEval(
        '{{ {{$listItem.value}}Input.value + {{$moduleId}}Fetch.value }}!',
        true,
        scope
      )
    ).toEqual('Yes, ok!');
  });
});
