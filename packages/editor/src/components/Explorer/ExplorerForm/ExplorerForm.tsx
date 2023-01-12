import React from 'react';
import { observer } from 'mobx-react-lite';
import { VStack } from '@chakra-ui/react';
import { AppMetaDataForm, AppMetaDataFormData } from './AppMetaDataForm';
import { ModuleMetaDataForm, ModuleMetaDataFormData } from './ModuleMetaDataForm';
import { EditorServices } from '../../../types';
import { Type } from '@sinclair/typebox';

type Props = {
  formType: 'app' | 'module';
  version: string;
  name: string;
  setCurrentVersion?: (version: string) => void;
  setCurrentName?: (name: string) => void;
  services: EditorServices;
};

export const ExplorerForm: React.FC<Props> = observer(
  ({ formType, version, name, setCurrentVersion, setCurrentName, services }) => {
    const { editorStore } = services;
    const onSubmit = (value: AppMetaDataFormData | ModuleMetaDataFormData) => {
      setCurrentVersion?.(value.version);
      setCurrentName?.(value.name);
    };
    let form;
    switch (formType) {
      case 'app':
        const appMetaData = {
          name,
          version,
        };
        form = (
          <AppMetaDataForm data={appMetaData} services={services} onSubmit={onSubmit} />
        );
        break;
      case 'module':
        const moduleSpec = editorStore.appStorage.modules.find(
          m => m.version === version && m.metadata.name === name
        )!;
        const moduleMetaData = {
          name,
          version,
          stateMap: moduleSpec?.spec.stateMap || {},
          properties: moduleSpec?.spec.properties || Type.Object({}),
          exampleProperties: moduleSpec?.metadata.exampleProperties || {},
          events: moduleSpec?.spec.events || [],
        };
        form = (
          <ModuleMetaDataForm
            services={services}
            initData={moduleMetaData}
            onSubmit={onSubmit}
          />
        );
        break;
    }
    return (
      <VStack w="full" alignItems="start">
        {form}
      </VStack>
    );
  }
);
