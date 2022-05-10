import React from 'react';
import { Flex, Button, Box } from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';

export const EditorHeader: React.FC<{
  scale: number;
  setScale: (v: number) => void;
  onPreview: () => void;
  onCodeMode: () => void;
  onRefresh: () => void;
}> = ({ scale, setScale, onPreview, onCodeMode, onRefresh }) => {
  return (
    <Flex p={2} borderBottomWidth="2px" borderColor="gray.200" align="center">
      <Flex flex="1" />
      <Flex flex="1" align="center" justify="center">
        <Button size="sm" disabled={scale <= 50} onClick={() => setScale(scale - 10)}>
          <MinusIcon />
        </Button>
        <Box fontSize="sm" mx="2" width={10} textAlign="center">
          {scale}%
        </Box>
        <Button size="sm" disabled={scale >= 100} onClick={() => setScale(scale + 10)}>
          <AddIcon />
        </Button>
      </Flex>
      <Flex flex="1" justify="end">
        <Button colorScheme="blue" mr={3} onClick={onCodeMode}>
          Code Mode
        </Button>
        <Button colorScheme="blue" mr={3} onClick={onRefresh}>
          Refresh
        </Button>
        <Button colorScheme="blue" onClick={onPreview}>
          Preview
        </Button>
      </Flex>
    </Flex>
  );
};
