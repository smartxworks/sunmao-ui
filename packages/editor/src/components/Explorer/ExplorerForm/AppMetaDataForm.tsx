import React from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  VStack,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { observer } from 'mobx-react-lite';
import { EditorServices } from '../../../types';

export type AppMetaDataFormData = {
  name: string;
  version: string;
};

type AppMetaDataFormProps = {
  data: AppMetaDataFormData;
  services: EditorServices;
  onSubmit?: (data: AppMetaDataFormData) => void;
};

export const AppMetaDataForm: React.FC<AppMetaDataFormProps> = observer(
  ({ data, services, onSubmit: onSubmitForm }) => {
    const { editorStore } = services;
    const onSubmit = (value: AppMetaDataFormData) => {
      editorStore.appStorage.saveAppMetaData(value);
      onSubmitForm?.(value);
    };
    const formik = useFormik({
      initialValues: data,
      onSubmit,
    });

    const isAppVersionError = formik.values.version === '';
    const isAppNameError = formik.values.name === '';
    return (
      <VStack w="full" spacing="5">
        <HStack w="full" align="normal">
          <FormControl isInvalid={isAppVersionError}>
            <HStack align="normal">
              <FormLabel>Version</FormLabel>
              <VStack w="full" align="normal">
                <Input
                  name="version"
                  value={formik.values.version}
                  onChange={formik.handleChange}
                  onBlur={() => {
                    if (formik.values.version && formik.values.name) {
                      formik.submitForm();
                    }
                  }}
                />
                {isAppVersionError && (
                  <FormErrorMessage>
                    Application version can not be empty
                  </FormErrorMessage>
                )}
              </VStack>
            </HStack>
          </FormControl>
          <FormControl isInvalid={isAppNameError}>
            <HStack align="normal">
              <FormLabel>Name</FormLabel>
              <VStack w="full" align="normal">
                <Input
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={() => {
                    if (formik.values.version && formik.values.name) {
                      formik.submitForm();
                    }
                  }}
                />
                {isAppNameError && (
                  <FormErrorMessage>Application name can not be empty</FormErrorMessage>
                )}
              </VStack>
            </HStack>
          </FormControl>
        </HStack>
      </VStack>
    );
  }
);
