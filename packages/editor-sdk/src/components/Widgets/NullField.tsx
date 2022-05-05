import React from 'react';
import { WidgetProps } from '../../types/widget';
import { implementWidget } from '../../utils/widget';
import { CORE_VERSION, CoreWidgetName } from '@sunmao-ui/shared';

type Props = WidgetProps;

export const NullField: React.FC<Props> = () => {
  return null;
};

export default implementWidget({
  version: CORE_VERSION,
  metadata: {
    name: CoreWidgetName.NullField,
  },
})(NullField);
