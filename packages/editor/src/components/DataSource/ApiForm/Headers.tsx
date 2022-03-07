import React from 'react';
import { Box } from '@chakra-ui/react';
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

export const Headers: React.FC<Props> = props => {
  const { api, schema, formik, services } = props;
  const { values } = formik;

  const onChange = (value: Record<string, unknown>) => {
    formik.setFieldValue('headers', value);
    formik.submitForm();
  };

  return (
    <Box>
      <KeyValueWidget
        component={api}
        schema={mergeWidgetOptionsIntoSchema(schema, {
          minNum: 1,
          isShowHeader: true,
        })}
        level={1}
        services={services}
        value={values.headers}
        onChange={onChange}
      />
    </Box>
  );
};
