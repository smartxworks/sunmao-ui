import React, { useCallback } from 'react';
import {
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  Link,
  Text,
} from '@chakra-ui/react';
import { EditorServices } from '../../types';
import { InsideMethodRelation } from './type';
import { Placeholder } from './Placeholder';

type Props = {
  methodRelations: InsideMethodRelation[];
  services: EditorServices;
};

export const ExtractModuleEventForm: React.FC<Props> = ({
  methodRelations,
  services,
}) => {
  const { editorStore } = services;

  const idLink = useCallback(
    (id: string) => {
      return (
        <Link
          size="sm"
          onClick={() => {
            editorStore.setSelectedComponentId(id);
          }}
        >
          {id}
        </Link>
      );
    },
    [editorStore]
  );

  let content = (
    <Placeholder text={`No event handler calls outside components' method.`} />
  );

  if (methodRelations.length) {
    content = (
      <Table
        size="sm"
        border="1px solid"
        borderColor="gray.100"
        style={{
          tableLayout: 'fixed',
        }}
      >
        <Thead>
          <Tr>
            <Th>Source</Th>
            <Th>Event</Th>
            <Th>Target</Th>
            <Th>Method</Th>
            <Th>Module Event Name</Th>
          </Tr>
        </Thead>
        <Tbody>
          {methodRelations.map((d, i) => {
            return (
              <Tr key={i}>
                <Td>
                  <Text color="blue.500">{d.source}</Text>
                </Td>
                <Td>{d.event}</Td>
                <Td>{idLink(d.target)}</Td>
                <Td>{d.method}</Td>
                <Td fontWeight="bold">{d.source + d.event}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    );
  }

  return (
    <VStack width="full" alignItems="start">
      <Heading size="md">Module Events</Heading>
      <Text>
        {`These components' event handlers call outside components' methods.
        These events will be convert automatically to module's events and exposed to outside components.
        You don't have to do anything.`}
      </Text>
      {content}
    </VStack>
  );
};
