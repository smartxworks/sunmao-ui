import React, { useCallback, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { KeyValueWidget, mergeWidgetOptionsIntoSchema } from '@sunmao-ui/editor-sdk';
import { FormikHelpers, FormikHandlers, FormikState } from 'formik';
import { Type, Static } from '@sinclair/typebox';
import { FetchTraitPropertiesSchema } from '@sunmao-ui/runtime';
import { ComponentSchema } from '@sunmao-ui/core';
import { EditorServices } from '../../../types';

type Values = Static<typeof FetchTraitPropertiesSchema>;
interface Props {
  api: ComponentSchema;
  formik: FormikHelpers<Values> & FormikHandlers & FormikState<Values>;
  services: EditorServices;
}

const EMPTY_ARRAY: string[] = [];

export const Params: React.FC<Props> = props => {
  const { api, formik, services } = props;
  const url: string = useMemo(()=> formik.values.url ?? '', [formik.values.url]) ;
  const index = useMemo(()=> url.indexOf('?'), [url]);
  const schemaWithWidgetOptions = useMemo(
    ()=> mergeWidgetOptionsIntoSchema(Type.Record(Type.String(), Type.String()), { minNum: 1, isShowHeader: true }),
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
      const paramsString = parameters.toString().replace(/%7B%7B(.+?)%7D%7D/g, '{{$1}}');
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
      <KeyValueWidget
        component={api}
        schema={schemaWithWidgetOptions}
        path={EMPTY_ARRAY}
        level={1}
        services={services}
        value={params}
        onChange={onChange}
      />
    </Box>
  );
};
