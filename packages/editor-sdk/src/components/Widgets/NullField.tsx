import React from 'react';
import { WidgetProps } from '../../types/widget';
import { implementWidget } from '../../utils/widget';
import { CORE_VERSION, NULL_FIELD_WIDGET_NAME } from '@sunmao-ui/shared';

type Props = WidgetProps;

export const NullField: React.FC<Props> = () => {
  return null;
};

export default implementWidget({
  version: CORE_VERSION,
  metadata: {
    name: NULL_FIELD_WIDGET_NAME,
  },
})(NullField);
