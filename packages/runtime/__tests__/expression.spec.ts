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
  it('can eval {{}} expression', () => {
    const evalOptions = { evalListItem: false, scopeObject: scope, noConsoleError: true };

    expect(stateManager.maskedEval('value', evalOptions)).toEqual('value');
    expect(stateManager.maskedEval('{{true}}', evalOptions)).toEqual(true);
    expect(stateManager.maskedEval('{{ false }}', evalOptions)).toEqual(false);
    expect(stateManager.maskedEval('{{[]}}', evalOptions)).toEqual([]);
    expect(stateManager.maskedEval('{{ [] }}', evalOptions)).toEqual([]);
    expect(stateManager.maskedEval('{{ [1,2,3] }}', evalOptions)).toEqual([1, 2, 3]);

    expect(stateManager.maskedEval('{{ {} }}', evalOptions)).toEqual({});
    expect(stateManager.maskedEval('{{ {id: 123} }}', evalOptions)).toEqual({ id: 123 });
    expect(stateManager.maskedEval('{{nothing}}', evalOptions)).toBeInstanceOf(
      ExpressionError
    );

    expect(stateManager.maskedEval('{{input1.value}}', evalOptions)).toEqual('world');
    expect(stateManager.maskedEval('{{checkbox.value}}', evalOptions)).toEqual(true);
    expect(stateManager.maskedEval('{{fetch.data}}', evalOptions)).toMatchObject([
      { id: 1 },
      { id: 2 },
    ]);

    expect(stateManager.maskedEval('{{{{}}}}', evalOptions)).toEqual(undefined);

    expect(
      stateManager.maskedEval('{{ value }}, {{ input1.value }}!', evalOptions)
    ).toEqual('Hello, world!');
  });

  it('can eval $listItem expression', () => {
    expect(
      stateManager.maskedEval('{{ $listItem.value }}', {
        evalListItem: false,
        scopeObject: scope,
      })
    ).toEqual('{{ $listItem.value }}');
    expect(
      stateManager.maskedEval('{{ $listItem.value }}', {
        evalListItem: true,
        scopeObject: scope,
      })
    ).toEqual('foo');
    expect(
      stateManager.maskedEval(
        '{{ {{$listItem.value}}Input.value + {{$moduleId}}Fetch.value }}!',
        { evalListItem: true, scopeObject: scope }
      )
    ).toEqual('Yes, ok!');
  });

  it('can override scope', () => {
    expect(
      stateManager.maskedEval('{{value}}', {
        scopeObject: { override: 'foo' },
        overrideScope: true,
        noConsoleError: true,
      })
    ).toBeInstanceOf(ExpressionError);
    expect(
      stateManager.maskedEval('{{override}}', {
        scopeObject: { override: 'foo' },
        overrideScope: true,
      })
    ).toEqual('foo');
  });

  it('can fallback to specific value when error', () => {
    expect(
      stateManager.maskedEval('{{wrongExp}}', {
        fallbackWhenError: exp => exp,
        noConsoleError: true,
      })
    ).toEqual('{{wrongExp}}');
  });

  it('can partially eval nest expression, even when some error happens', () => {
    expect(
      stateManager.maskedEval('{{text}} {{{{ $moduleId }}__state0.value}}', {
        scopeObject: {
          $moduleId: 'myModule',
          text: 'hello',
        },
        noConsoleError: true,
        ignoreEvalError: true,
      })
    ).toEqual(`hello {{myModule__state0.value}}`);
  });
});
