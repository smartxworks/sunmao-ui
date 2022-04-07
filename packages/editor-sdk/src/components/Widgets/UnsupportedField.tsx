import React from 'react';
import { WidgetProps } from '../../types/widget';
import { implementWidget } from '../../utils/widget';

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
  version: 'core/v1',
  metadata: {
    name: 'unsupported',
  },
})(UnsupportedField);
