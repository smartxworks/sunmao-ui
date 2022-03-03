import React from 'react';
import { JSONSchema7 } from 'json-schema';
import { Component, ComponentSchema } from '@sunmao-ui/core';
import { EditorServices } from './editor';

export type Schema = Component<string, string, string, string>['spec']['properties'];
export type EditorSchema<WidgetOptions = Record<string, any>> = {
  defaultValue?: any;
  // widget
  widget?: string;
  widgetOptions?: WidgetOptions;
  // category
  category?: string;
  weight?: number;
  name?: string;
};

export type WidgetProps<WidgetOptions = Record<string, any>> = {
  component: ComponentSchema;
  schema: Schema & EditorSchema<WidgetOptions>;
  services: EditorServices;
  level: number;
  value: any;
  onChange: (v: any) => void;
};

export type WidgetOptions = {
  version: string;
  metadata: {
    name: string;
  };
  spec?: {
    options?: JSONSchema7;
  };
};

export type Widget<T = Record<string, any>> = WidgetOptions & {
  impl: React.FC<WidgetProps<T>>;
};
