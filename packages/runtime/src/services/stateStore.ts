import _, { toNumber, mapValues, isArray, isPlainObject, set } from 'lodash-es';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import relativeTime from 'dayjs/plugin/relativeTime';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { reactive } from '@vue/reactivity';
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

  mapValuesDeep(
    obj: any,
    fn: (params: {
      value: any;
      key: string;
      obj: any;
      path: Array<string | number>;
    }) => void,
    path: Array<string | number> = []
  ): any {
    return mapValues(obj, (val, key) => {
      return isArray(val)
        ? val.map((innerVal, idx) => {
            return isPlainObject(innerVal)
              ? this.mapValuesDeep(innerVal, fn, path.concat(key, idx))
              : fn({ value: innerVal, key, obj, path: path.concat(key, idx) });
          })
        : isPlainObject(val)
        ? this.mapValuesDeep(val, fn, path.concat(key))
        : fn({ value: val, key, obj, path: path.concat(key) });
    });
  }

  deepEval(obj: Record<string, unknown>, watcher?: (params: { result: any }) => void) {
    const stops: ReturnType<typeof watch>[] = [];

    const evaluated = this.mapValuesDeep(obj, ({ value: v, path }) => {
      if (typeof v === 'string') {
        const isDynamicExpression = parseExpression(v).some(
          exp => typeof exp !== 'string'
        );
        const result = this.maskedEval(v);
        if (isDynamicExpression && watcher) {
          const stop = watch(
            () => {
              const result = this.maskedEval(v);
              return result;
            },
            newV => {
              set(evaluated, path, newV);
              watcher({ result: evaluated });
            }
          );
          stops.push(stop);
        }

        return result;
      }
      return v;
    });

    return {
      result: evaluated,
      stop: () => stops.forEach(s => s()),
    };
  }
}
// copy and modify from
// https://stackoverflow.com/questions/68161410/javascript-parse-multiple-brackets-recursively-from-a-string
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
    let i = 0;
    const res = [];
    while ((chars = str.slice(i, i + 2))) {
      switch (chars) {
        case '{{':
        case '}}':
          i++;
          if (token) {
            res.push(token);
            token = '';
          }
          res.push(chars);
          break;
        default:
          token += str[i];
      }
      i++;
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
      if (item === '}}') return result;
      result.push(item === '{{' ? build(tokens) : item);
    }
    return result;
  }

  const tokens = lexer(exp);
  const result = build(tokens);

  return result;
};
