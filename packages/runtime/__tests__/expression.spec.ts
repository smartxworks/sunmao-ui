import { StateManager, ExpressionError } from '../src/services/StateManager';

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
  const stateManager = new StateManager();
  stateManager.noConsoleError = true;
  it('can eval {{}} expression', () => {
    const evalOptions = { evalListItem: false, scopeObject: scope };

    expect(stateManager.deepEval('value', evalOptions)).toEqual('value');
    expect(stateManager.deepEval('{{true}}', evalOptions)).toEqual(true);
    expect(stateManager.deepEval('{{ false }}', evalOptions)).toEqual(false);
    expect(stateManager.deepEval('{{[]}}', evalOptions)).toEqual([]);
    expect(stateManager.deepEval('{{ [] }}', evalOptions)).toEqual([]);
    expect(stateManager.deepEval('{{ [1,2,3] }}', evalOptions)).toEqual([1, 2, 3]);

    expect(stateManager.deepEval('{{ {} }}', evalOptions)).toEqual({});
    expect(stateManager.deepEval('{{ {id: 123} }}', evalOptions)).toEqual({ id: 123 });
    expect(stateManager.deepEval('{{nothing}}', evalOptions)).toBeInstanceOf(
      ExpressionError
    );

    expect(stateManager.deepEval('{{input1.value}}', evalOptions)).toEqual('world');
    expect(stateManager.deepEval('{{checkbox.value}}', evalOptions)).toEqual(true);
    expect(stateManager.deepEval('{{fetch.data}}', evalOptions)).toMatchObject([
      { id: 1 },
      { id: 2 },
    ]);

    expect(stateManager.deepEval('{{{{}}}}', evalOptions)).toEqual(undefined);

    expect(
      stateManager.deepEval('{{ value }}, {{ input1.value }}!', evalOptions)
    ).toEqual('Hello, world!');
  });

  it('can eval $listItem expression', () => {
    expect(
      stateManager.deepEval('{{ $listItem.value }}', {
        evalListItem: false,
        scopeObject: scope,
      })
    ).toEqual('{{ $listItem.value }}');
    expect(
      stateManager.deepEval('{{ $listItem.value }}', {
        evalListItem: true,
        scopeObject: scope,
      })
    ).toEqual('foo');
    expect(
      stateManager.deepEval(
        '{{ {{$listItem.value}}Input.value + {{$moduleId}}Fetch.value }}!',
        { evalListItem: true, scopeObject: scope }
      )
    ).toEqual('Yes, ok!');
  });

  it('can override scope', () => {
    expect(
      stateManager.deepEval('{{value}}', {
        scopeObject: { override: 'foo' },
        overrideScope: true,
      })
    ).toBeInstanceOf(ExpressionError);
    expect(
      stateManager.deepEval('{{override}}', {
        scopeObject: { override: 'foo' },
        overrideScope: true,
      })
    ).toEqual('foo');
  });

  it('can fallback to specific value when error', () => {
    expect(
      stateManager.deepEval('{{wrongExp}}', {
        fallbackWhenError: exp => exp,
      })
    ).toEqual('{{wrongExp}}');
  });

  it('can partially eval nest expression, even when some error happens', () => {
    expect(
      stateManager.deepEval('{{text}} {{{{ $moduleId }}__state0.value}}', {
        scopeObject: {
          $moduleId: 'myModule',
          text: 'hello',
        },
        ignoreEvalError: true,
      })
    ).toEqual(`hello {{myModule__state0.value}}`);
  });
});
