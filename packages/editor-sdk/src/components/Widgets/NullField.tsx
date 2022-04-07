import React from 'react';
import { WidgetProps } from '../../types/widget';
import { implementWidget } from '../../utils/widget';

type Props = WidgetProps;

export const NullField: React.FC<Props> = () => {
  return null;
};

export default implementWidget({
  version: 'core/v1',
  metadata: {
    name: 'null',
  },
})(NullField);
