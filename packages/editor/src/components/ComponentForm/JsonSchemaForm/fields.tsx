import { Component } from '@sunmao-ui/core';
import { Registry, StateManager } from '@sunmao-ui/runtime';

type Schema = Component<string, string, string, string>['spec']['properties'];
type EditorSchema = {
  widget?: string;
};

export type FieldProps = {
  schema: Schema & EditorSchema;
  registry: Registry;
  stateManager: StateManager;
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

export function getCodeMode(schema: Schema): boolean {
  switch (schema.type) {
    case 'array':
    case 'object':
    case 'boolean':
    case 'number':
      return true;
    default:
  }
  // multi schema
  if ('anyOf' in schema || 'oneOf' in schema) {
    return true;
  }
  // enum
  if (schema.type === 'string' && Array.isArray(schema.enum)) {
    return true;
  }
  return false;
}
