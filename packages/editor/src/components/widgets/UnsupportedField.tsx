import React from 'react';
import { WidgetProps } from '../../types';
import { implementWidget } from '../../utils/widget';

export const UnsupportedField: React.FC<WidgetProps> = props => {
  const { schema, value } = props;

  return (
    <div>
      Unsupported field schema
      <p>
        <b>schema:</b>
      </p>
      <pre>{JSON.stringify(schema, null, 2)}</pre>
      <p>
        <b>value:</b>
      </p>
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
};

export default implementWidget({
  version: 'core/v1',
  metadata: {
    name: 'UnsupportedField',
  },
})(UnsupportedField);
