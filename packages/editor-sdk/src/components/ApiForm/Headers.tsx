import React, { useCallback, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { FormikHelpers, FormikHandlers, FormikState } from 'formik';
import { FetchTraitPropertiesSpec } from '@sunmao-ui/runtime';
import { ComponentSchema } from '@sunmao-ui/core';
import { Static } from '@sinclair/typebox';
import { EditorServicesInterface } from '../../types/editor';
import { mergeWidgetOptionsIntoSpec, WidgetProps } from '../..';
import { RecordWidget } from '../Widgets';

type Values = Static<typeof FetchTraitPropertiesSpec>;
interface Props {
  api: ComponentSchema;
  spec: WidgetProps['spec'];
  formik: FormikHelpers<Values> & FormikHandlers & FormikState<Values>;
  services: EditorServicesInterface;
}

const EMPTY_ARRAY: string[] = [];

export const Headers: React.FC<Props> = props => {
  const { api, spec, formik, services } = props;
  const { values } = formik;
  const specWithWidgetOptions = useMemo(
    () =>
      mergeWidgetOptionsIntoSpec<'core/v1/spec' | 'core/v1/record' | any>(spec, {
        minNum: 1,
        isShowHeader: true,
      }),
    [spec]
  );

  const onChange = useCallback(
    (value: Record<string, unknown>) => {
      formik.setFieldValue('headers', value);
      formik.submitForm();
    },
    [formik]
  );

  return (
    <Box>
      <RecordWidget
        component={api}
        spec={specWithWidgetOptions}
        path={EMPTY_ARRAY}
        level={1}
        services={services}
        value={values.headers}
        onChange={onChange}
      />
    </Box>
  );
};
