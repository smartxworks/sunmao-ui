import _, { toNumber, mapValues, isArray, isPlainObject, set } from 'lodash-es';
import dayjs from 'dayjs';
import produce from 'immer';
import 'dayjs/locale/zh-cn';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import relativeTime from 'dayjs/plugin/relativeTime';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { isProxy, reactive, toRaw } from '@vue/reactivity';
import { watch } from '../utils/watchReactivity';
import { isNumeric } from '../utils/isNumeric';
import { LIST_ITEM_EXP, LIST_ITEM_INDEX_EXP } from '../constants';

dayjs.extend(relativeTime);
dayjs.extend(isLeapYear);
dayjs.extend(LocalizedFormat);
dayjs.locale('zh-cn');

type ExpChunk = string | ExpChunk[];

// TODO: use web worker
const DefaultDependencies = {
  dayjs,
  _,
};

export class StateManager {
  store = reactive<Record<string, any>>({});

  dependencies: Record<string, unknown>;

  constructor(dependencies: Record<string, unknown> = {}) {
    this.dependencies = { ...DefaultDependencies, ...dependencies };
  }

  clear = () => {
    this.store = reactive<Record<string, any>>({});
  };

  evalExp = (expChunk: ExpChunk, scopeObject = {}): unknown => {
    if (typeof expChunk === 'string') {
      return expChunk;
    }

    const evalText = expChunk.map(ex => this.evalExp(ex, scopeObject)).join('');
    let evaled;
    try {
      // eslint-disable-next-line no-new-func
      evaled = new Function(
        // trim leading space and newline
        `with(this) { return ${evalText.replace(/^\s+/g, '')} }`
      ).call({
        ...this.store,
        ...this.dependencies,
        ...scopeObject,
      });
    } catch (e: any) {
      return `{{ ${evalText} }}`;
    }
    return evaled;
  };

  maskedEval(raw: string, evalListItem = false, scopeObject = {}) {
    if (isNumeric(raw)) {
      return toNumber(raw);
    }
    if (raw === 'true') {
      return true;
    }
    if (raw === 'false') {
      return false;
    }
    const expChunk = parseExpression(raw, evalListItem);

    if (typeof expChunk === 'string') {
      return expChunk;
    }

    const result = expChunk.map(e => this.evalExp(e, scopeObject));
    if (result.length === 1) {
      return result[0];
    }
    return result.join('');
  }

  mapValuesDeep<T extends object>(
    obj: T,
    fn: (params: {
      value: T[keyof T];
      key: string | number;
      obj: T;
      path: Array<string | number>;
    }) => void,
    path: Array<string | number> = []
  ): T {
    return mapValues(obj, (val, key: string | number) => {
      return isArray(val)
        ? val.map((innerVal, idx) => {
            return isPlainObject(innerVal)
              ? this.mapValuesDeep(innerVal, fn, path.concat(key, idx))
              : fn({ value: innerVal, key, obj, path: path.concat(key, idx) });
          })
        : isPlainObject(val)
        ? this.mapValuesDeep(val as unknown as T, fn, path.concat(key))
        : fn({ value: val, key, obj, path: path.concat(key) });
    }) as T;
  }

  deepEval<T extends Record<string, unknown>>(
    obj: T,
    evalListItem = false,
    scopeObject = {}
  ): T {
    // just eval
    const evaluated = this.mapValuesDeep(obj, ({ value }) => {
      if (typeof value !== 'string') {
        return value;
      }
      return this.maskedEval(value, evalListItem, scopeObject);
    });

    return evaluated;
  }

  deepEvalAndWatch<T extends Record<string, unknown>>(
    obj: T,
    watcher: (params: { result: T }) => void,
    evalListItem = false,
    scopeObject = {}
  ) {
    const stops: ReturnType<typeof watch>[] = [];

    // just eval
    const evaluated = this.deepEval(obj, evalListItem, scopeObject);

    // watch change
    let resultCache: T = evaluated;
    this.mapValuesDeep(obj, ({ value, path }) => {
      const isDynamicExpression =
        typeof value === 'string' &&
        parseExpression(value).some(exp => typeof exp !== 'string');

      if (!isDynamicExpression) return;

      const stop = watch(
        () => {
          const result = this.maskedEval(value, evalListItem, scopeObject);
          return result;
        },
        newV => {
          if (isProxy(newV)) {
            newV = toRaw(newV);
          }
          resultCache = produce(resultCache, draft => {
            set(draft, path, newV);
          });
          watcher({ result: resultCache });
        }
      );
      stops.push(stop);
    });

    return {
      result: evaluated,
      stop: () => stops.forEach(s => s()),
    };
  }
}

// copy and modify from
// https://stackoverflow.com/questions/68161410/javascript-parse-multiple-brackets-recursively-from-a-string
const EXPRESSION = {
  START: '{{',
  END: '}}',
};
export const parseExpression = (exp: string, parseListItem = false): ExpChunk[] => {
  // $listItem cannot be evaled in stateStore, so don't mark it as dynamic
  // unless explicitly pass parseListItem as true
  if (
    (exp.includes(LIST_ITEM_EXP) || exp.includes(LIST_ITEM_INDEX_EXP)) &&
    !parseListItem
  ) {
    return [exp];
  }

  function lexer(str: string): string[] {
    let token = '';
    let chars = '';
    let charsNext = '';
    let i = 0;
    const res = [];
    const collectToken = () => {
      if (token) {
        res.push(token);
        token = '';
      }
    };
    while ((chars = str.slice(i, i + EXPRESSION.START.length))) {
      switch (chars) {
        case EXPRESSION.START:
          // move cursor
          i += EXPRESSION.START.length;
          collectToken();
          res.push(chars);
          break;
        case EXPRESSION.END: {
          let j = i + 1;
          // looking ahead
          while ((charsNext = str.slice(j, j + EXPRESSION.END.length))) {
            if (charsNext === EXPRESSION.END) {
              token += str[i];
              // move two cursors
              j++;
              i++;
            } else {
              // move cursor
              i += EXPRESSION.END.length;
              collectToken();
              res.push(chars);
              break;
            }
          }
          break;
        }
        default:
          token += str[i];
          // move cursor
          i++;
      }
    }
    if (token) {
      res.push(token);
    }
    return res;
  }

  function build(tokens: string[]): ExpChunk[] {
    const result: ExpChunk[] = [];
    let item;

    while ((item = tokens.shift())) {
      if (item === EXPRESSION.END) return result;
      result.push(item === EXPRESSION.START ? build(tokens) : item);
    }
    return result;
  }

  const tokens = lexer(exp);
  const result = build(tokens);

  return result;
};
