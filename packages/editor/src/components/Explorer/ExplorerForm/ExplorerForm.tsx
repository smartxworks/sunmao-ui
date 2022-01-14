import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Text, VStack } from '@chakra-ui/react';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { AppMetaDataForm } from './AppMetaDataForm';
import { ModuleMetaDataForm } from './ModuleMetaDataForm';
import { EditorServices } from '../../../types';

type Props = {
  formType: 'app' | 'module';
  version: string;
  name: string;
  onBack: () => void;
  services: EditorServices;
};

export const ExplorerForm: React.FC<Props> = observer(
  ({ formType, version, name, onBack, services }) => {
    const { editorStore } = services;
    let form;
    switch (formType) {
      case 'app':
        const appMetaData = {
          name,
          version,
        };
        form = <AppMetaDataForm data={appMetaData} services={services} />;
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
        form = <ModuleMetaDataForm services={services} initData={moduleMetaData} />;
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
