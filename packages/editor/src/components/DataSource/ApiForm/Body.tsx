import React, { useCallback, useMemo } from 'react';
import { Box, Select, Text, VStack } from '@chakra-ui/react';
import {
  SchemaField,
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

const EMPTY_ARRAY: string[] = [];

export const Body: React.FC<Props> = props => {
  const { api, schema, formik, services } = props;
  const { values } = formik;
  const schemaWithWidgetOptions = useMemo(()=> mergeWidgetOptionsIntoSchema(schema, {
    minNum: 1,
    isShowHeader: true,
  }), [schema]);

  const onChange = useCallback((value: Record<string, unknown>) => {
    formik.setFieldValue('body', value);
    formik.submitForm();
  }, [formik]);

  const onBodyTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    formik.setFieldValue('bodyType', e.target.value);
    formik.submitForm();
  }, [formik]);

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
        <SchemaField
          component={api}
          schema={schemaWithWidgetOptions}
          path={EMPTY_ARRAY}
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
        </SchemaField>
      </Box>
    </VStack>
  );
};
