import React from 'react';
import { HStack, Text, Box } from '@chakra-ui/react';
import { CORE_VERSION, StyleWidgetName } from '@sunmao-ui/shared';
import { WidgetProps } from '../../../types/widget';
import { implementWidget, mergeWidgetOptionsIntoSpec } from '../../../utils/widget';
import { ExpressionWidget } from '../ExpressionWidget';

type Size = {
  width?: number | string;
  height?: number | string;
};

type SizeWidgetType = `${typeof CORE_VERSION}/${StyleWidgetName.Size}`;
declare module '../../../types/widget' {
  interface WidgetOptionsMap {
    'core/v1/size': {};
  }
}

export const SizeWidget: React.FC<WidgetProps<SizeWidgetType, Size>> = props => {
  const { value, onChange } = props;

  return (
    <HStack>
      <HStack flex={1} minW={0}>
        <Text>W</Text>
        <Box flex={1} minW={0}>
          <ExpressionWidget
            {...props}
            spec={mergeWidgetOptionsIntoSpec<'core/v1/expression'>(
              { widget: 'core/v1/expression' },
              {
                compactOptions: { height: '32px' },
              }
            )}
            value={value.width === undefined ? '' : String(value.width) || ''}
            onChange={v => {
              const newSize = {
                ...value,
                width: v,
              };
              onChange(newSize);
            }}
          />
        </Box>
      </HStack>
      <HStack flex={1} minW={0}>
        <Text>H</Text>
        <Box flex={1} minW={0}>
          <ExpressionWidget
            {...props}
            spec={mergeWidgetOptionsIntoSpec<'core/v1/expression'>(
              { widget: 'core/v1/expression' },
              {
                compactOptions: { height: '32px' },
              }
            )}
            value={value.height === undefined ? '' : String(value.height) || ''}
            onChange={v => {
              const newSize = {
                ...value,
                height: v,
              };
              onChange(newSize);
            }}
          />
        </Box>
      </HStack>
    </HStack>
  );
};

export default implementWidget<SizeWidgetType>({
  version: CORE_VERSION,
  metadata: {
    name: StyleWidgetName.Size,
  },
})(SizeWidget);
