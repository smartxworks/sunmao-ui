import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ComponentSchema } from '@sunmao-ui/core';
import { FetchTraitPropertiesSchema, watch } from '@sunmao-ui/runtime';
import { Static, Type } from '@sinclair/typebox';
import {
  Box,
  VStack,
  HStack,
  IconButton,
  Text,
  Tabs,
  TabPanels,
  TabPanel,
  TabList,
  Tab,
  Select,
  Input,
  Button,
  CloseButton,
} from '@chakra-ui/react';
import { ExpressionWidget, WidgetProps } from '@sunmao-ui/editor-sdk';
import { EditIcon } from '@chakra-ui/icons';
import { useFormik } from 'formik';
import { Basic } from './Basic';
import { Headers as HeadersForm } from './Headers';
import { Params } from './Params';
import { Body } from './Body';
import { Response as ResponseInfo } from './Response';
import { EditorServices } from '../../../types';
import { genOperation } from '../../../operations';

enum TabIndex {
  Basic,
  Headers,
  Params,
  Body,
}
interface Props {
  api: ComponentSchema;
  services: EditorServices;
  store: Record<string, any>;
  className: string;
}

const METHODS = ['get', 'post', 'put', 'delete', 'patch'];

export const ApiForm: React.FC<Props> = props => {
  const { api, services, store, className } = props;
  const { editorStore } = services;
  const [reactiveStore, setReactiveStore] = useState<Record<string, any>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(api.id);
  const [tabIndex, setTabIndex] = useState(0);
  const { registry, eventBus } = services;
  const result = useMemo(() => {
    return reactiveStore[api.id]?.fetch ?? {};
  }, [api.id, reactiveStore]);
  const traitIndex = useMemo(
    () => api.traits.findIndex(({ type }) => type === 'core/v1/fetch'),
    [api.traits]
  );
  const trait = useMemo(() => api.traits[traitIndex], [api.traits, traitIndex]);
  const compactOptions = useMemo(
    () => ({
      height: '40px',
      paddingY: '6px',
    }),
    []
  );
  const formik = useFormik({
    initialValues: {
      ...(trait?.properties as Static<typeof FetchTraitPropertiesSchema>),
    },
    onSubmit: values => {
      eventBus.send(
        'operation',
        genOperation(registry, 'modifyTraitProperty', {
          componentId: api.id,
          traitIndex: traitIndex,
          properties: values,
        })
      );
    },
  });
  const { values } = formik;
  const URLSchema = Type.String({ widgetOptions: { compactOptions } });

  const onFetch = useCallback(async () => {
    services.apiService.send('uiMethod', {
      componentId: api.id,
      name: 'triggerFetch',
      parameters: {},
    });
  }, [services.apiService, api]);
  const onNameInputBlur = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value) {
        if (value !== api.id) {
          editorStore.changeDataSourceName(api, value);
        }
        setIsEditing(false);
      }
    },
    [api, editorStore]
  );
  const onMethodChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      formik.handleChange(e);
      formik.handleSubmit();
      if (e.target.value === 'get' && tabIndex === TabIndex.Body) {
        setTabIndex(0);
      }
    },
    [formik, tabIndex]
  );
  const onURLChange = useCallback(
    (value: string) => {
      formik.setFieldValue('url', value);
      formik.handleSubmit();
    },
    [formik]
  );
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    // prevent form keyboard events to accidentally trigger operation shortcut
    e.stopPropagation();
  }, []);

  useEffect(() => {
    formik.setValues({
      ...(trait?.properties as Static<typeof FetchTraitPropertiesSchema>),
    });
    setTabIndex(0);
  }, [trait.properties]);
  useEffect(() => {
    if (api.id) {
      setName(api.id);
    }
  }, [api.id]);
  useEffect(() => {
    const stop = watch(store, newValue => {
      setReactiveStore({ ...newValue });
    });

    return stop;
  }, [store]);

  return (
    <VStack
      className={className}
      backgroundColor="#fff"
      padding="4"
      paddingBottom="0"
      align="stretch"
      spacing="4"
      onKeyDown={onKeyDown}
    >
      <HStack
        alignItems="center"
        justifyContent="space-between"
        maxWidth="100%"
        spacing={46}
      >
        {isEditing ? (
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={onNameInputBlur}
            autoFocus
          />
        ) : (
          <HStack alignItems="center" flex="1" overflow="hidden">
            <Text
              title={api.id}
              fontSize="lg"
              fontWeight="bold"
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
            >
              {api.id}
            </Text>
            <IconButton
              icon={<EditIcon />}
              aria-label="edit"
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
            />
          </HStack>
        )}
        <CloseButton
          onClick={() => {
            editorStore.setActiveDataSource(null);
            editorStore.setActiveDataSourceType(null);
          }}
        />
      </HStack>
      <HStack display="flex" spacing={4}>
        <HStack display="flex" spacing={1} flex={1} alignItems="stretch">
          <Select
            width={200}
            name="method"
            value={values.method}
            onChange={onMethodChange}
            size="md"
          >
            {METHODS.map(method => (
              <option key={method} value={method}>
                {method.toLocaleUpperCase()}
              </option>
            ))}
          </Select>
          <Box flex={1}>
            <ExpressionWidget
              component={api}
              schema={URLSchema}
              value={values.url}
              path={[]}
              level={1}
              services={services}
              onChange={onURLChange}
            />
          </Box>
        </HStack>
        <Button colorScheme="blue" isLoading={result.loading} onClick={onFetch}>
          Run
        </Button>
      </HStack>
      <Tabs
        flex={1}
        overflow="hidden"
        index={tabIndex}
        onChange={index => {
          setTabIndex(index);
        }}
      >
        <VStack height="100%" alignItems="stretch">
          <TabList>
            <Tab>Basic</Tab>
            <Tab>Headers</Tab>
            <Tab>Params</Tab>
            {values.method !== 'get' ? <Tab>Body</Tab> : null}
          </TabList>
          <TabPanels flex={1} overflow="auto">
            <TabPanel>
              <Basic api={api} formik={formik} services={services} />
            </TabPanel>
            <TabPanel>
              <HeadersForm
                api={api}
                schema={
                  FetchTraitPropertiesSchema.properties.headers as WidgetProps['schema']
                }
                services={services}
                formik={formik}
              />
            </TabPanel>
            <TabPanel>
              <Params api={api} services={services} formik={formik} />
            </TabPanel>
            <TabPanel>
              <Body
                api={api}
                schema={
                  FetchTraitPropertiesSchema.properties.body as WidgetProps['schema']
                }
                services={services}
                formik={formik}
              />
            </TabPanel>
          </TabPanels>
        </VStack>
      </Tabs>
      <ResponseInfo data={result.data} error={result.error} loading={result.loading} />
    </VStack>
  );
};
