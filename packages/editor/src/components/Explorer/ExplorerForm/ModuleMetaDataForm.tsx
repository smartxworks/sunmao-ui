import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { RecordEditor, SpecWidget } from '@sunmao-ui/editor-sdk';
import { useFormik } from 'formik';
import { observer } from 'mobx-react-lite';
import { EditorServices } from '../../../types';
import JsonSchemaEditor from '@optum/json-schema-editor';
import { generateDefaultValueFromSpec } from '@sunmao-ui/shared';
import { JSONSchema7, JSONSchema7Object } from 'json-schema';

export type ModuleMetaDataFormData = {
  name: string;
  version: string;
  stateMap: Record<string, string>;
  properties: JSONSchema7;
  exampleProperties: JSONSchema7Object;
};

type ModuleMetaDataFormProps = {
  initData: ModuleMetaDataFormData;
  services: EditorServices;
  onSubmit?: (value: ModuleMetaDataFormData) => void;
};

export const ModuleMetaDataForm: React.FC<ModuleMetaDataFormProps> = observer(
  ({ initData, services, onSubmit: onSubmitForm }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { editorStore } = services;

    const onSubmit = (value: ModuleMetaDataFormData) => {
      editorStore.appStorage.saveModuleMetaData(
        { originName: initData.name, originVersion: initData.version },
        value
      );
      editorStore.setModuleDependencies(value.exampleProperties);
      onSubmitForm?.(value);
    };

    const formik = useFormik({
      initialValues: initData,
      onSubmit,
    });

    const moduleSpec = formik.values.properties;

    const moduleProperties = {
      ...(generateDefaultValueFromSpec(moduleSpec) as JSONSchema7Object),
      ...formik.values.exampleProperties,
    };

    const moduleSpecs = (moduleSpec.properties || {}) as Record<string, JSONSchema7>;

    return (
      <VStack>
        <FormControl isRequired>
          <FormLabel>Module Version</FormLabel>
          <Input
            name="version"
            value={formik.values.version}
            onChange={formik.handleChange}
            onBlur={() => formik.submitForm()}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Module Name</FormLabel>
          <Input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={() => formik.submitForm()}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Module StateMap</FormLabel>
          <RecordEditor
            services={services}
            value={formik.values.stateMap}
            onChange={json => {
              formik.setFieldValue('stateMap', json);
              formik.submitForm();
            }}
          />
        </FormControl>
        <FormControl>
          <Button onClick={onOpen}>Edit Spec</Button>
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="900px"
            closeOnEsc={false}
            trapFocus={false}
          >
            <ModalOverlay />
            <ModalContent w="900px">
              <ModalHeader>Module Spec</ModalHeader>
              <ModalCloseButton />
              <ModalBody overflow="auto">
                {isOpen && (
                  <Box>
                    <JsonSchemaEditor
                      data={moduleSpec}
                      onSchemaChange={s => {
                        const curSpec = JSON.parse(s);
                        if (s === JSON.stringify(moduleSpec) || curSpec.type === 'array')
                          return;

                        formik.setFieldValue('properties', curSpec);
                      }}
                    />
                  </Box>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    onClose();
                    formik.submitForm();
                  }}
                >
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </FormControl>
        <FormControl>
          <FormLabel>Properties</FormLabel>
          {Object.keys(moduleSpecs).map(key => {
            return (
              <SpecWidget
                key={key}
                spec={{ ...moduleSpecs[key], title: moduleSpecs[key].title || key }}
                value={moduleProperties[key]}
                path={[]}
                component={{} as any}
                level={1}
                services={services}
                onChange={newFormData => {
                  formik.setFieldValue('exampleProperties', {
                    ...moduleProperties,
                    [key]: newFormData,
                  });
                  formik.submitForm();
                }}
              />
            );
          })}
        </FormControl>
      </VStack>
    );
  }
);
