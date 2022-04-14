import {
  StateManager,
  parseExpression,
  ExpressionError,
} from '../src/services/StateManager';

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
    const evalOptions = { evalListItem: false, scopeObject: scope };

    expect(stateStore.maskedEval('value', evalOptions)).toEqual('value');
    expect(stateStore.maskedEval('{{true}}', evalOptions)).toEqual(true);
    expect(stateStore.maskedEval('{{ false }}', evalOptions)).toEqual(false);
    expect(stateStore.maskedEval('{{[]}}', evalOptions)).toEqual([]);
    expect(stateStore.maskedEval('{{ [] }}', evalOptions)).toEqual([]);
    expect(stateStore.maskedEval('{{ [1,2,3] }}', evalOptions)).toEqual([1, 2, 3]);

    expect(stateStore.maskedEval('{{ {} }}', evalOptions)).toEqual({});
    expect(stateStore.maskedEval('{{ {id: 123} }}', evalOptions)).toEqual({ id: 123 });
    expect(
      stateStore.maskedEval('{{nothing}}', evalOptions) instanceof ExpressionError
    ).toEqual(true);

    expect(stateStore.maskedEval('{{input1.value}}', evalOptions)).toEqual('world');
    expect(stateStore.maskedEval('{{checkbox.value}}', evalOptions)).toEqual(true);
    expect(stateStore.maskedEval('{{fetch.data}}', evalOptions)).toMatchObject([
      { id: 1 },
      { id: 2 },
    ]);

    expect(stateStore.maskedEval('{{{{}}}}', evalOptions)).toEqual(undefined);

    expect(
      stateStore.maskedEval('{{ value }}, {{ input1.value }}!', evalOptions)
    ).toEqual('Hello, world!');
  });

  it('can eval $listItem expression', () => {
    expect(
      stateStore.maskedEval('{{ $listItem.value }}', {
        evalListItem: false,
        scopeObject: scope,
      })
    ).toEqual('{{ $listItem.value }}');
    expect(
      stateStore.maskedEval('{{ $listItem.value }}', {
        evalListItem: true,
        scopeObject: scope,
      })
    ).toEqual('foo');
    expect(
      stateStore.maskedEval(
        '{{ {{$listItem.value}}Input.value + {{$moduleId}}Fetch.value }}!',
        { evalListItem: true, scopeObject: scope }
      )
    ).toEqual('Yes, ok!');
  });
});
