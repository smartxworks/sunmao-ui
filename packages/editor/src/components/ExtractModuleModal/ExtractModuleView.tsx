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
  FormControl,
  FormLabel,
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
import { OutsideExpRelation } from './type';
import { RenameStateForm } from './RenameStateForm';
import { OutsideExpRelationWithState } from '.';

type Props = {
  componentId: string;
  services: EditorServices;
};

// 里面exp依赖外面
type InsideExpRelation = {
  componentId: string;
  exp: string;
  key: string;
};

// 里面的event调用外面的method
export type InsideMethodRelation = {
  handler: Static<typeof EventHandlerSpec>;
  source: string;
  target: string;
  event: string;
  method: string;
};

type AllRelations = {
  exp: InsideExpRelation[];
  method: InsideMethodRelation[];
  outsideExpRelations: OutsideExpRelation[];
};

export const ExtractModuleView: React.FC<Props> = ({ componentId, services }) => {
  const { appModelManager, editorStore } = services;
  const { appModel } = appModelManager;
  const [showRelationId, setShowRelationId] = useState('');
  const radioMapRef = useRef<RefTreatmentMap>({});
  const outsideExpRelationsValueRef = useRef<OutsideExpRelationWithState[]>([]);
  const [moduleName, setModuleName] = useState('myModule0');
  const [moduleVersion, setModuleVersion] = useState('custom/v1');

  const { expressionRelations, methodRelations, outsideExpRelations } = useMemo(() => {
    const root = appModel.getComponentById(componentId as ComponentId)!;
    const moduleComponents = root.allComponents;
    const allRelations = moduleComponents.reduce(
      (res, c) => {
        const { expressionRelations, methodRelations } = getRelations(
          c,
          moduleComponents
        );
        res.exp = res.exp.concat(expressionRelations);
        res.method = res.method.concat(methodRelations);
        return res;
      },
      { exp: [], method: [], outsideExpRelations: [] } as AllRelations
    );
    const outsideExpRelations = getOutsideExpRelations(appModel.allComponents, root);
    console.log('outsideExpRelations', outsideExpRelations);
    console.log('allRelations', allRelations);
    return {
      expressionRelations: allRelations.exp,
      methodRelations: allRelations.method,
      outsideExpRelations,
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
    );
  };

  const renameStateForm = () => {
    if (!outsideExpRelations.length) {
      return <Placeholder />;
    }

    return (
      <RenameStateForm
        outsideExpRelations={outsideExpRelations}
        onChange={v => {
          outsideExpRelationsValueRef.current = v;
          console.log('outsideExpRelationsValueRef', v);
        }}
      />
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
            <Th>Source</Th>
            <Th>Event</Th>
            <Th>Target</Th>
            <Th>Method</Th>
          </Tr>
        </Thead>
        <Tbody>
          {methodRelations.map((d, i) => {
            return (
              <Tr key={i}>
                <Td>{d.source}</Td>
                <Td>{d.event}</Td>
                <Td>{idLink(d.target)}</Td>
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
    console.log('radioMapRef', radioMapRef);
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
      methodRelations,
      outsideExpRelations: outsideExpRelationsValueRef.current,
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
          <Heading size="md">State map Config</Heading>
          {renameStateForm()}
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

// 获取外部组件中依赖Module内组件的表达式;
// TODO: 这里只检查了component的property，没检查trait里面的
function getOutsideExpRelations(
  allComponents: IComponentModel[],
  moduleRoot: IComponentModel
): OutsideExpRelation[] {
  const res: OutsideExpRelation[] = [];
  const clonedRoot = moduleRoot.clone();
  const ids = clonedRoot.allComponents.map(c => c.id);
  allComponents.forEach(c => {
    if (clonedRoot.appModel.getComponentById(c.id)) {
      // 是module内的，无视
      return;
    }
    c.properties.traverse((field, key) => {
      if (field.isDynamic) {
        const relyRefs = Object.keys(field.refComponentInfos).filter(refId =>
          ids.includes(refId as ComponentId)
        );
        relyRefs.forEach(refId => {
          res.push({
            componentId: c.id,
            exp: field.getValue() as string,
            key,
            valuePath:
              field.refComponentInfos[refId as ComponentId].refProperties.slice(-1)[0],
            relyOn: refId,
          });
        });
      }
    });
  });
  return res;
}

function getRelations(component: IComponentModel, components: IComponentModel[]) {
  const expressionRelations: InsideExpRelation[] = [];
  const methodRelations: InsideMethodRelation[] = [];
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

    // 检查Module中有没有调用外部的组件的Method
    if (t.type === `${CORE_VERSION}/${CoreTraitName.Event}`) {
      t.rawProperties.handlers.forEach((h: Static<typeof EventHandlerSpec>) => {
        if (!ids.includes(h.componentId)) {
          methodRelations.push({
            source: component.id,
            event: h.type,
            target: h.componentId,
            method: h.method.name,
            handler: h,
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

  useEffect(() => {
    onChange(value);
  }, [onChange, value]);

  return (
    <VStack>
      {Object.keys(value).map(id => {
        return (
          <FormControl key={id} as="fieldset">
            <FormLabel>
              <Button
                variant="link"
                colorScheme="blue"
                size="sm"
                onClick={() => onClickComponent(id)}
              >
                {id}
              </Button>
            </FormLabel>
            <RadioGroup
              onChange={newValue => {
                const next = { ...value, [id]: newValue as any };
                setValue(next);
              }}
              value={value[id]}
            >
              <HStack>
                <Radio value={RefTreatment.move}>Move in module</Radio>
                <Radio value={RefTreatment.keep}>Keep outside</Radio>
                <Radio value={RefTreatment.ignore}>Ignore</Radio>
              </HStack>
            </RadioGroup>
          </FormControl>
        );
      })}
    </VStack>
  );
};
