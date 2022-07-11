import React from 'react';
import { Type, Static } from '@sinclair/typebox';
import { WidgetProps } from '../../types/widget';
import { implementWidget } from '../../utils/widget';
import { RecordEditor } from '../Form';
import { CORE_VERSION, CoreWidgetName } from '@sunmao-ui/shared';

const KeyValueWidgetOptions = Type.Object({
  minNum: Type.Optional(Type.Number()),
  isShowHeader: Type.Optional(Type.Boolean()),
  onlySetValue: Type.Optional(Type.Boolean()),
});

type RecordFieldType = `${typeof CORE_VERSION}/${CoreWidgetName.RecordField}`;

declare module '../../types/widget' {
  interface WidgetOptionsMap {
    'core/v1/record': Static<typeof KeyValueWidgetOptions>;
  }
}

export const RecordWidget: React.FC<WidgetProps<RecordFieldType>> = props => {
  return <RecordEditor {...props} />;
};

export default implementWidget<RecordFieldType>({
  version: CORE_VERSION,
  metadata: {
    name: CoreWidgetName.RecordField,
  },
  spec: {
    options: KeyValueWidgetOptions,
  },
})(RecordWidget);
