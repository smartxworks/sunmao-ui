import React from 'react';
import { Box, Select, Text, VStack } from '@chakra-ui/react';
import {
  SpecWidget,
  WidgetProps,
  mergeWidgetOptionsIntoSpec,
} from '@sunmao-ui/editor-sdk';
import { FormikHelpers, FormikHandlers, FormikState } from 'formik';
import { FetchTraitPropertiesSpec } from '@sunmao-ui/runtime';
import { ComponentSchema } from '@sunmao-ui/core';
import { Static } from '@sinclair/typebox';
import { EditorServices } from '../../../types';

type Values = Static<typeof FetchTraitPropertiesSpec>;
interface Props {
  api: ComponentSchema;
  spec: WidgetProps['spec'];
  formik: FormikHelpers<Values> & FormikHandlers & FormikState<Values>;
  services: EditorServices;
}

export const Body: React.FC<Props> = props => {
  const { api, spec, formik, services } = props;
  const { values } = formik;

  const onChange = (value: Record<string, unknown>) => {
    formik.setFieldValue('body', value);
    formik.submitForm();
  };

  const onBodyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    formik.setFieldValue('bodyType', e.target.value);
    formik.submitForm();
  };

  return (
    <VStack alignItems="start">
      <Text fontSize="lg" fontWeight="bold">
        BodyType
      </Text>
      <Select value={values.bodyType} onChange={onBodyTypeChange}>
        <option value="json">JSON</option>
        <option value="formData">Form Data</option>
      </Select>

      <Box width="full">
        <SpecWidget
          component={api}
          spec={mergeWidgetOptionsIntoSpec(spec, {
            minNum: 1,
            isShowHeader: true,
          })}
          path={[]}
          level={1}
          value={values.body}
          services={services}
          onChange={onChange}
        >
          {{
            title: (
              <Text fontSize="lg" fontWeight="bold" display="inline">
                Body
              </Text>
            ),
          }}
        </SpecWidget>
      </Box>
    </VStack>
  );
};
