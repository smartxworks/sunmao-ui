import React from 'react';
import { JSONSchema7 } from 'json-schema';
import { ComponentSchema } from '@sunmao-ui/core';
import { EditorServices } from './editor';
import { Condition } from './condition';

export type EditorSchema<WidgetOptions = Record<string, any>> = {
  defaultValue?: any;
  // widget
  widget?: string;
  widgetOptions?: WidgetOptions;
  // category
  category?: string;
  weight?: number;
  name?: string;
  // conditional render
  conditions?: Condition[];
};

export type WidgetProps<WidgetOptions = Record<string, any>> = {
  component: ComponentSchema;
  schema: JSONSchema7 & EditorSchema<WidgetOptions>;
  services: EditorServices;
  path: string[];
  level: number;
  value: any;
  onChange: (v: any) => void;
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
}

export type CreateWidgetOptions = Omit<Widget, 'kind'>;

export type ImplementedWidget<T = Record<string, any>> = CreateWidgetOptions & {
  impl: React.ComponentType<WidgetProps<T>>;
};
