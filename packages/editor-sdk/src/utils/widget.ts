import { JSONSchema7 } from 'json-schema';
import { CreateWidgetOptions, ImplementedWidget, WidgetProps } from '../types/widget';

export function implementWidget<T = Record<string, any>>(options: CreateWidgetOptions) {
  return (impl: ImplementedWidget<T>['impl']) => ({
    ...options,
    kind: 'Widget',
    impl,
  });
}

export function mergeWidgetOptionsIntoSpec<T = Record<string, any>>(
  spec: WidgetProps<T>['spec'],
  options: Record<string, any>
): WidgetProps['spec'] {
  return {
    ...spec,
    widgetOptions: {
      ...(spec.widgetOptions || {}),
      ...(options || {}),
    },
  };
}

export function shouldDisplayLabel(spec: JSONSchema7, label: string): boolean {
  if (!label) {
    return false;
  }
  if (spec.type === 'object' && !spec.title) {
    return false;
  }
  return true;
}

export function getCodeMode(spec: JSONSchema7): boolean {
  switch (spec.type) {
    case 'array':
    case 'object':
    case 'boolean':
    case 'number':
      return true;
    default:
  }
  // multi spec
  if ('anyOf' in spec || 'oneOf' in spec) {
    return true;
  }
  // enum
  if (spec.type === 'string' && Array.isArray(spec.enum)) {
    return true;
  }
  return false;
}
