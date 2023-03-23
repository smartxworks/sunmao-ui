import React, { useState, useEffect, useCallback } from 'react';
import { ComponentSchema } from '@sunmao-ui/core';
import { watch, FetchTraitPropertiesSpec } from '@sunmao-ui/runtime';
import { Static, Type } from '@sinclair/typebox';
import {
  Box,
  VStack,
  HStack,
  Text,
  Tabs,
  TabPanels,
  TabPanel,
  TabList,
  Tab,
  Select,
  Button,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { Basic } from './Basic';
import { Headers as HeadersForm } from './Headers';
import { Params } from './Params';
import { Body } from './Body';
import { Response as ResponseInfo } from './Response';
import { EditorServicesInterface } from '../../types/editor';
import { ExpressionWidget } from '../Widgets';
import { WidgetProps } from '../..';

enum TabIndex {
  Basic,
  Headers,
  Params,
  Body,
}
interface Props {
  value: Static<typeof FetchTraitPropertiesSpec>;
  component: ComponentSchema;
  services: EditorServicesInterface;
  onChange: (value: Static<typeof FetchTraitPropertiesSpec>) => void;
}

const METHODS = ['get', 'post', 'put', 'delete', 'patch'];
const EMPTY_ARRAY: string[] = [];

type FetchResultType = {
  data?: unknown;
  code?: number;
  codeText?: string;
  error?: string;
  loading?: boolean;
};

export const ApiForm: React.FC<Props> = props => {
  const { value, onChange, component, services } = props;
  const [tabIndex, setTabIndex] = useState(0);
  const [fetchResult, setFetchResult] = useState<FetchResultType | undefined>();
  const formik = useFormik({
    initialValues: value,
    onSubmit: values => {
      onChange(values);
    },
  });
  const { values } = formik;
  const URLSpec = Type.String({
    widget: 'core/v1/expression',
    widgetOptions: {
      compactOptions: {
        paddingY: '6px',
      },
    },
  });

  const onFetch = useCallback(() => {
    services.apiService.send('uiMethod', {
      componentId: component.id,
      name: 'triggerFetch',
      parameters: {},
      triggerId: component.id,
      eventType: 'fetch',
    });
  }, [services.apiService, component]);
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
    formik.setValues({ ...value });
    // do not add formik into dependencies, otherwise it will cause infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    const stop = watch(
      () => services.stateManager.store[component.id]?.fetch,
      newValue => {
        setFetchResult({ ...newValue });
      }
    );

    return stop;
  }, [component.id, services.stateManager.store]);

  return (
    <VStack
      backgroundColor="#fff"
      padding="4"
      paddingBottom="0"
      align="stretch"
      spacing="4"
      height="100%"
      onKeyDown={onKeyDown}
    >
      <Text
        title={component.id}
        fontSize="lg"
        fontWeight="bold"
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
      >
        {component.id}
      </Text>
      <HStack spacing={1} flex="0 1 auto" alignItems="start">
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
        <Box width="0" flex="1">
          <ExpressionWidget
            component={component}
            spec={URLSpec}
            value={values.url}
            path={EMPTY_ARRAY}
            level={1}
            services={services}
            onChange={onURLChange}
          />
        </Box>
        <Button colorScheme="blue" isLoading={fetchResult?.loading} onClick={onFetch}>
          Run
        </Button>
      </HStack>
      <Tabs
        flex="1 1 0"
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
              <Basic api={component} formik={formik} services={services} />
            </TabPanel>
            <TabPanel>
              <HeadersForm
                api={component}
                spec={FetchTraitPropertiesSpec.properties.headers as WidgetProps['spec']}
                services={services}
                formik={formik}
              />
            </TabPanel>
            <TabPanel>
              <Params api={component} services={services} formik={formik} />
            </TabPanel>
            <TabPanel>
              <Body
                api={component}
                spec={FetchTraitPropertiesSpec.properties.body as WidgetProps['spec']}
                services={services}
                formik={formik}
              />
            </TabPanel>
          </TabPanels>
        </VStack>
      </Tabs>
      <ResponseInfo {...fetchResult} />
    </VStack>
  );
};
