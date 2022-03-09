import React from 'react';
import { Box } from '@chakra-ui/react';
import { ArrayButtonGroup, ArrayButtonGroupProps } from './ArrayButtonGroup';

export const ArrayItemBox: React.FC<ArrayButtonGroupProps> = props => {
  const { children, ...rest } = props;

  return (
    <Box
      mb={2}
      border="1px solid black"
      borderColor="gray.200"
      borderRadius="4"
      padding="8px"
    >
      <ArrayButtonGroup {...rest} />
      {children}
    </Box>
  );
};
