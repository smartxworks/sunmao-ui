import React from 'react';
import { Box } from '@chakra-ui/react';
import { KeyValueEditor } from '../../KeyValueEditor';
import { FormikHelpers, FormikHandlers, FormikState } from 'formik';
import { FetchTraitPropertiesSchema } from '@sunmao-ui/runtime';
import { Static } from '@sinclair/typebox';

type Values = Static<typeof FetchTraitPropertiesSchema>;
interface Props {
  formik: FormikHelpers<Values> & FormikHandlers & FormikState<Values>;
}

export const Body: React.FC<Props> = props => {
  const { formik } = props;
  const { values } = formik;

  const onChange = (value: Record<string, unknown>) => {
    formik.setFieldValue('body', value);
    formik.submitForm();
  };

  return (
    <Box>
      <KeyValueEditor
        value={values.body}
        onChange={onChange}
        minNum={1}
        isShowHeader
      />
    </Box>
  );
};
