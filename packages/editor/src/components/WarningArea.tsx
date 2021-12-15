import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  Badge,
  HStack,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import { editorStore } from '../EditorStore';

export const WarningArea: React.FC = observer(() => {
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const errorItems = useMemo(() => {
    if (isCollapsed) {
      return null;
    }
    return editorStore.validateResult.map((result, i) => {
      return (
        <Tr key={i}>
          <Td
            cursor="pointer"
            fontWeight="bold"
            onClick={() => editorStore.setSelectedComponentId(result.componentId)}
          >
            {result.componentId}
          </Td>
          <Td>{result.traitType || '-'}</Td>
          <Td>{result.property || '-'}</Td>
          <Td>{result.message}</Td>
        </Tr>
      );
    });
  }, [isCollapsed, editorStore.validateResult]);

  return (
    <VStack
      position="absolute"
      bottom="0"
      left="0"
      right="0"
      paddingY="2"
      paddingX="4"
      boxShadow="0 0 4px rgba(0, 0, 0, 0.1)"
    >
      <HStack width="full" justifyContent="space-between">
        <Text fontSize="md" fontWeight="bold">
          Errors
          <Badge ml="1" fontSize="0.8em" colorScheme="red">
            {editorStore.validateResult.length}
          </Badge>
        </Text>
        <IconButton
          aria-label="show errors"
          size="sm"
          variant="ghost"
          icon={isCollapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
          onClick={() => setIsCollapsed(prev => !prev)}
        />
      </HStack>
      <Table
        size="sm"
        width="full"
        display={isCollapsed ? 'none' : 'block'}
        maxHeight="200px"
        overflow="auto"
      >
        <Thead>
          <Tr>
            <Th>Component Id</Th>
            <Th>Trait Type</Th>
            <Th>Property</Th>
            <Th>Message</Th>
          </Tr>
        </Thead>
        <Tbody>{errorItems}</Tbody>
      </Table>
    </VStack>
  );
});
