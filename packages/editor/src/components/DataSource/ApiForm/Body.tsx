import React from 'react';
import { Box, Select, Text, VStack } from '@chakra-ui/react';
import {
  KeyValueWidget,
  WidgetProps,
  mergeWidgetOptionsIntoSchema,
} from '@sunmao-ui/editor-sdk';
import { FormikHelpers, FormikHandlers, FormikState } from 'formik';
import { FetchTraitPropertiesSchema } from '@sunmao-ui/runtime';
import { ComponentSchema } from '@sunmao-ui/core';
import { Static } from '@sinclair/typebox';
import { EditorServices } from '../../../types';

type Values = Static<typeof FetchTraitPropertiesSchema>;
interface Props {
  api: ComponentSchema;
  schema: WidgetProps['schema'];
  formik: FormikHelpers<Values> & FormikHandlers & FormikState<Values>;
  services: EditorServices;
}

export const Body: React.FC<Props> = props => {
  const { api, schema, formik, services } = props;
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
      <Text fontSize="lg" fontWeight="bold">
        Body
      </Text>
      <Box width="full">
        <KeyValueWidget
          component={api}
          schema={mergeWidgetOptionsIntoSchema(schema, {
            minNum: 1,
            isShowHeader: true,
          })}
          level={1}
          value={values.body}
          services={services}
          onChange={onChange}
        />
      </Box>
    </VStack>
  );
};
