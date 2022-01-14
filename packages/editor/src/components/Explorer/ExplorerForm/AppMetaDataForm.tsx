import React from 'react';
import { FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { observer } from 'mobx-react-lite';
import { EditorServices } from '../../../types';

type AppMetaDataFormData = {
  name: string;
  version: string;
};

type AppMetaDataFormProps = {
  data: AppMetaDataFormData;
  services: EditorServices;
};

export const AppMetaDataForm: React.FC<AppMetaDataFormProps> = observer(
  ({ data, services }) => {
    const { editorStore } = services;
    const onSubmit = (value: AppMetaDataFormData) => {
      editorStore.appStorage.saveAppMetaDataInLS(value);
    };
    const formik = useFormik({
      initialValues: data,
      onSubmit,
    });
    return (
      <VStack>
        <FormControl isRequired>
          <FormLabel>App Version</FormLabel>
          <Input
            name="version"
            value={formik.values.version}
            onChange={formik.handleChange}
            onBlur={() => formik.submitForm()}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>App Name</FormLabel>
          <Input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={() => formik.submitForm()}
          />
        </FormControl>
      </VStack>
    );
  }
);
