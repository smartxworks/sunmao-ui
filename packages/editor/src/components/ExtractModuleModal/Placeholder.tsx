import { Text } from '@chakra-ui/react';
import React from 'react';

export const Placeholder: React.FC<{ text: string }> = ({ text }) => {
  return (
    <Text
      width="full"
      padding="12px"
      background="gray.100"
      color="gray.500"
      borderRadius="4px"
      textAlign="center"
    >
      {text}
    </Text>
  );
};
