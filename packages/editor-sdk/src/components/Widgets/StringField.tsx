import React, { useState, useEffect } from 'react';
import { WidgetProps } from '../../types/widget';
import { implementWidget, mergeWidgetOptionsIntoSpec } from '../../utils/widget';
import { Select } from '@chakra-ui/react';
import { Type, Static } from '@sinclair/typebox';
import { ExpressionWidget, ExpressionWidgetOptionsSpec } from './ExpressionWidget';
import { CORE_VERSION, CoreWidgetName } from '@sunmao-ui/shared';

const StringFieldWidgetOptions = Type.Object({
  expressionOptions: Type.Optional(ExpressionWidgetOptionsSpec),
});

type StringFieldType = `${typeof CORE_VERSION}/${CoreWidgetName.StringField}`;

declare module '../../types/widget' {
  interface WidgetOptionsMap {
    'core/v1/string': Static<typeof StringFieldWidgetOptions>;
  }
}

const EnumField: React.FC<WidgetProps> = props => {
  const { spec, value, onChange } = props;
  const options = (spec.enum || []).map(item => item?.toString() || '');

  return (
    <Select
      value={value}
      onChange={evt => onChange(evt.currentTarget.value)}
      placeholder="Select option"
    >
      {options.map((value, idx) => {
        return <option key={idx}>{value}</option>;
      })}
    </Select>
  );
};

export const StringField: React.FC<WidgetProps<StringFieldType>> = props => {
  const { spec, value } = props;
  const { expressionOptions } = spec.widgetOptions || {};
  const [, setValue] = useState(value);

  useEffect(() => {
    setValue(value);
  }, [value]);

  // enum
  if (Array.isArray(spec.enum)) {
    return <EnumField {...props} />;
  }

  return (
    <ExpressionWidget
      {...props}
      spec={mergeWidgetOptionsIntoSpec<'core/v1/expression'>(spec, {
        compactOptions: expressionOptions?.compactOptions,
      })}
    />
  );
};

export default implementWidget<StringFieldType>({
  version: CORE_VERSION,
  metadata: {
    name: CoreWidgetName.StringField,
  },
  spec: {
    options: StringFieldWidgetOptions,
  },
})(StringField);
