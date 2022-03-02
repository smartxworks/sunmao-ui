import { Widget } from '../../types';
import schemaField from './SchemaField';
import arrayField from './ArrayField';
import booleanField from './BooleanField';
import stringField from './StringField';
import multiField from './MultiSchemaField';
import nullField from './NullField';
import numberField from './NumberField';
import objectField from './ObjectField';
import categoryWidget from './CategoryWidget';
import unsupportedField from './UnsupportedField';
import expressionWidget from './ExpressionWidget';
import moduleWidget from './ModuleWidget';
import keyValueWidget from './KeyValueWidget';
import eventWidget from './EventWidget';

export const widgets: Widget<any>[] = [
  schemaField,
  arrayField,
  booleanField,
  stringField,
  multiField,
  nullField,
  numberField,
  objectField,
  categoryWidget,
  unsupportedField,
  moduleWidget,
  expressionWidget,
  keyValueWidget,
  eventWidget,
];
