import { Static, TObject, TProperties } from '@sinclair/typebox';

export const pickProperty = <T extends TProperties, U extends TProperties>(
  schema: TObject<T>,
  object: U
): Partial<Static<TObject<T>>> => {
  const result: Partial<TProperties> = {};
  for (const key in schema.properties) {
    result[key] = object[key];
  }
  return result as Partial<Static<TObject<T>>>;
};
