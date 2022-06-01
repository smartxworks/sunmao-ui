import React from 'react';
import { HStack, Text } from '@chakra-ui/react';
import { CORE_VERSION, StyleWidgetName } from '@sunmao-ui/shared';
import { WidgetProps } from '../../../types/widget';
import { implementWidget } from '../../../utils/widget';
import { ExpressionEditor } from '../../Form';

type Size = {
  width?: number | string;
  height?: number | string;
};

export const SizeWidget: React.FC<WidgetProps<{}, Size>> = props => {
  const { value, onChange } = props;

  return (
    <HStack width="full">
      <Text>W</Text>
      <ExpressionEditor
        compact={true}
        defaultCode={value.width === undefined ? '' : String(value.width) || ''}
        onBlur={v => {
          const newSize = {
            ...value,
            width: v,
          };
          onChange(newSize);
        }}
      />
      <Text>H</Text>
      <ExpressionEditor
        compact={true}
        defaultCode={value.height === undefined ? '' : String(value.height) || ''}
        onBlur={v => {
          const newSize = {
            ...value,
            height: v,
          };
          onChange(newSize);
        }}
      />
    </HStack>
  );
};

export default implementWidget({
  version: CORE_VERSION,
  metadata: {
    name: StyleWidgetName.Size,
  },
})(SizeWidget);
