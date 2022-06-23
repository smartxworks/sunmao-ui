import React from 'react';
import { JSONSchema7 } from 'json-schema';
import { ComponentSchema } from '@sunmao-ui/core';
import { EditorServices } from './editor';
import { SpecOptions } from '@sunmao-ui/shared';

export type WidgetProps<WidgetOptions = Record<string, any>, ValueType = any> = {
  component: ComponentSchema;
  spec: JSONSchema7 & SpecOptions<WidgetOptions>;
  services: EditorServices;
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
  T = Record<string, any>,
  ValueType = any
> = CreateWidgetOptions & {
  impl: React.ComponentType<WidgetProps<T, ValueType>>;
};
