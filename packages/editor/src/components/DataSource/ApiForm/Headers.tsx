import React from 'react';
import { Box } from '@chakra-ui/react';
import { KeyValueEditor } from '../../KeyValueEditor';
import { FormikHelpers, FormikHandlers, FormikState } from 'formik';
import { FetchTraitPropertiesSchema } from '@sunmao-ui/runtime';
import { Static } from '@sinclair/typebox';
import { EditorServices } from '../../../types';

type Values = Static<typeof FetchTraitPropertiesSchema>;
interface Props {
  formik: FormikHelpers<Values> & FormikHandlers & FormikState<Values>;
  services: EditorServices;
}

export const Headers: React.FC<Props> = props => {
  const { formik, services } = props;
  const { registry, stateManager } = services;
  const { values } = formik;

  const onChange = (value: Record<string, unknown>) => {
    formik.setFieldValue('headers', value);
    formik.submitForm();
  };

  return (
    <Box>
      <KeyValueEditor
        registry={registry}
        stateManager={stateManager}
        value={values.headers}
        onChange={onChange}
        minNum={1}
        isShowHeader
      />
    </Box>
  );
};
