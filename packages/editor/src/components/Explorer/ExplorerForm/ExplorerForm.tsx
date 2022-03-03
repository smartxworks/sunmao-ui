import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Text, VStack } from '@sunmao-ui/editor-sdk';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { AppMetaDataForm, AppMetaDataFormData } from './AppMetaDataForm';
import { ModuleMetaDataForm, ModuleMetaDataFormData } from './ModuleMetaDataForm';
import { EditorServices } from '../../../types';

type Props = {
  formType: 'app' | 'module';
  version: string;
  name: string;
  setCurrentVersion?: (version: string) => void;
  setCurrentName?: (name: string) => void;
  onBack: () => void;
  services: EditorServices;
};

export const ExplorerForm: React.FC<Props> = observer(
  ({ formType, version, name, setCurrentVersion, setCurrentName, onBack, services }) => {
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
        form = <AppMetaDataForm data={appMetaData} services={services} onSubmit={onSubmit} />;
        break;
      case 'module':
        const moduleSpec = editorStore.appStorage.modules.find(
          m => m.version === version && m.metadata.name === name
        )!;
        const moduleMetaData = {
          name,
          version,
          stateMap: moduleSpec?.spec.stateMap || {},
        };
        form = <ModuleMetaDataForm services={services} initData={moduleMetaData} onSubmit={onSubmit} />;
        break;
    }
    return (
      <VStack alignItems="start">
        <Button
          aria-label="go back to tree"
          size="sm"
          leftIcon={<ArrowLeftIcon />}
          variant="ghost"
          colorScheme="blue"
          onClick={onBack}
          padding="0"
        >
          Back
        </Button>
        <Text fontSize="lg" fontWeight="bold">
          {formType === 'app' ? 'Application' : 'Module'}
        </Text>
        {form}
      </VStack>
    );
  }
);
