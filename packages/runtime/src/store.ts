import _ from "lodash";
import mitt from "mitt";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { reactive } from "@vue/reactivity";
import { watch } from "@vue-reactivity/watch";

dayjs.extend(relativeTime);

function parseExpression(raw: string): {
  dynamic: boolean;
  expression: string;
} {
  if (!raw) {
    return {
      dynamic: false,
      expression: raw,
    };
  }
  const matchArr = raw.match(/{{(.+)}}/);
  if (!matchArr) {
    return {
      dynamic: false,
      expression: raw,
    };
  }
  return {
    dynamic: true,
    expression: matchArr[1],
  };
}

export const emitter = mitt<Record<string, any>>();

// EXPERIMENT: utils
emitter.on("$utils", ({ name, parameters }) => {
  if (name === "alert") {
    window.alert(parameters);
  }
});

function isNumeric(x: string | number) {
  return !isNaN(Number(x));
}

export const stateStore = reactive<Record<string, any>>({});

// TODO: use web worker
const builtIn = {
  dayjs,
};
function maskedEval(raw: string) {
  if (isNumeric(raw)) {
    return _.toNumber(raw);
  }
  if (raw === "true") {
    return true;
  }
  if (raw === "false") {
    return false;
  }

  const { dynamic, expression } = parseExpression(raw);

  if (!dynamic) {
    return raw;
  }

  return new Function(`with(this) { return ${expression} }`).call({
    ...stateStore,
    ...builtIn,
  });
}

const mapValuesDeep = (
  obj: any,
  fn: (params: {
    value: any;
    key: string;
    obj: any;
    path: Array<string | number>;
  }) => void,
  path: Array<string | number> = []
): any => {
  return _.mapValues(obj, (val, key) => {
    return _.isArray(val)
      ? val.map((innerVal, idx) => {
          return _.isPlainObject(innerVal)
            ? mapValuesDeep(innerVal, fn, path.concat(key, idx))
            : fn({ value: innerVal, key, obj, path: path.concat(key, idx) });
        })
      : _.isPlainObject(val)
      ? mapValuesDeep(val, fn, path.concat(key))
      : fn({ value: val, key, obj, path: path.concat(key) });
  });
};

export function deepEval(
  obj: object,
  watcher?: (params: { result: ReturnType<typeof mapValuesDeep> }) => void
) {
  const stops: ReturnType<typeof watch>[] = [];

  const evaluated = mapValuesDeep(obj, ({ value: v, path }) => {
    if (typeof v === "string") {
      const { dynamic } = parseExpression(v);
      const result = maskedEval(v);

      if (dynamic && watcher) {
        const stop = watch(
          () => {
            return maskedEval(v);
          },
          (newV) => {
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
    stop: () => stops.forEach((s) => s()),
  };
}
