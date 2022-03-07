import { Box, FormControl, FormLabel, Select } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { WidgetProps } from '../../types/widget';
import { implementWidget } from '../../utils/widget';
import { SchemaField } from './SchemaField';

export const ModuleWidget: React.FC<WidgetProps> = props => {
  const { component, value, schema, services, level, onChange } = props;
  const { registry } = services;
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
    if (!value?.type) {
      return null;
    }
    return registry.getModuleByType(value.type);
  }, [value]);

  return (
    <Box p="2" border="1px solid" borderColor="gray.200" borderRadius="4">
      <SchemaField
        component={component}
        schema={schema.properties!.id! as WidgetProps['schema']}
        value={value?.id}
        level={level + 1}
        services={services}
        onChange={v =>
          onChange({
            ...value,
            id: v,
          })
        }
      />
      <FormControl id="type">
        <FormLabel>Module Type</FormLabel>
        <Select
          placeholder="select module"
          value={value?.type}
          onChange={evt =>
            onChange({
              ...value,
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
          component={component}
          schema={{
            ...module.spec.properties,
            title: 'Module Properties',
          }}
          value={value?.properties}
          level={level + 1}
          services={services}
          onChange={v =>
            onChange({
              ...value,
              properties: v,
            })
          }
        />
      )}
    </Box>
  );
};

export default implementWidget({
  version: 'core/v1',
  metadata: {
    name: 'Module',
  },
})(ModuleWidget);
