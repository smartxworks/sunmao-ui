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
import { JSONSchema7, JSONSchema7Object, JSONSchema7Type } from 'json-schema';

function parseSpec(spec: JSONSchema7): JSONSchema7Type {
  switch (true) {
    case spec.type === 'string':
      if (spec.enum && spec.enum.length > 0) {
        return spec.enum[0];
      } else {
        return '';
      }
    case spec.type === 'boolean':
      return false;
    case spec.type === 'array':
      return [];
    case spec.type === 'number':
    case spec.type === 'integer':
      return 0;
    case spec.type === 'object': {
      const obj: JSONSchema7Type = {};
      for (const key in spec.properties) {
        const subSpec = spec.properties[key];
        if (typeof subSpec === 'boolean') return null;
        obj[key] = parseSpec(subSpec);
      }
      return obj;
    }
    case spec.anyOf && spec.anyOf!.length > 0:
    case spec.oneOf && spec.oneOf.length > 0: {
      const subSpec = (spec.anyOf! || spec.oneOf)[0];
      if (typeof subSpec === 'boolean') return null;
      return parseSpec(subSpec);
    }
    case !spec.type:
      return undefined as unknown as JSONSchema7Type;
    default:
      return {};
  }
}

export type ModuleMetaDataFormData = {
  name: string;
  version: string;
  stateMap: Record<string, string>;
  properties: Record<string, any>;
  rawSpec: JSONSchema7;
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
      editorStore.setModuleDependencies(value.properties);
      onSubmitForm?.(value);
    };

    const formik = useFormik({
      initialValues: initData,
      onSubmit,
    });

    const moduleRawSpec = formik.values.rawSpec || {};

    const moduleProperties = {
      ...(parseSpec(moduleRawSpec) as JSONSchema7Object),
      ...formik.values.properties,
    };

    const moduleSpecs = (moduleRawSpec.properties || {}) as Record<string, JSONSchema7>;

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
                      data={moduleRawSpec}
                      onSchemaChange={s => {
                        const curSpec = JSON.parse(s);
                        if (
                          s === JSON.stringify(moduleRawSpec) ||
                          curSpec.type === 'array'
                        )
                          return;

                        formik.setFieldValue('rawSpec', curSpec);
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
                  formik.setFieldValue('properties', {
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
