import { Box } from '@chakra-ui/react';
import { Application } from '@sunmao-ui/core';
import { ImplementedRuntimeModule, initSunmaoUI } from '@sunmao-ui/runtime';
import React from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { GeneralModal } from '../GeneralModal';

type Props = {
  app: Application;
  modules: ImplementedRuntimeModule[];
  onClose: () => void;
};

export const PreviewModal: React.FC<Props> = ({ app, modules, onClose }) => {
  const { App, registry } = initSunmaoUI();
  modules.forEach(m => registry.registerModule(m));

  return (
    <GeneralModal onClose={onClose} title="Preview Modal">
      <Box width="full" height="full">
        <ErrorBoundary>
          <App options={app} debugEvent={false} debugStore={false} />
        </ErrorBoundary>
      </Box>
    </GeneralModal>
  );
};
