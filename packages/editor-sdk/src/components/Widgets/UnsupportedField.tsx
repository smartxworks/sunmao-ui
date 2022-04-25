import React from 'react';
import { WidgetProps } from '../../types/widget';
import { implementWidget } from '../../utils/widget';
import { CORE_VERSION, UNSUPPORTED_FIELD_WIDGET_NAME } from '@sunmao-ui/shared';

export const UnsupportedField: React.FC<WidgetProps> = props => {
  const { spec, value } = props;

  return (
    <div>
      Unsupported field spec
      <p>
        <b>spec:</b>
      </p>
      <pre>{JSON.stringify(spec, null, 2)}</pre>
      <p>
        <b>value:</b>
      </p>
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
};

export default implementWidget({
  version: CORE_VERSION,
  metadata: {
    name: UNSUPPORTED_FIELD_WIDGET_NAME,
  },
})(UnsupportedField);
