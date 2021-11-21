import { Component } from '@sunmao-ui/core';

type Schema = Component['spec']['properties'];

export type FieldProps = {
  schema: Schema;
  formData: any;
  onChange: (v: any) => void;
};

export function getDisplayLabel(schema: Schema, label: string): boolean {
  if (!label) {
    return false;
  }
  if (schema.type === 'object') {
    return false;
  }
  return true;
}
