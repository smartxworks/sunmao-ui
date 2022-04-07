import React from 'react';
import { Box } from '@chakra-ui/react';
import {
  RecordWidget,
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

export const Headers: React.FC<Props> = props => {
  const { api, spec, formik, services } = props;
  const { values } = formik;

  const onChange = (value: Record<string, unknown>) => {
    formik.setFieldValue('headers', value);
    formik.submitForm();
  };

  return (
    <Box>
      <RecordWidget
        component={api}
        spec={mergeWidgetOptionsIntoSpec(spec, {
          minNum: 1,
          isShowHeader: true,
        })}
        path={[]}
        level={1}
        services={services}
        value={values.headers}
        onChange={onChange}
      />
    </Box>
  );
};
