import React from 'react';
import { HStack, Input, Text } from '@chakra-ui/react';
import { CORE_VERSION, StyleWidgetName } from '@sunmao-ui/shared';
import { WidgetProps } from '../../../types/widget';
import { implementWidget } from '../../../utils/widget';

type Size = {
  width: string;
  height: string;
};

export const SizeField: React.FC<WidgetProps<{}, Size>> = props => {
  const { value, onChange } = props;
  // const [size, setSize] = React.useState<Size>({ width: '', height: '' });

  return (
    <HStack>
      <Text>W</Text>
      <Input
        value={value.width}
        onChange={e => {
          const newSize = {
            ...value,
            height: e.target.value,
          };
          // setSize({
          //   ...size,
          //   width: e.target.value,
          // });
          onChange(newSize);
        }}
      />
      <Text>H</Text>
      <Input
        value={value.height}
        onChange={e => {
          const newSize = {
            ...value,
            height: e.target.value,
          };
          onChange(newSize);
          // setSize({
          //   ...size,
          //   height: e.target.value,
          // });
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
