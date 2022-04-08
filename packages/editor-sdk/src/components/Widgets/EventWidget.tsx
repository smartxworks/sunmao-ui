import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import { Type, Static } from '@sinclair/typebox';
import { useFormik } from 'formik';
import { GLOBAL_UTILS_ID } from '@sunmao-ui/runtime';
import { ComponentSchema } from '@sunmao-ui/core';
import { WidgetProps } from '../../types/widget';
import { implementWidget, mergeWidgetOptionsIntoSpec } from '../../utils/widget';
import { RecordWidget } from './RecordField';
import { SpecWidget } from './SpecWidget';
import { observer } from 'mobx-react-lite';

const EventWidgetOptions = Type.Object({});

type EventWidgetOptionsType = Static<typeof EventWidgetOptions>;

export const EventWidget: React.FC<WidgetProps<EventWidgetOptionsType>> = observer(
  props => {
    const { value, path, level, component, spec, services, onChange } = props;
    const { registry, editorStore, appModelManager } = services;
    const { utilMethods } = registry;
    const { components } = editorStore;
    const [methods, setMethods] = useState<string[]>([]);

    const formik = useFormik({
      initialValues: value,
      onSubmit: values => {
        onChange(values);
      },
    });
    const findMethodsByComponent = (component?: ComponentSchema) => {
      if (!component) {
        return [];
      }

      const componentMethods = Object.entries(
        registry.getComponentByType(component.type).spec.methods
      ).map(([name, parameters]) => ({
        name,
        parameters,
      }));
      const traitMethods = component.traits
        .map(trait => registry.getTraitByType(trait.type).spec.methods)
        .flat();

      return ([] as any[]).concat(componentMethods, traitMethods);
    };

    const eventTypes = useMemo(() => {
      return registry.getComponentByType(component.type).spec.events;
    }, [component.type, registry]);
    const hasParams = useMemo(
      () => Object.keys(formik.values.method.parameters ?? {}).length,
      [formik.values.method.parameters]
    );
    const paramsSpec = useMemo(() => {
      const { values } = formik;
      const methodName = values.method.name;
      let spec: WidgetProps['spec'] = Type.Record(Type.String(), Type.String());

      if (methodName) {
        if (value.componentId === GLOBAL_UTILS_ID) {
          const targetMethod = utilMethods.get(methodName);

          spec = targetMethod?.parameters;
        } else {
          const targetComponent = appModelManager.appModel.getComponentById(
            value.componentId
          );
          const targetMethod = (findMethodsByComponent(targetComponent) ?? []).find(
            ({ name }) => name === formik.values.method.name
          );

          if (targetMethod?.parameters) {
            spec = targetMethod.parameters;
          }
        }
      }

      return spec;
    }, [formik.values.method]);
    const params = useMemo(() => {
      const params: Record<string, string> = {};
      const { values } = formik;

      for (const key in paramsSpec?.properties ?? {}) {
        const defaultValue = (paramsSpec?.properties?.[key] as WidgetProps['spec'])
          .defaultValue;

        params[key] = values.method.parameters?.[key] ?? defaultValue ?? '';
      }

      return params;
    }, [formik.values.method.name]);

    const updateMethods = useCallback(
      (componentId: string) => {
        if (componentId === GLOBAL_UTILS_ID) {
          setMethods(Array.from(utilMethods.keys()));
        } else {
          const component = components.find(c => c.id === componentId);

          if (component) {
            const methodNames: string[] = findMethodsByComponent(component).map(
              ({ name }) => name
            );

            setMethods(methodNames);
          }
        }
      },
      [components, registry]
    );

    useEffect(() => {
      formik.setValues(value);
    }, [value]);

    useEffect(() => {
      formik.setFieldValue('method.parameters', params);
    }, [params]);

    useEffect(() => {
      if (value.componentId) {
        updateMethods(value.componentId);
      }
    }, [value, updateMethods]);

    const onTargetComponentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateMethods(e.target.value);
      formik.handleChange(e);
      formik.setFieldValue('method', { name: '', parameters: {} });
    };

    const typeField = (
      <FormControl>
        <FormLabel>Event Type</FormLabel>
        <Select
          name="type"
          onBlur={() => formik.submitForm()}
          onChange={formik.handleChange}
          placeholder="Select Event Type"
          value={formik.values.type}
        >
          {eventTypes.map(e => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </Select>
      </FormControl>
    );
    const targetField = (
      <FormControl>
        <FormLabel>Target Component</FormLabel>
        <Select
          name="componentId"
          onBlur={() => formik.submitForm()}
          onChange={onTargetComponentChange}
          placeholder="Select Target Component"
          value={formik.values.componentId}
        >
          {[{ id: GLOBAL_UTILS_ID }].concat(components).map(c => (
            <option key={c.id} value={c.id}>
              {c.id}
            </option>
          ))}
        </Select>
      </FormControl>
    );
    const methodField = (
      <FormControl>
        <FormLabel>Method</FormLabel>
        <Select
          name="method.name"
          onBlur={() => formik.submitForm()}
          onChange={formik.handleChange}
          placeholder="Select Method"
          value={formik.values.method.name}
        >
          {methods.map(m => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Select>
      </FormControl>
    );

    const parametersField = (
      <FormControl>
        <FormLabel>Parameters</FormLabel>
        <RecordWidget
          component={component}
          path={path.concat('method', 'parameters')}
          level={level + 1}
          spec={mergeWidgetOptionsIntoSpec(paramsSpec, { onlySetValue: true })}
          services={services}
          value={formik.values.method.parameters}
          onChange={json => {
            formik.setFieldValue('method.parameters', json);
            formik.submitForm();
          }}
        />
      </FormControl>
    );

    const waitTypeField = (
      <FormControl>
        <FormLabel>Wait Type</FormLabel>
        <Select
          name="wait.type"
          onBlur={() => formik.submitForm()}
          onChange={formik.handleChange}
          value={formik.values.wait?.type}
        >
          <option value="delay">delay</option>
          <option value="debounce">debounce</option>
          <option value="throttle">throttle</option>
        </Select>
      </FormControl>
    );

    const waitTimeField = (
      <FormControl>
        <FormLabel>Wait Time</FormLabel>
        <Input
          name="wait.time"
          onBlur={() => formik.submitForm()}
          onChange={formik.handleChange}
          value={formik.values.wait?.time}
        />
      </FormControl>
    );

    const disabledField = (
      <FormControl>
        <FormLabel>Disabled</FormLabel>
        <SpecWidget
          {...props}
          spec={Type.Boolean({ widgetOptions: { isShowAsideExpressionButton: true } })}
          level={level + 1}
          path={['disabled']}
          value={formik.values.disabled}
          onChange={value => {
            formik.setFieldValue('disabled', value);
            formik.submitForm();
          }}
        />
      </FormControl>
    );

    return (
      <>
        {spec.properties?.type ? typeField : null}
        {targetField}
        {methodField}
        {hasParams ? parametersField : null}
        {waitTypeField}
        {waitTimeField}
        {disabledField}
      </>
    );
  }
);

export default implementWidget<EventWidgetOptionsType>({
  version: 'core/v1',
  metadata: {
    name: 'event',
  },
})(EventWidget);
