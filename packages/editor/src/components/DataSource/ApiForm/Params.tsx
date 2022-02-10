import React, { useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { KeyValueEditor } from '../../KeyValueEditor';
import { FormikHelpers, FormikHandlers, FormikState } from 'formik';
import { FetchTraitPropertiesSchema } from '@sunmao-ui/runtime';
import { Static } from '@sinclair/typebox';

type Values = Static<typeof FetchTraitPropertiesSchema>;
interface Props {
  formik: FormikHelpers<Values> & FormikHandlers & FormikState<Values>;
}

export const Params: React.FC<Props> = props => {
  const { formik } = props;
  const url: string = formik.values.url ?? '';
  const index = url.indexOf('?');
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
    const paramsString = parameters.toString().replace(/%7B%7B(.+)%7D%7D/g, '{{$1}}');
    const newUrl =
      index === -1
        ? `${url}?${paramsString}`
        : formik.values.url.replace(/\?[\S]+/, `?${paramsString}`);

    formik.setFieldValue('url', newUrl);
    formik.submitForm();
  };

  return (
    <Box>
      <KeyValueEditor value={params} onChange={onChange} minNum={1} isShowHeader />
    </Box>
  );
};
