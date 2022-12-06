import React from 'react';
import { JSONSchema7 } from 'json-schema';
import { ComponentSchema } from '@sunmao-ui/core';
import { EditorServicesInterface } from './editor';
import * as TypeBox from '@sinclair/typebox';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WidgetOptionsMap {}

declare module '@sinclair/typebox' {
  interface CustomOptions {
    widget?: undefined;
    widgetOptions?: undefined;
  }

  type AllWidgets = keyof WidgetOptionsMap extends infer type
    ? type extends keyof WidgetOptionsMap
      ? { widget: type; widgetOptions?: WidgetOptionsMap[type] }
      : never
    : never;
  type OmitWidgetFields<T extends CustomOptions> = Omit<T, 'widget' | 'widgetOptions'>;
  type GetSpecOptions<T extends CustomOptions> = AllWidgets & OmitWidgetFields<T>;

  interface TypeBuilder {
    ReadonlyOptional<T extends TypeBox.TSchema>(item: T): TypeBox.TReadonlyOptional<T>;
    Readonly<T extends TypeBox.TSchema>(item: T): TypeBox.TReadonly<T>;
    Optional<T extends TypeBox.TSchema>(item: T): TypeBox.TOptional<T>;
    Tuple<T extends TypeBox.TSchema[]>(
      items: [...T],
      options?: GetSpecOptions<TypeBox.CustomOptions>
    ): TypeBox.TTuple<TypeBox.StaticTuple<T>>;
    Object<T extends TypeBox.TProperties>(
      properties: T,
      options?: GetSpecOptions<TypeBox.ObjectOptions>
    ): TypeBox.TObject<TypeBox.StaticProperties<T>>;
    Intersect<T extends TypeBox.TSchema[]>(
      items: [...T],
      options?: GetSpecOptions<TypeBox.IntersectOptions>
    ): TypeBox.TIntersect<TypeBox.StaticIntersect<T>>;
    Union<T extends TypeBox.TSchema[]>(
      items: [...T],
      options?: GetSpecOptions<TypeBox.CustomOptions>
    ): TypeBox.TUnion<TypeBox.StaticUnion<T>>;
    Array<T extends TypeBox.TSchema>(
      items: T,
      options?: GetSpecOptions<TypeBox.ArrayOptions>
    ): TypeBox.TArray<TypeBox.StaticArray<T>>;
    Enum<T extends TypeBox.TEnumType>(
      item: T,
      options?: GetSpecOptions<TypeBox.CustomOptions>
    ): TypeBox.TEnum<TypeBox.StaticEnum<TypeBox.TEnumKey<T[keyof T]>[]>>;
    Literal<T extends TypeBox.TValue>(
      value: T,
      options?: GetSpecOptions<TypeBox.CustomOptions>
    ): TypeBox.TLiteral<TypeBox.StaticLiteral<T>>;
    String<TCustomFormatOption extends string>(
      options?: GetSpecOptions<
        TypeBox.StringOptions<TypeBox.StringFormatOption | TCustomFormatOption>
      >
    ): TypeBox.TString;
    RegEx(
      regex: RegExp,
      options?: GetSpecOptions<TypeBox.CustomOptions>
    ): TypeBox.TString;
    Number(options?: GetSpecOptions<TypeBox.NumberOptions>): TypeBox.TNumber;
    Integer(options?: GetSpecOptions<TypeBox.NumberOptions>): TypeBox.TInteger;
    Boolean(options?: GetSpecOptions<TypeBox.CustomOptions>): TypeBox.TBoolean;
    Null(options?: GetSpecOptions<TypeBox.CustomOptions>): TypeBox.TNull;
    Unknown(options?: GetSpecOptions<TypeBox.CustomOptions>): TypeBox.TUnknown;
    Any(options?: GetSpecOptions<TypeBox.CustomOptions>): TypeBox.TAny;
    KeyOf<T extends TypeBox.TObject<any>>(
      schema: T,
      options?: GetSpecOptions<TypeBox.CustomOptions>
    ): TypeBox.TKeyOf<keyof T['_infer']>;
    Record<K extends TypeBox.TRecordKey, T extends TypeBox.TSchema>(
      key: K,
      value: T,
      options?: GetSpecOptions<TypeBox.ObjectOptions>
    ): TypeBox.TRecord<TypeBox.StaticRecord<K, T>>;
    Required<T extends TypeBox.TObject<any>>(
      schema: T,
      options?: GetSpecOptions<TypeBox.ObjectOptions>
    ): TypeBox.TObject<Required<T['_infer']>>;
    Partial<T extends TypeBox.TObject<any>>(
      schema: T,
      options?: GetSpecOptions<TypeBox.ObjectOptions>
    ): TypeBox.TObject<Partial<T['_infer']>>;
    Pick<T extends TypeBox.TObject<any>, K extends (keyof T['_infer'])[]>(
      schema: T,
      keys: [...K],
      options?: GetSpecOptions<TypeBox.ObjectOptions>
    ): TypeBox.TObject<Pick<T['_infer'], K[number]>>;
    Omit<T extends TypeBox.TObject<any>, K extends (keyof T['_infer'])[]>(
      schema: T,
      keys: [...K],
      options?: GetSpecOptions<TypeBox.ObjectOptions>
    ): TypeBox.TObject<Omit<T['_infer'], K[number]>>;
    Strict<T extends TypeBox.TSchema>(
      schema: T,
      options?: GetSpecOptions<TypeBox.CustomOptions>
    ): T;
    Constructor<T extends TypeBox.TSchema[], U extends TypeBox.TSchema>(
      args: [...T],
      returns: U,
      options?: GetSpecOptions<TypeBox.CustomOptions>
    ): TypeBox.TConstructor<TypeBox.StaticConstructor<T, U>>;
    Function<T extends TypeBox.TSchema[], U extends TypeBox.TSchema>(
      args: [...T],
      returns: U,
      options?: GetSpecOptions<TypeBox.CustomOptions>
    ): TypeBox.TFunction<TypeBox.StaticFunction<T, U>>;
    Promise<T extends TypeBox.TSchema>(
      item: T,
      options?: GetSpecOptions<CustomOptions>
    ): TypeBox.TPromise<TypeBox.StaticPromise<T>>;
    Undefined(options?: GetSpecOptions<TypeBox.CustomOptions>): TypeBox.TUndefined;
    Void(options?: GetSpecOptions<TypeBox.CustomOptions>): TypeBox.TVoid;
    Rec<T extends TypeBox.TSchema>(
      callback: (self: TypeBox.TAny) => T,
      options?: GetSpecOptions<TypeBox.CustomOptions>
    ): T;
    Namespace<T extends TypeBox.TDefinitions>(
      definitions: T,
      options?: GetSpecOptions<TypeBox.CustomOptions>
    ): TypeBox.TNamespace<T>;
    Ref<
      T extends TypeBox.TNamespace<TypeBox.TDefinitions>,
      K extends keyof T['definitions']
    >(
      box: T,
      key: K
    ): T['definitions'][K];
    Ref<T extends TypeBox.TSchema>(schema: T): T;
  }
}

export type WidgetProps<
  WidgetType extends keyof WidgetOptionsMap = keyof WidgetOptionsMap,
  ValueType = any
> = {
  component: ComponentSchema;
  spec: JSONSchema7 &
    Omit<TypeBox.CustomOptions, 'widget' | 'widgetOptions'> & {
      widget?: keyof WidgetOptionsMap;
      widgetOptions?: WidgetOptionsMap[WidgetType];
    };
  services: EditorServicesInterface;
  path: string[];
  level: number;
  value: ValueType;
  onChange: (v: ValueType, ...args: any[]) => void;
};

export type Widget = {
  kind: 'Widget';
  version: string;
  metadata: {
    name: string;
  };
  spec?: {
    options?: JSONSchema7;
  };
};

export type CreateWidgetOptions = Omit<Widget, 'kind'>;

export type ImplementedWidget<
  T extends keyof WidgetOptionsMap = keyof WidgetOptionsMap,
  ValueType = any
> = CreateWidgetOptions & {
  impl: React.ComponentType<WidgetProps<T, ValueType>>;
};
