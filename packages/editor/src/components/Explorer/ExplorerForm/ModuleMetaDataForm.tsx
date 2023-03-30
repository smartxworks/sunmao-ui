import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  IconButton,
  HStack,
  FormErrorMessage,
} from '@chakra-ui/react';
import { RecordEditor } from '@sunmao-ui/editor-sdk';
import { ModuleMethodSpec } from '@sunmao-ui/core';
import { useFormik } from 'formik';
import { observer } from 'mobx-react-lite';
import { EditorServices } from '../../../types';
import { JSONSchema7Object } from 'json-schema';
import { CloseIcon } from '@chakra-ui/icons';
import produce from 'immer';
import { CodeEditor } from '../../CodeEditor';
import { css } from '@emotion/css';

export type ModuleMetaDataFormData = {
  name: string;
  version: string;
  stateMap: Record<string, string>;
  events: string[];
  methods: ModuleMethodSpec[];
  exampleProperties: JSONSchema7Object;
};

type ModuleMetaDataFormProps = {
  initData: ModuleMetaDataFormData;
  services: EditorServices;
  onSubmit?: (value: ModuleMetaDataFormData) => void;
  disabled?: boolean;
};

const genEventsName = (events: string[]) => {
  let count = events.length;
  let name = `event${count}`;

  while (events.includes(name)) {
    name = `event${++count}`;
  }

  return `event${count}`;
};

const EventInput: React.FC<{
  name: string;
  events: string[];
  index: number;
  onChange: (value: string) => void;
}> = ({ name: defaultName, onChange, events, index }) => {
  const [name, setName] = useState(defaultName);
  const [isRepeated, setIsRepeated] = useState(false);

  useEffect(() => {
    setName(defaultName);
  }, [defaultName]);

  return (
    <FormControl w="33.33%" isInvalid={isRepeated}>
      <Input
        name="name"
        onChange={e => {
          setName(e.target.value);
        }}
        onBlur={() => {
          const newEvents = [...events];
          newEvents.splice(index, 1);
          if (newEvents.find(eventName => eventName === name)) {
            setIsRepeated(true);
            return;
          }
          setIsRepeated(false);
          onChange(name);
        }}
        value={name}
      />
      <FormErrorMessage mt="0" pl="10px">
        event name already exists
      </FormErrorMessage>
    </FormControl>
  );
};

export const ModuleMetaDataForm: React.FC<ModuleMetaDataFormProps> = observer(
  ({ initData, services, onSubmit: onSubmitForm }) => {
    const onSubmit = (value: ModuleMetaDataFormData) => {
      onSubmitForm?.(value);
    };
    const formik = useFormik({
      initialValues: initData,
      onSubmit,
    });

    const isModuleVersionError = formik.values.version === '';
    const isModuleNameError = formik.values.name === '';
    return (
      <VStack w="full" spacing="5">
        <HStack w="full" align="normal">
          <FormControl isInvalid={isModuleVersionError}>
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
                {isModuleVersionError && (
                  <FormErrorMessage>Module version can not be empty</FormErrorMessage>
                )}
              </VStack>
            </HStack>
          </FormControl>
          <FormControl isInvalid={isModuleNameError}>
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
                {isModuleNameError && (
                  <FormErrorMessage>Module name can not be empty</FormErrorMessage>
                )}
              </VStack>
            </HStack>
          </FormControl>
        </HStack>
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
          <FormLabel>Example Properties</FormLabel>
          <RecordEditor
            services={services}
            value={formik.values.exampleProperties}
            onChange={json => {
              formik.setFieldValue('exampleProperties', json);
              formik.submitForm();
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Events</FormLabel>
          {formik.values.events.map((eventName, i) => {
            return (
              <HStack m="10px 0 10px 0" alignItems="normal" key={eventName}>
                <EventInput
                  events={formik.values.events}
                  index={i}
                  onChange={newName => {
                    const newEvents = produce(formik.values.events, draft => {
                      draft[i] = newName;
                    });
                    formik.setFieldValue('events', newEvents);
                    formik.submitForm();
                  }}
                  name={eventName}
                />
                <IconButton
                  aria-label="remove row"
                  icon={<CloseIcon />}
                  size="xs"
                  onClick={() => {
                    const newEvents = produce(formik.values.events, draft => {
                      draft.splice(i, 1);
                    });
                    formik.setFieldValue('events', newEvents);
                    formik.submitForm();
                  }}
                  variant="ghost"
                />
              </HStack>
            );
          })}
          <Button
            onClick={() => {
              const newEvents = produce(formik.values.events, draft => {
                draft.push(genEventsName(draft));
              });
              formik.setFieldValue('events', newEvents);
              formik.submitForm();
            }}
            size="xs"
            alignSelf="start"
          >
            + Add
          </Button>
        </FormControl>
        <FormControl>
          <FormLabel>Methods</FormLabel>
          <CodeEditor
            className={css`
              width: 100%;
              height: 120px;
            `}
            mode="json"
            defaultCode={JSON.stringify(formik.values.methods)}
            onBlur={v => {
              try {
                const newMethods = JSON.parse(v);
                formik.setFieldValue('methods', newMethods);
                formik.submitForm();
              } catch {}
            }}
            needRerenderAfterMount
          />
        </FormControl>
      </VStack>
    );
  }
);
