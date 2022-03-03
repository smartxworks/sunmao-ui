import React from 'react';
import { Box, Text } from '@sunmao-ui/editor-sdk';

export const SlotDropArea: React.FC<{
  componentId: string;
  slotId: string;
  isOver: boolean;
}> = ({ componentId, slotId, isOver }) => {
  return (
    <Box flex="1 1 0" position="relative">
      <Text
        position="absolute"
        text-align="center"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        {componentId}-{slotId}
      </Text>
      <Box
        top="4px"
        bottom="4px"
        left="4px"
        right="4px"
        position="absolute"
        transform="translate3d(0, 0, 0)"
        opacity="0.5"
        backgroundColor={isOver ? 'orange' : undefined}
        boxShadow={isOver ? '0px 0px 30px rgba(0, 0, 0, 0.6)' : undefined}
      />
    </Box>
  );
};
