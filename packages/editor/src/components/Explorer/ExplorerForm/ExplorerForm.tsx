import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, ButtonGroup, Spacer, VStack } from '@chakra-ui/react';
import { AppMetaDataForm, AppMetaDataFormData } from './AppMetaDataForm';
import { ModuleMetaDataForm, ModuleMetaDataFormData } from './ModuleMetaDataForm';
import { EditorServices } from '../../../types';
import { Type } from '@sinclair/typebox';
import { cloneDeep } from 'lodash';
import { json2JsonSchema } from '@sunmao-ui/editor-sdk';

type Props = {
  formType: 'app' | 'module';
  version: string;
  name: string;
  setCurrentVersion?: (version: string) => void;
  setCurrentName?: (name: string) => void;
  services: EditorServices;
  onClose: () => void;
};

export const ExplorerForm: React.FC<Props> = observer(
  ({ formType, version, name, setCurrentVersion, setCurrentName, services, onClose }) => {
    const { editorStore } = services;
    const newModuleMetaDataRef = useRef<ModuleMetaDataFormData | undefined>();
    const newAppMetaDataRef = useRef<AppMetaDataFormData | undefined>();
    const onModuleMetaDataChange = (value: ModuleMetaDataFormData) => {
      newModuleMetaDataRef.current = value;
    };
    const onAppMetaDataChange = (value: AppMetaDataFormData) => {
      newAppMetaDataRef.current = value;
    };
    const saveModuleMetaData = () => {
      if (!newModuleMetaDataRef.current) return;
      const propertiesSpec = json2JsonSchema(
        services.stateManager.deepEval(newModuleMetaDataRef.current.exampleProperties)
      );
      editorStore.appStorage.saveModuleMetaData(
        { originName: name, originVersion: version },
        { ...newModuleMetaDataRef.current, properties: propertiesSpec }
      );
      editorStore.setModuleDependencies(newModuleMetaDataRef.current.exampleProperties);
      setCurrentVersion?.(newModuleMetaDataRef.current.version);
      setCurrentName?.(newModuleMetaDataRef.current.name);
    };
    const saveAppMetaData = () => {
      if (!newAppMetaDataRef.current) return;
      editorStore.appStorage.saveAppMetaData(newAppMetaDataRef.current);
      setCurrentVersion?.(newAppMetaDataRef.current.version);
      setCurrentName?.(newAppMetaDataRef.current.name);
    };

    const onSave = () => {
      switch (formType) {
        case 'app':
          saveAppMetaData();
          break;
        case 'module':
          saveModuleMetaData();
          break;
      }
      onClose();
    };

    let form;
    switch (formType) {
      case 'app':
        const appMetaData = {
          name,
          version,
        };
        form = (
          <AppMetaDataForm
            data={appMetaData}
            services={services}
            onSubmit={onAppMetaDataChange}
          />
        );
        break;
      case 'module':
        // Don't get from registry, because module from registry has __$moduleId
        const moduleSpec = editorStore.appStorage.modules.find(
          m => m.version === version && m.metadata.name === name
        )!;

        const moduleMetaData = cloneDeep({
          name,
          version,
          stateMap: moduleSpec?.spec.stateMap || {},
          properties: moduleSpec?.spec.properties || Type.Object({}),
          exampleProperties: moduleSpec?.metadata.exampleProperties || {},
          events: moduleSpec?.spec.events || [],
          methods: moduleSpec?.spec.methods || [],
        });
        form = (
          <ModuleMetaDataForm
            services={services}
            initData={moduleMetaData}
            onSubmit={onModuleMetaDataChange}
          />
        );
        break;
    }

    return (
      <VStack h="full" w="full" alignItems="end">
        {form}
        <Spacer />
        <ButtonGroup flex="0 0">
          <Button variant="outline" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={() => onSave()}>
            Save
          </Button>
        </ButtonGroup>
      </VStack>
    );
  }
);
