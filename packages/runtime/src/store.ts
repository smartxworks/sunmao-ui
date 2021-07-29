import { useState } from "react";
import create from "zustand";
import _ from "lodash";
import mitt from "mitt";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const useStore = create<Record<string, any>>(() => ({}));

export const setStore = useStore.setState;

export function parseExpression(raw: string): {
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

// TODO: use web worker
const builtIn = {
  dayjs,
};
export function evalInContext(raw: string, ctx: Record<string, any>) {
  try {
    const { dynamic, expression } = parseExpression(raw);
    if (!dynamic) {
      try {
        // covert primitive types
        return eval(expression);
      } catch (error) {
        return expression;
      }
    }
    Object.keys(builtIn).forEach((key) => {
      // @ts-ignore
      self[key] = builtIn[key];
    });
    Object.keys(ctx).forEach((key) => {
      // @ts-ignore
      self[key] = ctx[key];
    });
    return eval(expression);
  } catch (error) {
    // console.error(error);
    return undefined;
  } finally {
    Object.keys(builtIn).forEach((key) => {
      // @ts-ignore
      delete self[key];
    });
    Object.keys(ctx).forEach((key) => {
      // @ts-ignore
      delete self[key];
    });
  }
}
export function useExpression(raw: string) {
  const [state, setState] = useState<any>(
    evalInContext(raw, useStore.getState())
  );

  useStore.subscribe(
    (value) => {
      setState(value);
    },
    (state) => {
      return evalInContext(raw, state);
    }
  );

  return state;
}

export const emitter = mitt<Record<string, any>>();

// EXPERIMENT: utils
emitter.on("$utils", ({ name, parameters }) => {
  if (name === "alert") {
    window.alert(parameters);
  }
});
