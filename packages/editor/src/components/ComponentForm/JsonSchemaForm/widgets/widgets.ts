import { FieldProps } from '../fields';
import JsonEditor from './JsonEditor';
import ModuleWidget from './ModuleWidget';
import GeneralWidget from './GeneralWidget';

export const widgets: Record<string, React.FC<FieldProps>> = {
  'json-editor': JsonEditor,
  module: ModuleWidget,
  general: GeneralWidget,
};
