import { WidgetOptions, Widget, WidgetProps, Schema } from '../types/widget';

export function implementWidget<T = Record<string, any>>(options: WidgetOptions) {
  return (impl: Widget<T>['impl']) => ({
    ...options,
    kind: 'Widget',
    impl,
  });
}

export function mergeWidgetOptionsIntoSchema<T = Record<string, any>>(
  schema: WidgetProps<T>['schema'],
  options: Record<string, any>
): WidgetProps['schema'] {
  return {
    ...schema,
    widgetOptions: {
      ...(schema.widgetOptions || {}),
      ...(options || {}),
    },
  };
}

export function shouldDisplayLabel(schema: Schema, label: string): boolean {
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
