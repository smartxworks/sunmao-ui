import { Condition } from './condition';

export type SpecOptions<WidgetOptions = Record<string, any>> = {
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
