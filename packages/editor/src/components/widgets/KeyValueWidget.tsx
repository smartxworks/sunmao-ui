import React from 'react';
import { Type, Static } from '@sinclair/typebox';
import { WidgetProps } from '../../types';
import { implementWidget } from '../../utils/widget';
import { KeyValueEditor } from '../KeyValueEditor';

const KeyValueWidgetOptions = Type.Object({
  minNum: Type.Optional(Type.Number()),
  isShowHeader: Type.Optional(Type.Boolean()),
  onlySetValue: Type.Optional(Type.Boolean()),
});

type KeyValueWidgetOptionsType = Static<typeof KeyValueWidgetOptions>;

export const KeyValueWidget: React.FC<WidgetProps<KeyValueWidgetOptionsType>> = props => {
  return <KeyValueEditor {...props} />;
};

export default implementWidget<KeyValueWidgetOptionsType>({
  version: 'core/v1',
  metadata: {
    name: 'KeyValue',
  },
  spec: {
    options: KeyValueWidgetOptions,
  },
})(KeyValueWidget);
