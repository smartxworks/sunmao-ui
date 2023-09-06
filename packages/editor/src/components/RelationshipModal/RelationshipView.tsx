import React, { useCallback } from 'react';
import {
  Text,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  Link,
} from '@chakra-ui/react';
import { EditorServices } from '../../types';
import { ComponentId } from '../../AppModel/IAppModel';
import { CoreTraitName, CORE_VERSION, EventHandlerSpec } from '@sunmao-ui/shared';
import { Static } from '@sinclair/typebox';
import { AppModel } from '../../AppModel/AppModel';

type Props = {
  componentId: string;
  services: EditorServices;
};

type ExpressionRelation = {
  componentId: string;
  exp: string;
  key: string;
};
type MethodRelation = {
  componentId: string;
  event: string;
  method: string;
};

export const RelationshipView: React.FC<Props> = ({ componentId, services }) => {
  const { appModelManager, editorStore } = services;
  const { appModel } = appModelManager;

  const { expressionRelations, methodRelations } = getRelations(
    componentId as ComponentId,
    appModel
  );

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

  const expressionTable = () => {
    if (!expressionRelations.length) {
      return <Placeholder />;
    }
    return (
      <Table size="sm" border="1px solid" borderColor="gray.100">
        <Thead>
          <Tr>
            <Th>ComponentId</Th>
            <Th>Key</Th>
            <Th>Expression</Th>
          </Tr>
        </Thead>
        <Tbody>
          {expressionRelations.map((d, i) => {
            return (
              <Tr key={i}>
                <Td>{idLink(d.componentId)}</Td>
                <Td>{d.key}</Td>
                <Td>{d.exp}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    );
  };

  const methodTable = () => {
    if (!methodRelations.length) {
      return <Placeholder />;
    }
    return (
      <Table size="sm" border="1px solid" borderColor="gray.100">
        <Thead>
          <Tr>
            <Th>ComponentId</Th>
            <Th>Event</Th>
            <Th>Method</Th>
          </Tr>
        </Thead>
        <Tbody>
          {methodRelations.map((d, i) => {
            return (
              <Tr key={i}>
                <Td>{idLink(d.componentId)}</Td>
                <Td>{d.event}</Td>
                <Td>{d.method}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    );
  };

  return (
    <VStack spacing="6" width="full" alignItems="start">
      <VStack width="full" alignItems="start">
        <Heading size="md">Who uses my states?</Heading>
        {expressionTable()}
      </VStack>
      <VStack width="full" alignItems="start">
        <Heading size="md">Who calls my methods?</Heading>
        {methodTable()}
      </VStack>
    </VStack>
  );
};

export function getRelations(componentId: ComponentId, appModel: AppModel) {
  const expressionRelations: ExpressionRelation[] = [];
  const methodRelations: MethodRelation[] = [];
  appModel.traverseTree(c => {
    c.properties.traverse((field, key) => {
      if (field.isDynamic && field.refComponentInfos[componentId]) {
        expressionRelations.push({
          componentId: c.id,
          exp: field.rawValue,
          key: key,
        });
      }
    });
    c.traits.forEach(t => {
      t.properties.traverse((field, key) => {
        if (field.isDynamic && field.refComponentInfos[componentId]) {
          expressionRelations.push({
            componentId: c.id,
            exp: field.rawValue,
            key: key,
          });
        }
      });

      if (t.type === `${CORE_VERSION}/${CoreTraitName.Event}`) {
        t.rawProperties.handlers.forEach((h: Static<typeof EventHandlerSpec>) => {
          if (h.componentId === componentId) {
            methodRelations.push({
              componentId: c.id,
              event: h.type,
              method: h.method.name,
            });
          }
        });
      }
      // special treat for core/v1/fetch, because its event handler is not in event trait
      if (t.type === `${CORE_VERSION}/${CoreTraitName.Fetch}`) {
        t.rawProperties.onComplete.forEach((h: Static<typeof EventHandlerSpec>) => {
          if (h.componentId === componentId) {
            methodRelations.push({
              componentId: c.id,
              event: 'onComplete',
              method: h.method.name,
            });
          }
        });
        t.rawProperties.onError.forEach((h: Static<typeof EventHandlerSpec>) => {
          if (h.componentId === componentId) {
            methodRelations.push({
              componentId: c.id,
              event: 'onError',
              method: h.method.name,
            });
          }
        });
      }
    });
  });
  return { expressionRelations, methodRelations };
}

const Placeholder = () => {
  return (
    <Text
      width="full"
      padding="12px"
      background="gray.100"
      color="gray.500"
      borderRadius="4px"
      textAlign="center"
    >
      No body
    </Text>
  );
};
