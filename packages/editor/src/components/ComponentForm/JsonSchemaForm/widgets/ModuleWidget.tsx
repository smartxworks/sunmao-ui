import { Box, FormControl, FormLabel, Select } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { FieldProps } from '../fields';
import SchemaField from '../SchemaField';

type Props = FieldProps;

export const ModuleWidget: React.FC<Props> = props => {
  const { formData, onChange, schema, registry } = props;
  const moduleTypes = useMemo(() => {
    const res: string[] = [];
    for (const version of registry.modules.keys()) {
      for (const name of registry.modules.get(version)!.keys()) {
        res.push(`${version}/${name}`);
      }
    }
    return res;
  }, [registry]);
  const module = useMemo(() => {
    if (!formData?.type) {
      return null;
    }
    return registry.getModuleByType(formData.type);
  }, [formData]);

  return (
    <Box p="2" border="1px solid" borderColor="gray.200" borderRadius="4">
      <SchemaField
        schema={schema.properties!.id! as FieldProps['schema']}
        registry={registry}
        label="Module ID"
        formData={formData?.id}
        onChange={v =>
          onChange({
            ...formData,
            id: v,
          })
        }
      />
      <FormControl id="type">
        <FormLabel>Module Type</FormLabel>
        <Select
          placeholder="select module"
          value={formData?.type}
          onChange={evt =>
            onChange({
              ...formData,
              type: evt.currentTarget.value,
            })
          }
        >
          {moduleTypes.map(type => (
            <option key={type}>{type}</option>
          ))}
        </Select>
      </FormControl>
      {module !== null && (
        <SchemaField
          schema={{
            ...module.spec.properties,
            title: 'Module Properties',
          }}
          registry={registry}
          label="Module Properties"
          formData={formData?.properties}
          onChange={v =>
            onChange({
              ...formData,
              properties: v,
            })
          }
        />
      )}
    </Box>
  );
};
