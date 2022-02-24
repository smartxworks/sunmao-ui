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

export const Body: React.FC<Props> = props => {
  const { formik, services } = props;
  const { registry, stateManager } = services;
  const { values } = formik;

  const onChange = (value: Record<string, unknown>) => {
    formik.setFieldValue('body', value);
    formik.submitForm();
  };

  return (
    <Box>
      <KeyValueEditor
        value={values.body}
        registry={registry}
        stateManager={stateManager}
        onChange={onChange}
        minNum={1}
        isShowHeader
      />
    </Box>
  );
};
