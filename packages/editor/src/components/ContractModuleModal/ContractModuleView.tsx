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
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { EditorServices } from '../../types';
import { ComponentId, IComponentModel } from '../../AppModel/IAppModel';
import { CoreTraitName, CORE_VERSION, EventHandlerSpec } from '@sunmao-ui/shared';
import { Static } from '@sinclair/typebox';
import { uniq } from 'lodash';

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

export const ContractModuleView: React.FC<Props> = ({ componentId, services }) => {
  const { appModelManager, editorStore } = services;
  const { appModel } = appModelManager;
  const radioMapRef = useRef<RadioMapType>({});
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
      <RadioMapForm
        ids={uniqExpRelations}
        onChange={v => {
          radioMapRef.current = v;
          console.log(v);
        }}
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

  const onContract = () => {
    const properties: Record<string, string> = {};
    const extraComponentIds: string[] = [];
    expressionRelations.forEach(relation => {
      if (radioMapRef.current[relation.componentId] === '1') {
        extraComponentIds.push(relation.componentId);
      }
      if (radioMapRef.current[relation.componentId] === '2') {
        properties[relation.componentId] = `{{${relation.componentId}}}`;
      }
    });
    editorStore.contractModules({
      id: componentId,
      properties,
      extraComponentIds: uniq(extraComponentIds),
      moduleName,
      moduleVersion,
    });
  };

  return (
    <VStack spacing="6" width="full" alignItems="start">
      <Input value={moduleVersion} onChange={v => setModuleVersion(v.target.value)} />
      <Input value={moduleName} onChange={v => setModuleName(v.target.value)} />
      <Button onClick={onContract}>Contract</Button>
      <VStack width="full" alignItems="start">
        <Heading size="md">These component will not be in module.</Heading>
        {expressionTable()}
      </VStack>
      <VStack width="full" alignItems="start">
        <Heading size="md">Who calls my methods?</Heading>
        {methodTable()}
      </VStack>
    </VStack>
  );
};

function getRelations(component: IComponentModel, components: IComponentModel[]) {
  const expressionRelations: ExpressionRelation[] = [];
  const methodRelations: MethodRelation[] = [];
  const ids = components.map(c => c.id) as string[];
  component.properties.traverse((field, key) => {
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

type RadioMapType = Record<string, '1' | '2'>;

type RadioMapFormProps = {
  ids: string[];
  onChange: (map: RadioMapType) => void;
};

const RadioMapForm: React.FC<RadioMapFormProps> = ({ ids, onChange }) => {
  const [value, setValue] = useState<RadioMapType>({});

  useEffect(() => {
    const map: Record<string, '1' | '2'> = {};
    ids.forEach(r => {
      map[r] = '1';
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
              <FormLabel>{id}</FormLabel>
              <Radio value="1">Move in module</Radio>
              <Radio value="2">Keep outside</Radio>
            </HStack>
          </RadioGroup>
        );
      })}
    </VStack>
  );
};
