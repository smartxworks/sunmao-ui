import _ from 'lodash';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { reactive } from '@vue/reactivity';
import { watch } from '../utils/watchReactivity';
import { LIST_ITEM_EXP, LIST_ITEM_INDEX_EXP } from '../constants';

dayjs.extend(relativeTime);

type ExpChunk = {
  expression: string;
  isDynamic: boolean;
};

// TODO: use web worker
const builtIn = {
  dayjs,
};

function isNumeric(x: string | number) {
  return !isNaN(Number(x)) && x !== '';
}

export function initStateManager() {
  return new StateManager();
}
export class StateManager {
  store = reactive<Record<string, any>>({});

  parseExpression(str: string, parseListItem = false): ExpChunk[] {
    let l = 0;
    let r = 0;
    let isInBrackets = false;
    const res = [];

    while (r < str.length - 1) {
      if (!isInBrackets && str.substr(r, 2) === '{{') {
        if (l !== r) {
          const substr = str.substring(l, r);
          res.push({
            expression: substr,
            isDynamic: false,
          });
        }
        isInBrackets = true;
        r += 2;
        l = r;
      } else if (isInBrackets && str.substr(r, 2) === '}}') {
        // remove \n from start and end of substr
        const substr = str.substring(l, r).replace(/^\s+|\s+$/g, '');
        const chunk = {
          expression: substr,
          isDynamic: true,
        };
        // $listItem cannot be evaled in stateStore, so don't mark it as dynamic
        // unless explicitly pass parseListItem as true
        if (
          (substr.includes(LIST_ITEM_EXP) || substr.includes(LIST_ITEM_INDEX_EXP)) &&
          !parseListItem
        ) {
          chunk.expression = `{{${substr}}}`;
          chunk.isDynamic = false;
        }
        res.push(chunk);

        isInBrackets = false;
        r += 2;
        l = r;
      } else {
        r++;
      }
    }

    if (r >= l && l < str.length) {
      res.push({
        expression: str.substring(l, r + 1),
        isDynamic: false,
      });
    }
    return res;
  }

  maskedEval(raw: string, evalListItem = false, scopeObject = {}) {
    if (isNumeric(raw)) {
      return _.toNumber(raw);
    }
    if (raw === 'true') {
      return true;
    }
    if (raw === 'false') {
      return false;
    }

    const expChunks = this.parseExpression(raw, evalListItem);
    const evaled = expChunks.map(({ expression: exp, isDynamic }) => {
      if (!isDynamic) {
        return exp;
      }
      try {
        const result = new Function(`with(this) { return ${exp} }`).call({
          ...this.store,
          ...builtIn,
          ...scopeObject,
        });
        return result;
      } catch (e: any) {
        console.error(Error(`Cannot eval value '${exp}' in '${raw}': ${e.message}`));
        return undefined;
      }
    });

    return evaled.length === 1 ? evaled[0] : evaled.join('');
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
    return _.mapValues(obj, (val, key) => {
      return _.isArray(val)
        ? val.map((innerVal, idx) => {
            return _.isPlainObject(innerVal)
              ? this.mapValuesDeep(innerVal, fn, path.concat(key, idx))
              : fn({ value: innerVal, key, obj, path: path.concat(key, idx) });
          })
        : _.isPlainObject(val)
        ? this.mapValuesDeep(val, fn, path.concat(key))
        : fn({ value: val, key, obj, path: path.concat(key) });
    });
  }

  deepEval(obj: Record<string, unknown>, watcher?: (params: { result: any }) => void) {
    const stops: ReturnType<typeof watch>[] = [];

    const evaluated = this.mapValuesDeep(obj, ({ value: v, path }) => {
      if (typeof v === 'string') {
        const isDynamicExpression = this.parseExpression(v).some(
          ({ isDynamic }) => isDynamic
        );
        const result = this.maskedEval(v);
        if (isDynamicExpression && watcher) {
          const stop = watch(
            () => {
              return this.maskedEval(v);
            },
            newV => {
              _.set(evaluated, path, newV);
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
