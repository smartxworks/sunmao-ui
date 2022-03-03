import React, { useMemo } from 'react';
import { Box, KeyValueWidget, mergeWidgetOptionsIntoSchema } from '@sunmao-ui/editor-sdk';
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

export const Params: React.FC<Props> = props => {
  const { api, formik, services } = props;
  const url: string = formik.values.url ?? '';
  const index = url.indexOf('?');
  const schema = Type.Record(Type.String(), Type.String());
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
  }, [formik.values.url]);

  const onChange = (values: Record<string, string>) => {
    const parameters = new URLSearchParams(values);
    const paramsString = parameters.toString().replace(/%7B%7B(.+?)%7D%7D/g, '{{$1}}');
    const newUrl =
      index === -1
        ? `${url}?${paramsString}`
        : formik.values.url.replace(/\?[\S]+/, `?${paramsString}`);

    formik.setFieldValue('url', newUrl);
    formik.submitForm();
  };

  return (
    <Box>
      <KeyValueWidget
        component={api}
        schema={mergeWidgetOptionsIntoSchema(schema, { minNum: 1, isShowHeader: true })}
        level={1}
        services={services}
        value={params}
        onChange={onChange}
      />
    </Box>
  );
};
