// add the string type to every properties because it may be a expression
export type PropsBeforeEvaled<T> = T extends Record<string, any> | any[]
  ? { [K in keyof T]: PropsBeforeEvaled<T[K]> | string }
  : T;
// remove the string type for every properties
export type PropsAfterEvaled<T> = T extends Record<string, any> | any[]
  ? {
      [K in keyof T]: T[K] extends string | infer O
        ? PropsAfterEvaled<O>
        : PropsAfterEvaled<T[K]>;
    }
  : T;
