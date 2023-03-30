import { JSONSchema7 } from 'json-schema';
import {
  CreateWidgetOptions,
  ImplementedWidget,
  WidgetProps,
  WidgetOptionsMap,
} from '../types/widget';

export function implementWidget<T extends keyof WidgetOptionsMap>(
  options: CreateWidgetOptions
) {
  return (impl: ImplementedWidget<T>['impl']) => ({
    ...options,
    kind: 'Widget',
    impl,
  });
}

export function mergeWidgetOptionsIntoSpec<T extends keyof WidgetOptionsMap>(
  spec: WidgetProps<any>['spec'],
  options: WidgetOptionsMap[T]
): WidgetProps<T>['spec'] {
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

export function getCodeMode(spec: WidgetProps['spec']): boolean {
  if (spec.widget) {
    return true;
  }

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
