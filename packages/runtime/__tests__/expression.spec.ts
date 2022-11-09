import { isProxy, reactive } from '@vue/reactivity';
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
  stateManager.store = reactive<Record<string, any>>(scope);
  stateManager.mute = true;
  it('can eval {{}} expression', () => {
    const evalOptions = {};

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

  it('will not return Proxy', () => {
    const fetchData = stateManager.deepEval('{{fetch.data}}');
    expect(isProxy(fetchData)).toBe(false);
  });

  it('can eval $listItem expression', () => {
    expect(stateManager.deepEval('{{ $listItem.value }}')).toEqual('foo');
    expect(
      stateManager.deepEval(
        '{{ {{$listItem.value}}Input.value + {{$moduleId}}Fetch.value }}!'
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

  it('can watch the state change in the object value', () => {
    const stateManager = new StateManager();

    stateManager.mute = true;
    stateManager.store.text = { value: 'hello' };

    return new Promise<void>(resolve => {
      const { result } = stateManager.deepEvalAndWatch(
        { text: '{{ text.value }}' },
        newValue => {
          expect(newValue.result.text).toBe('bye');
          resolve();
        }
      );

      expect(result.text).toBe('hello');

      stateManager.store.text.value = 'bye';
    });
  });

  it('can watch the state change in the expression string', () => {
    const stateManager = new StateManager();

    stateManager.mute = true;
    stateManager.store.text = { value: 'hello' };

    return new Promise<void>(resolve => {
      const { result, stop } = stateManager.deepEvalAndWatch(
        '{{ text.value }}',
        newValue => {
          expect(newValue.result).toBe('bye');
          resolve();
        }
      );

      expect(result).toBe('hello');

      stateManager.store.text.value = 'bye';
    });
  });

  it('can deep deep eval the nest array', () => {
    const stateManager = new StateManager();

    stateManager.mute = true;
    stateManager.store.text = { value: 'hello' };

    const result = stateManager.deepEval({
      data: [
        [
          {
            value: '{{text.value}}',
          },
        ],
      ],
    });

    expect(result.data[0][0].value).toBe('hello');
  });
});
