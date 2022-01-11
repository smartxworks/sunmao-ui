import { Component } from '@sunmao-ui/core';
import { Registry } from '@sunmao-ui/runtime';

type Schema = Component<string, string, string, string>['spec']['properties'];
type EditorSchema = {
  widget?: string;
};

export type FieldProps = {
  schema: Schema & EditorSchema;
  registry: Registry;
  formData: any;
  onChange: (v: any) => void;
};

export function getDisplayLabel(schema: Schema, label: string): boolean {
  if (!label) {
    return false;
  }
  if (schema.type === 'object' && !schema.title) {
    return false;
  }
  return true;
}
