import React from 'react';
import { Box } from '@chakra-ui/react';
import { KeyValueWidget } from '../../widgets/KeyValueWidget';
import { FormikHelpers, FormikHandlers, FormikState } from 'formik';
import { FetchTraitPropertiesSchema } from '@sunmao-ui/runtime';
import { ComponentSchema } from '@sunmao-ui/core';
import { Static } from '@sinclair/typebox';
import { EditorServices, WidgetProps } from '../../../types';
import { mergeWidgetOptionsIntoSchema } from '../../../utils/widget';

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

  return (
    <Box>
      <KeyValueWidget
        component={api}
        schema={mergeWidgetOptionsIntoSchema(schema, {
          minNum: 1,
          isShowHeader: true
        })}
        level={1}
        value={values.body}
        services={services}
        onChange={onChange}
      />
    </Box>
  );
};
