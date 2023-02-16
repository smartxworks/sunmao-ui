import { ImplementedWidget } from '../../types/widget';
import specWidgetSpec from './SpecWidget';
import arrayFieldSpec from './ArrayField';
import booleanFieldSpec from './BooleanField';
import stringFieldSpec from './StringField';
import multiFieldSpec from './MultiSpecField';
import nullFieldSpec from './NullField';
import numberFieldSpec from './NumberField';
import objectFieldSpec from './ObjectField';
import categoryWidgetSpec from './CategoryWidget';
import unsupportedFieldSpec from './UnsupportedField';
import expressionWidgetSpec from './ExpressionWidget';
import moduleWidgetSpec from './ModuleWidget';
import recordWidgetSpec from './RecordField';
import eventWidgetSpec from './EventWidget';
import popoverWidgetSpec from './PopoverWidget';
import breadcrumbWidgetSpec from './BreadcrumbWidget';
import fetchWidgetSpec from './FetchWidget';
import sizeWidgetSpec from './StyleWidgets/SizeWidget';
import fontWidgetSpec from './StyleWidgets/FontWidget';
import colorWidgetSpec from './StyleWidgets/ColorWidget';
import spaceWidgetSpec from './StyleWidgets/SpaceWidget';

export * from './SpecWidget';
export * from './ArrayField';
export * from './BooleanField';
export * from './StringField';
export * from './MultiSpecField';
export * from './NullField';
export * from './NumberField';
export * from './ObjectField';
export * from './CategoryWidget';
export * from './UnsupportedField';
export * from './ExpressionWidget';
export * from './ModuleWidget';
export * from './RecordField';
export * from './EventWidget';
export * from './PopoverWidget';
export * from './BreadcrumbWidget';
export * from './FetchWidget';
export * from './StyleWidgets/SizeWidget';
export * from './StyleWidgets/FontWidget';
export * from './StyleWidgets/ColorWidget';
export * from './StyleWidgets/SpaceWidget';

export const widgets: ImplementedWidget<any>[] = [
  spaceWidgetSpec,
  specWidgetSpec,
  arrayFieldSpec,
  booleanFieldSpec,
  stringFieldSpec,
  multiFieldSpec,
  nullFieldSpec,
  numberFieldSpec,
  objectFieldSpec,
  categoryWidgetSpec,
  unsupportedFieldSpec,
  moduleWidgetSpec,
  expressionWidgetSpec,
  recordWidgetSpec,
  eventWidgetSpec,
  popoverWidgetSpec,
  breadcrumbWidgetSpec,
  fetchWidgetSpec,
  sizeWidgetSpec,
  fontWidgetSpec,
  colorWidgetSpec,
];
