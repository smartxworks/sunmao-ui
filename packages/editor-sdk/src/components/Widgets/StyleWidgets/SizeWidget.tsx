import React, { CSSProperties } from 'react';
import { HStack, Text } from '@chakra-ui/react';
import { CORE_VERSION, StyleWidgetName } from '@sunmao-ui/shared';
import { WidgetProps } from '../../../types/widget';
import { implementWidget } from '../../../utils/widget';
import { ExpressionEditor } from '../../Form';

export const SizeWidget: React.FC<WidgetProps<{}, CSSProperties>> = props => {
  const { value, onChange } = props;

  return (
    <HStack>
      <Text>W</Text>
      <ExpressionEditor
        compact={true}
        defaultCode={String(value.width) || ''}
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
        defaultCode={String(value.height) || ''}
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
