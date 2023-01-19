import React, { useEffect, useMemo, useState } from 'react';
import {
  Heading,
  VStack,
  Button,
  HStack,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Text,
  Tooltip,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { groupBy, uniq } from 'lodash';
import { EditorServices } from '../../types';
import { InsideExpRelation, RefTreatmentMap, RefTreatment } from './type';
import { RelationshipModal } from '../RelationshipModal';
import { Placeholder } from './Placeholder';

type Props = {
  insideExpRelations: InsideExpRelation[];
  onChange: (value: RefTreatmentMap) => void;
  services: EditorServices;
};

const RadioOptions = [
  {
    value: RefTreatment.keep,
    label: 'Keep outside',
    desc: `Keep this outside and pass this component's state into module by properties.`,
  },
  {
    value: RefTreatment.move,
    label: 'Move into module',
    desc: 'Move this component into module and delete it outside.',
  },
  {
    value: RefTreatment.duplicate,
    label: 'Dupliacte',
    desc: 'Copy and paste this component into module and keep it outside at the same time.',
  },
  {
    value: RefTreatment.ignore,
    label: 'Ignore',
    desc: `Don't do anything.`,
  },
];

export const ExtractModulePropertyForm: React.FC<Props> = ({
  insideExpRelations,
  onChange,
  services,
}) => {
  const [showRelationId, setShowRelationId] = useState('');
  const [value, setValue] = useState<RefTreatmentMap>({});

  const [relationGroups, refIds] = useMemo(
    () => [
      groupBy(insideExpRelations, r => r.componentId),
      uniq(insideExpRelations.map(r => r.componentId)),
    ],
    [insideExpRelations]
  );

  useEffect(() => {
    const map: RefTreatmentMap = {};
    refIds.forEach(r => {
      map[r] = RefTreatment.keep;
    });
    setValue(map);
  }, [refIds]);

  useEffect(() => {
    onChange(value);
  }, [onChange, value]);

  let content = <Placeholder text={`No component uses outside components' state.`} />;
  if (refIds.length) {
    content = (
      <VStack width="full" spacing={4}>
        {Object.keys(value).map(id => {
          return (
            <VStack key={id} width="full">
              <FormControl as="fieldset" width="full">
                <FormLabel>
                  <Button
                    variant="link"
                    colorScheme="blue"
                    size="sm"
                    onClick={() => setShowRelationId(id)}
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
                    {RadioOptions.map(o => (
                      <Radio key={o.value} value={o.value} cursor="pointer">
                        <Tooltip cursor="pointer" label={o.desc}>
                          {o.label}
                        </Tooltip>
                      </Radio>
                    ))}
                  </HStack>
                </RadioGroup>
              </FormControl>

              <Table
                size="sm"
                border="1px solid"
                borderColor="gray.100"
                width="full"
                style={{
                  tableLayout: 'fixed',
                }}
              >
                <Thead>
                  <Tr>
                    <Th>Component Id</Th>
                    <Th>Property Key</Th>
                    <Th>Expression</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {relationGroups[id].map((r, i) => {
                    return (
                      <Tr key={i}>
                        <Td>
                          <Text color="red.500">
                            {r.source}
                            {r.traitType ? `-${r.traitType}` : ''}
                          </Text>
                        </Td>
                        <Td>{r.key}</Td>
                        <Td>{r.exp}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </VStack>
          );
        })}
      </VStack>
    );
  }

  const relationshipViewModal = showRelationId ? (
    <RelationshipModal
      componentId={showRelationId}
      services={services}
      onClose={() => setShowRelationId('')}
    />
  ) : null;
  return (
    <>
      <VStack width="full" alignItems="start">
        <Heading size="md">Module Properties</Heading>
        <Text>
          These components are used by the components of module, you have to decide how to
          treat them.
        </Text>
        {content}
      </VStack>
      {relationshipViewModal}
    </>
  );
};
