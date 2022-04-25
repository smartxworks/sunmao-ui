import React from 'react';
import { Type, Static } from '@sinclair/typebox';
import { WidgetProps } from '../../types/widget';
import { implementWidget } from '../../utils/widget';
import { RecordEditor } from '../Form';
import { CORE_VERSION, RECORD_FIELD_WIDGET_NAME } from '@sunmao-ui/shared';

const KeyValueWidgetOptions = Type.Object({
  minNum: Type.Optional(Type.Number()),
  isShowHeader: Type.Optional(Type.Boolean()),
  onlySetValue: Type.Optional(Type.Boolean()),
});

type RecordFieldOptionsType = Static<typeof KeyValueWidgetOptions>;

export const RecordWidget: React.FC<WidgetProps<RecordFieldOptionsType>> = props => {
  return <RecordEditor {...props} />;
};

export default implementWidget<RecordFieldOptionsType>({
  version: CORE_VERSION,
  metadata: {
    name: RECORD_FIELD_WIDGET_NAME,
  },
  spec: {
    options: KeyValueWidgetOptions,
  },
})(RecordWidget);
