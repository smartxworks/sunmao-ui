import React, { useState, useEffect } from 'react';
import { WidgetProps } from '../../types/widget';
import { implementWidget, mergeWidgetOptionsIntoSpec } from '../../utils/widget';
import { Select } from '@chakra-ui/react';
import { Type, Static } from '@sinclair/typebox';
import { ExpressionWidget, ExpressionWidgetOptionsSpec } from './ExpressionWidget';
import { CORE_VERSION, STRING_FIELD_WIDGET_NAME } from '@sunmao-ui/shared';

const StringFieldWidgetOptions = Type.Object({
  expressionOptions: Type.Optional(ExpressionWidgetOptionsSpec),
});

type StringFieldWidgetOptionsType = Static<typeof StringFieldWidgetOptions>;

const EnumField: React.FC<WidgetProps> = props => {
  const { spec, value, onChange } = props;
  const options = (spec.enum || []).map(item => item?.toString() || '');

  return (
    <Select value={value} onChange={evt => onChange(evt.currentTarget.value)}>
      {options.map((value, idx) => {
        return <option key={idx}>{value}</option>;
      })}
    </Select>
  );
};

export const StringField: React.FC<WidgetProps<StringFieldWidgetOptionsType>> = props => {
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
      spec={mergeWidgetOptionsIntoSpec(spec, {
        compactOptions: expressionOptions?.compactOptions,
      })}
    />
  );
};

export default implementWidget<StringFieldWidgetOptionsType>({
  version: CORE_VERSION,
  metadata: {
    name: STRING_FIELD_WIDGET_NAME,
  },
  spec: {
    options: StringFieldWidgetOptions,
  },
})(StringField);
