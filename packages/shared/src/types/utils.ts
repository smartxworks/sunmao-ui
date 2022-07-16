export type DeepPartial<T> = T extends Record<string, any>
  ? Partial<{
      [K in keyof T]: DeepPartial<T[K]>;
    }>
  : T;
