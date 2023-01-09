import { EventHandlerSpec } from './event';
import { Type } from '@sinclair/typebox';
import { CORE_VERSION, CoreWidgetName } from '../constants/core';
import { MODULE_ID_EXP } from '../constants';

export const ModuleRenderSpec = Type.Object(
  {
    id: Type.String({
      title: 'Module ID',
      category: 'Basic',
    }),
    type: Type.String({
      title: 'Module Type',
      category: 'Basic',
    }),
    properties: Type.Record(Type.String(), Type.Any(), {
      title: 'Module Properties',
      category: 'Basic',
      widget: `${CORE_VERSION}/${CoreWidgetName.RecordField}`,
    }),
    handlers: Type.Array(EventHandlerSpec, {
      title: 'Module Handlers',
      category: 'Basic',
    }),
  },
  {
    category: 'Basic',
    widget: 'core/v1/module',
  }
);

export const ModuleEventMethodSpec = Type.Object({
  moduleId: Type.Literal(MODULE_ID_EXP),
});
