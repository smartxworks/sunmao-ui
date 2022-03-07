import React, { useState, useEffect } from 'react';
import { WidgetProps } from '../../types/widget';
import { implementWidget, mergeWidgetOptionsIntoSchema } from '../../utils/widget';
import { Select } from '@chakra-ui/react';
import { Type, Static } from '@sinclair/typebox';
import { ExpressionWidget, ExpressionWidgetOptionsSchema } from './ExpressionWidget';

const StringFieldWidgetOptions = Type.Object({
  expressionOptions: Type.Optional(ExpressionWidgetOptionsSchema),
});

type StringFieldWidgetOptionsType = Static<typeof StringFieldWidgetOptions>;

const EnumField: React.FC<WidgetProps> = props => {
  const { schema, value, onChange } = props;
  const options = (schema.enum || []).map(item => item?.toString() || '');

  return (
    <Select value={value} onChange={evt => onChange(evt.currentTarget.value)}>
      {options.map((value, idx) => {
        return <option key={idx}>{value}</option>;
      })}
    </Select>
  );
};

export const StringField: React.FC<WidgetProps<StringFieldWidgetOptionsType>> = props => {
  const { schema, value } = props;
  const { expressionOptions } = schema.widgetOptions || {};
  const [, setValue] = useState(value);

  useEffect(() => {
    setValue(value);
  }, [value]);

  // enum
  if (Array.isArray(schema.enum)) {
    return <EnumField {...props} />;
  }

  return (
    <ExpressionWidget
      {...props}
      schema={mergeWidgetOptionsIntoSchema(schema, {
        compactOptions: expressionOptions?.compactOptions,
      })}
    />
  );
};

export default implementWidget<StringFieldWidgetOptionsType>({
  version: 'core/v1',
  metadata: {
    name: 'StringField',
  },
  spec: {
    options: StringFieldWidgetOptions,
  },
})(StringField);
