import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  Badge,
  Button,
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
import { EditorServices } from '../types';
import { Pagination } from './Pagination';

type Props = {
  services: EditorServices;
};

export const WarningArea: React.FC<Props> = observer(({ services }) => {
  const { editorStore } = services;
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const [currPage, setCurrPage] = React.useState(0);
  const PageSize = 5;
  const { validateResult, setSelectedComponentId } = editorStore;
  const errorItems = useMemo(() => {
    if (isCollapsed) {
      return null;
    }
    console.time('render errors');
    const trs = validateResult
      .slice(currPage * PageSize, currPage * PageSize + PageSize)
      .map((result, i) => {
        return (
          <Tr key={i}>
            <Td
              cursor="pointer"
              fontWeight="bold"
              onClick={() => setSelectedComponentId(result.componentId)}
            >
              {result.componentId}
            </Td>
            <Td>{result.traitType || '-'}</Td>
            <Td>{result.property || '-'}</Td>
            <Td>{result.message}</Td>
          </Tr>
        );
      });
    console.timeEnd('render errors');
    return trs;
  }, [currPage, isCollapsed, setSelectedComponentId, validateResult]);

  const savedBadge = useMemo(() => {
    return <Badge colorScheme="green">Saved</Badge>;
  }, []);

  const unsaveBadge = useMemo(() => {
    return (
      <HStack>
        <Button
          colorScheme="red"
          variant="ghost"
          size="sm"
          onClick={() => editorStore.saveCurrentComponents()}
        >
          Save anyway
        </Button>
        <Badge colorScheme="red">Unsave</Badge>
      </HStack>
    );
  }, [editorStore]);

  return (
    <VStack
      position="absolute"
      bottom="0"
      left="0"
      right="0"
      paddingY="2"
      paddingX="4"
      boxShadow="0 0 4px rgba(0, 0, 0, 0.1)"
      background="white"
      zIndex="1"
    >
      <HStack width="full" justifyContent="space-between">
        <Text fontSize="md" fontWeight="bold">
          Errors
          <Badge ml="1" fontSize="0.8em" colorScheme="red">
            {editorStore.validateResult.length}
          </Badge>
        </Text>
        <HStack>
          {editorStore.isSaved ? savedBadge : unsaveBadge}
          <IconButton
            aria-label="show errors"
            size="sm"
            variant="ghost"
            icon={isCollapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
            onClick={() => setIsCollapsed(prev => !prev)}
          />
        </HStack>
      </HStack>
      <VStack
        display={isCollapsed ? 'none' : 'block'}
        width="full"
        justifyContent="start"
      >
        <Table size="sm" width="full" maxHeight="200px" overflow="auto">
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
        <Pagination
          currentPage={currPage}
          lastPage={Math.ceil(validateResult.length / 5)}
          handlePageClick={page => setCurrPage(page)}
        />
      </VStack>
    </VStack>
  );
});
