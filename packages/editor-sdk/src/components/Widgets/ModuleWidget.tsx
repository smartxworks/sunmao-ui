import { Box, FormControl, FormLabel, Select } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { WidgetProps } from '../../types/widget';
import { implementWidget } from '../../utils/widget';
import { SpecWidget } from './SpecWidget';
import { CORE_VERSION, MODULE_WIDGET_NAME } from '@sunmao-ui/shared';

export const ModuleWidget: React.FC<WidgetProps> = props => {
  const { component, value, spec, services, path, level, onChange } = props;
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
      <SpecWidget
        component={component}
        spec={spec.properties!.id! as WidgetProps['spec']}
        value={value?.id}
        path={path.concat('id')}
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
        <SpecWidget
          component={component}
          spec={{
            ...module.spec.properties,
            title: 'Module Properties',
          }}
          path={path}
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
  version: CORE_VERSION,
  metadata: {
    name: MODULE_WIDGET_NAME,
  },
})(ModuleWidget);
