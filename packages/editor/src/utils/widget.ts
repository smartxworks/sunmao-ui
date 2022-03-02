import { WidgetOptions, Widget, WidgetProps } from '../types';

export function implementWidget<T = Record<string, any>>(options: WidgetOptions) {
  return (impl: Widget<T>['impl']) => ({
    ...options,
    kind: 'Widget',
    impl,
  });
}

export function mergeWidgetOptionsIntoSchema<T = Record<string, any>> (schema: WidgetProps<T>['schema'], options: Record<string, any>): WidgetProps['schema'] {
  return {
    ...schema,
    widgetOptions: {
      ...(schema.widgetOptions || {}),
      ...(options || {}),
    }
  };
}
