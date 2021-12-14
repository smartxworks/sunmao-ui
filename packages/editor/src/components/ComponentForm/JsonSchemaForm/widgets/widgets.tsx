import { FieldProps } from '../fields';
import ModuleWidget from './ModuleWidget';

export const widgets: Record<string, React.FC<FieldProps>> = {
  module: ModuleWidget,
};
