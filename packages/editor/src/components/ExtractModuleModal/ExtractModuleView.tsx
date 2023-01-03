import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  Button,
  HStack,
  Radio,
  RadioGroup,
  Input,
} from '@chakra-ui/react';
import { EditorServices } from '../../types';
import { ComponentId, IComponentModel } from '../../AppModel/IAppModel';
import {
  CoreTraitName,
  CORE_VERSION,
  EventHandlerSpec,
  ExpressionKeywords,
} from '@sunmao-ui/shared';
import { Static } from '@sinclair/typebox';
import { uniq } from 'lodash';
import { RelationshipModal } from '../RelationshipModal';

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

type AllRelations = {
  exp: ExpressionRelation[];
  method: MethodRelation[];
};

export const ExtractModuleView: React.FC<Props> = ({ componentId, services }) => {
  const { appModelManager, editorStore } = services;
  const { appModel } = appModelManager;
  const [showRelationId, setShowRelationId] = useState('');
  const radioMapRef = useRef<RefTreatmentMap>({});
  const [moduleName, setModuleName] = useState('myModule0');
  const [moduleVersion, setModuleVersion] = useState('custom/v1');

  const { expressionRelations, methodRelations } = useMemo(() => {
    const root = appModel.getComponentById(componentId as ComponentId)!;
    const components = root.allComponents;
    const allRelations = components.reduce(
      (res, c) => {
        const { expressionRelations, methodRelations } = getRelations(c, components);
        res.exp = res.exp.concat(expressionRelations);
        res.method = res.method.concat(methodRelations);
        return res;
      },
      { exp: [], method: [] } as AllRelations
    );
    console.log('allRelations', allRelations);
    return {
      expressionRelations: allRelations.exp,
      methodRelations: allRelations.method,
    };
  }, [appModel, componentId]);

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

  const uniqExpRelations = uniq(expressionRelations.map(r => r.componentId));

  const expressionTable = () => {
    if (!expressionRelations.length) {
      return <Placeholder />;
    }

    return (
      <RefTreatmentForm
        ids={uniqExpRelations}
        onChange={v => {
          radioMapRef.current = v;
          console.log(v);
        }}
        onClickComponent={id => setShowRelationId(id)}
      />
      // <Table size="sm" border="1px solid" borderColor="gray.100">
      //   <Thead>
      //     <Tr>
      //       <Th>ComponentId</Th>
      //       <Th>Move In to</Th>
      //       <Th>Expression</Th>
      //     </Tr>
      //   </Thead>
      //   <Tbody>
      //     {uniqExpRelations.map((d, i) => {
      //       return (
      //         <Tr key={i}>
      //           <Td>{idLink(d)}</Td>
      //           {/* <Td>{d.key}</Td>
      //           <Td>{d.exp}</Td> */}
      //         </Tr>
      //       );
      //     })}
      //   </Tbody>
      // </Table>
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

  const onExtract = () => {
    const properties: Record<string, string> = {};
    const toMoveComponentIds: string[] = [];
    expressionRelations.forEach(relation => {
      switch (radioMapRef.current[relation.componentId]) {
        case RefTreatment.move:
          toMoveComponentIds.push(relation.componentId);
          break;
        case RefTreatment.keep:
          properties[relation.componentId] = `{{${relation.componentId}}}`;
          break;
      }
    });
    editorStore.extractModules({
      id: componentId,
      properties,
      toMoveComponentIds: uniq(toMoveComponentIds),
      moduleName,
      moduleVersion,
    });
  };

  const relationshipViewModal = showRelationId ? (
    <RelationshipModal
      componentId={showRelationId}
      services={services}
      onClose={() => setShowRelationId('')}
    />
  ) : null;
  return (
    <>
      <VStack spacing="6" width="full" alignItems="start">
        <Input value={moduleVersion} onChange={v => setModuleVersion(v.target.value)} />
        <Input value={moduleName} onChange={v => setModuleName(v.target.value)} />
        <Button onClick={onExtract}>Extract</Button>
        <VStack width="full" alignItems="start">
          <Heading size="md">
            These components are used in module, you have to decide how to treat them.
          </Heading>
          {expressionTable()}
        </VStack>
        <VStack width="full" alignItems="start">
          <Heading size="md">Who calls my methods?</Heading>
          {methodTable()}
        </VStack>
      </VStack>
      {relationshipViewModal}
    </>
  );
};

function getRelations(component: IComponentModel, components: IComponentModel[]) {
  const expressionRelations: ExpressionRelation[] = [];
  const methodRelations: MethodRelation[] = [];
  const ids = components.map(c => c.id) as string[];
  // 获取到Module中用到的外部id
  component.properties.traverse((field, key) => {
    if (field.isDynamic) {
      const usedIds = Object.keys(field.refComponentInfos);
      usedIds.forEach(usedId => {
        // 排除掉全局变量和sunmao关键字
        if (
          !ids.includes(usedId) &&
          !(usedId in window) &&
          !ExpressionKeywords.includes(usedId)
        ) {
          expressionRelations.push({
            componentId: usedId,
            exp: field.rawValue,
            key: key,
          });
        }
      });
    }
  });

  component.traits.forEach(t => {
    t.properties.traverse((field, key) => {
      if (field.isDynamic) {
        const usedIds = Object.keys(field.refComponentInfos);
        usedIds.forEach(usedId => {
          if (!ids.includes(usedId)) {
            expressionRelations.push({
              componentId: usedId,
              exp: field.rawValue,
              key: key,
            });
          }
        });
      }
    });

    if (t.type === `${CORE_VERSION}/${CoreTraitName.Event}`) {
      t.rawProperties.handlers.forEach((h: Static<typeof EventHandlerSpec>) => {
        if (!ids.includes(h.componentId)) {
          methodRelations.push({
            componentId: h.componentId,
            event: h.type,
            method: h.method.name,
          });
        }
      });
    }
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

enum RefTreatment {
  'keep' = 'keep',
  'move' = 'move',
  'ignore' = 'ignore',
}

type RefTreatmentMap = Record<string, RefTreatment>;

type RefTreatmentFormProps = {
  ids: string[];
  onChange: (map: RefTreatmentMap) => void;
  onClickComponent: (id: string) => void;
};

const RefTreatmentForm: React.FC<RefTreatmentFormProps> = ({
  ids,
  onChange,
  onClickComponent,
}) => {
  const [value, setValue] = useState<RefTreatmentMap>({});

  useEffect(() => {
    const map: RefTreatmentMap = {};
    ids.forEach(r => {
      map[r] = RefTreatment.keep;
    });
    setValue(map);
  }, [ids]);

  return (
    <VStack>
      {Object.keys(value).map(id => {
        return (
          <RadioGroup
            key={id}
            onChange={newValue => {
              const next = { ...value, [id]: newValue as any };
              onChange(next);
              setValue(next);
            }}
            value={value[id]}
          >
            <HStack>
              <Button
                variant="link"
                colorScheme="blue"
                size="sm"
                onClick={() => onClickComponent(id)}
              >
                {id}
              </Button>
              <Radio value={RefTreatment.move}>Move in module</Radio>
              <Radio value={RefTreatment.keep}>Keep outside</Radio>
              <Radio value={RefTreatment.ignore}>Ignore</Radio>
            </HStack>
          </RadioGroup>
        );
      })}
    </VStack>
  );
};
