import React from 'react';
import { HStack, Text } from '@chakra-ui/react';
import { CORE_VERSION, StyleWidgetName } from '@sunmao-ui/shared';
import { WidgetProps } from '../../../types/widget';
import { implementWidget } from '../../../utils/widget';
import { ExpressionEditor } from '../../Form';

type Size = {
  width?: string;
  height?: string;
};

export const SizeField: React.FC<WidgetProps<{}, Size>> = props => {
  const { value, onChange } = props;

  return (
    <HStack>
      <Text>W</Text>
      <ExpressionEditor
        compact={true}
        defaultCode={value.width || ''}
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
        defaultCode={value.height || ''}
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
})(SizeField);
