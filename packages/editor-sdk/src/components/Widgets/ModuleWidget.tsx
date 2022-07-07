import { Box, FormControl, FormLabel, Select } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { WidgetProps } from '../../types/widget';
import { implementWidget } from '../../utils/widget';
import { SpecWidget } from './SpecWidget';
import { CORE_VERSION, CoreWidgetName, isJSONSchema } from '@sunmao-ui/shared';
import { css } from '@emotion/css';

const LabelStyle = css`
  font-weight: normal;
  font-size: 14px;
`;

type ModuleWidgetType = `${typeof CORE_VERSION}/${CoreWidgetName.Module}`;

declare module '../../types/widget' {
  interface WidgetOptionsMap {
    'core/v1/module': {};
  }
}

export const ModuleWidget: React.FC<WidgetProps<ModuleWidgetType>> = props => {
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
    if (!value?.type || moduleTypes.length === 0) {
      return null;
    }
    let module;
    try {
      module = registry.getModuleByType(value.type);
    } catch {
      module = null;
    }
    return module;
  }, [value, moduleTypes, registry]);

  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const moduleType = e.target.value;
    let initProperties = {};
    if (moduleType) {
      try {
        const module = registry.getModuleByType(moduleType);
        initProperties = module.spec.exampleProperties || {};
      } catch {
        initProperties = {};
      }
    }

    onChange({
      ...value,
      properties: initProperties,
      type: moduleType,
    });
  };

  return (
    <Box p="2" border="1px solid" borderColor="gray.200" borderRadius="4">
      <SpecWidget
        component={component}
        spec={spec.properties!.id! as WidgetProps<'core/v1/spec'>['spec']}
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
      <FormControl mb="2" id="type">
        <FormLabel>
          <span className={LabelStyle}>Module Type</span>
        </FormLabel>
        <Select
          placeholder="select module"
          value={value?.type}
          onChange={handleModuleChange}
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
          path={[]}
          value={{ ...module.spec.properties, ...value?.properties }}
          level={1}
          services={services}
          onChange={v => {
            onChange({
              ...value,
              properties: v,
            });
          }}
        />
      )}
      {spec.properties!.handlers && isJSONSchema(spec.properties!.handlers) && (
        <SpecWidget
          component={component}
          spec={spec.properties!.handlers}
          value={value?.handlers}
          path={path.concat('handlers')}
          level={level + 1}
          services={services}
          onChange={v => {
            onChange({
              ...value,
              handlers: v,
            });
          }}
        />
      )}
    </Box>
  );
};

export default implementWidget({
  version: CORE_VERSION,
  metadata: {
    name: CoreWidgetName.Module,
  },
})(ModuleWidget);
