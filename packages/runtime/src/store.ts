import { useMemo, useState } from "react";
import create from "zustand";
import _ from "lodash";
import mitt from "mitt";

export const useStore = create<Record<string, any>>(() => ({}));

export const setStore = useStore.setState;

// TODO: use web worker
function evalInContext(expression: string, ctx: Record<string, any>) {
  try {
    Object.keys(ctx).forEach((key) => {
      // @ts-ignore
      self[key] = ctx[key];
    });
    return eval(expression);
  } catch (error) {
    // console.error(error);
    return undefined;
  } finally {
    Object.keys(ctx).forEach((key) => {
      // @ts-ignore
      delete self[key];
    });
  }
}
export function useExpression(raw: string) {
  const { dynamic, expression } = useMemo(() => {
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
  }, [raw]);

  const [state, setState] = useState<any>(expression);

  if (!dynamic) {
    return state;
  }

  useStore.subscribe(
    (value) => {
      setState(value);
    },
    (state) => {
      return evalInContext(expression, state);
    }
  );

  return state;
}

export const emitter = mitt<Record<string, any>>();
