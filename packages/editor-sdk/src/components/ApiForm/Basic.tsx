import React, { useCallback } from 'react';
import { VStack, FormControl, FormLabel, Switch } from '@chakra-ui/react';
import { FormikHelpers, FormikHandlers, FormikState } from 'formik';
import { FetchTraitPropertiesSpec } from '@sunmao-ui/runtime';
import { Static, Type } from '@sinclair/typebox';
import { ComponentSchema } from '@sunmao-ui/core';
import { JSONSchema7 } from 'json-schema';
import { EditorServicesInterface } from '../../types/editor';
import { mergeWidgetOptionsIntoSpec } from '../..';
import { SpecWidget } from '../Widgets';

type Values = Static<typeof FetchTraitPropertiesSpec>;
interface Props {
  api: ComponentSchema;
  formik: FormikHelpers<Values> & FormikHandlers & FormikState<Values>;
  services: EditorServicesInterface;
}

const DisabledSpec = Type.Boolean({
  widget: 'core/v1/boolean',
  widgetOptions: { isShowAsideExpressionButton: true },
});

const EmptyArray: string[] = [];

export const Basic: React.FC<Props> = props => {
  const { formik, api, services } = props;

  const onDisabledChange = useCallback(
    val => {
      formik.setFieldValue('disabled', val);
      formik.handleSubmit();
    },
    [formik]
  );

  const onCompleteHandlersChange = useCallback(
    newHandlers => {
      formik.setFieldValue('onComplete', newHandlers);
      formik.submitForm();
    },
    [formik]
  );
  const onErrorHandlersChange = useCallback(
    newHandlers => {
      formik.setFieldValue('onError', newHandlers);
      formik.submitForm();
    },
    [formik]
  );

  return (
    <VStack spacing="5" alignItems="stretch">
      <FormControl display="flex" alignItems="center">
        <FormLabel margin="0" marginRight="2">
          Lazy
        </FormLabel>
        <Switch
          name="lazy"
          isChecked={formik.values.lazy}
          onChange={formik.handleChange}
          onBlur={() => formik.handleSubmit()}
        />
      </FormControl>
      <FormControl display="flex" alignItems="center">
        <FormLabel margin="0" marginRight="2">
          Disabled
        </FormLabel>
        <SpecWidget
          component={api}
          spec={DisabledSpec}
          value={formik.values.disabled}
          path={EmptyArray}
          level={1}
          services={services}
          onChange={onDisabledChange}
        />
      </FormControl>
      <FormControl>
        <FormLabel>OnComplete</FormLabel>
        <SpecWidget
          component={api}
          services={services}
          spec={mergeWidgetOptionsIntoSpec<'core/v1/array'>(
            FetchTraitPropertiesSpec.properties.onComplete as JSONSchema7,
            {
              displayedKeys: ['componentId', 'method.name', 'method.parameters'],
              appendToParent: true,
            }
          )}
          level={1}
          path={['onComplete']}
          value={formik.values.onComplete}
          onChange={onCompleteHandlersChange}
        />
      </FormControl>
      <FormControl>
        <FormLabel>OnError</FormLabel>
        <SpecWidget
          component={api}
          services={services}
          spec={mergeWidgetOptionsIntoSpec<'core/v1/array'>(
            FetchTraitPropertiesSpec.properties.onError as JSONSchema7,
            {
              displayedKeys: ['componentId', 'method.name', 'method.parameters'],
              appendToParent: true,
            }
          )}
          level={1}
          path={['onError']}
          value={formik.values.onError}
          onChange={onErrorHandlersChange}
        />
      </FormControl>
    </VStack>
  );
};
