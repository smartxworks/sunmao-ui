import React from 'react';
import { WidgetProps } from '../../types/widget';
import { implementWidget } from '../../utils/widget';
import { CORE_VERSION, CoreWidgetName } from '@sunmao-ui/shared';

type UnsupportedFieldType = `${typeof CORE_VERSION}/${CoreWidgetName.UnsupportedField}`;

declare module '../../types/widget' {
  interface WidgetOptionsMap {
    'core/v1/unsupported': {};
  }
}

export const UnsupportedField: React.FC<WidgetProps<UnsupportedFieldType>> = props => {
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

export default implementWidget<UnsupportedFieldType>({
  version: CORE_VERSION,
  metadata: {
    name: CoreWidgetName.UnsupportedField,
  },
})(UnsupportedField);
