import React, { useState } from 'react';
import { Type, Static } from '@sinclair/typebox';
import { Box, RadioGroup, Radio, Stack } from '@chakra-ui/react';
import { SpecWidget } from './SpecWidget';
import { WidgetProps } from '../../types/widget';
import { ExpressionWidgetOptionsSpec } from './ExpressionWidget';
import { implementWidget, mergeWidgetOptionsIntoSpec } from '../../utils/widget';
import { CORE_VERSION, CoreWidgetName } from '@sunmao-ui/shared';

const MultiSpecFieldWidgetOptions = Type.Object({
  expressionOptions: Type.Optional(ExpressionWidgetOptionsSpec),
});

type MultiSpecFieldWidgetType = `${typeof CORE_VERSION}/${CoreWidgetName.MultiField}`;

declare module '../../types/widget' {
  interface WidgetOptionsMap {
    'core/v1/multi': Static<typeof MultiSpecFieldWidgetOptions>;
  }
}

const _Field: React.FC<
  Omit<WidgetProps<MultiSpecFieldWidgetType>, 'spec'> & {
    specs: NonNullable<WidgetProps['spec']['anyOf']>;
  }
> = props => {
  const { component, specs, value, level, path, services, onChange } = props;
  const [specIdx, setSpecIdx] = useState(0);
  const subSpec: WidgetProps['spec'] | boolean = specs[specIdx];

  if (typeof subSpec === 'boolean') {
    return null;
  }

  const expressionOptions =
    subSpec.widgetOptions && 'expressionOptions' in subSpec.widgetOptions
      ? subSpec.widgetOptions.expressionOptions
      : {};

  return (
    <Box>
      <RadioGroup mb={1} value={specIdx} onChange={v => setSpecIdx(parseInt(v))}>
        <Stack direction="row">
          {specs.map((s, idx) => {
            if (typeof s === 'boolean') {
              return null;
            }
            return (
              <Radio key={idx} value={idx} borderColor="gray.200">
                {s.type}
              </Radio>
            );
          })}
        </Stack>
      </RadioGroup>
      <SpecWidget
        component={component}
        spec={mergeWidgetOptionsIntoSpec<'core/v1/spec'>(subSpec, { expressionOptions })}
        path={path}
        level={level}
        value={value}
        onChange={newValue => onChange(newValue)}
        services={services}
      />
    </Box>
  );
};

export const MultiSpecField: React.FC<WidgetProps<MultiSpecFieldWidgetType>> = props => {
  const { component, spec, value, services, path, level, onChange } = props;

  if (spec.anyOf) {
    return (
      <_Field
        component={component}
        value={value}
        path={path}
        level={level}
        specs={spec.anyOf}
        services={services}
        onChange={onChange}
      />
    );
  }

  if (spec.oneOf) {
    return (
      <_Field
        component={component}
        value={value}
        path={path}
        level={level}
        specs={spec.oneOf}
        services={services}
        onChange={onChange}
      />
    );
  }

  return null;
};

export default implementWidget<MultiSpecFieldWidgetType>({
  version: CORE_VERSION,
  metadata: {
    name: CoreWidgetName.MultiField,
  },
  spec: {
    options: MultiSpecFieldWidgetOptions,
  },
})(MultiSpecField);
