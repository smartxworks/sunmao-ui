import React, { useCallback, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { FormikHelpers, FormikHandlers, FormikState } from 'formik';
import { Type, Static } from '@sinclair/typebox';
import { FetchTraitPropertiesSpec } from '@sunmao-ui/runtime';
import { ComponentSchema } from '@sunmao-ui/core';
import { EditorServicesInterface } from '../../types/editor';
import { RecordWidget } from '../Widgets';
import { mergeWidgetOptionsIntoSpec } from '../..';

type Values = Static<typeof FetchTraitPropertiesSpec>;
interface Props {
  api: ComponentSchema;
  formik: FormikHelpers<Values> & FormikHandlers & FormikState<Values>;
  services: EditorServicesInterface;
}

const EMPTY_ARRAY: string[] = [];

export const Params: React.FC<Props> = props => {
  const { api, formik, services } = props;
  const url: string = useMemo(() => formik.values.url ?? '', [formik.values.url]);
  const index = useMemo(() => url.indexOf('?'), [url]);
  const specWithWidgetOptions = useMemo(
    () =>
      mergeWidgetOptionsIntoSpec<'core/v1/spec' | 'core/v1/record' | any>(
        Type.Record(Type.String(), Type.String()),
        { minNum: 1, isShowHeader: true }
      ),
    []
  );
  const params = useMemo(() => {
    if (index === -1) {
      return {};
    } else {
      const parameters = new URLSearchParams(url.slice(index + 1));

      return Array.from(parameters.keys()).reduce((result, key) => {
        result[key] = parameters.get(key) ?? '';

        return result;
      }, {} as Record<string, string>);
    }
  }, [url, index]);

  const onChange = useCallback(
    (values: Record<string, string>) => {
      const parameters = new URLSearchParams(values);
      const paramsString = decodeURIComponent(parameters.toString());
      const newUrl =
        index === -1
          ? `${url}?${paramsString}`
          : formik.values.url.replace(/\?[\S]+/, `?${paramsString}`);

      formik.setFieldValue('url', newUrl);
      formik.submitForm();
    },
    [formik, url, index]
  );

  return (
    <Box>
      <RecordWidget
        component={api}
        spec={specWithWidgetOptions}
        path={EMPTY_ARRAY}
        level={1}
        services={services}
        value={params}
        onChange={onChange}
      />
    </Box>
  );
};
