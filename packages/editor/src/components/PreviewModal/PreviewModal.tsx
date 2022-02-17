import { Box } from '@chakra-ui/react';
import { Application, createModule, Module } from '@sunmao-ui/core';
import { initSunmaoUI, SunmaoLib } from '@sunmao-ui/runtime';
import React from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { GeneralModal } from '../GeneralModal';

type Props = {
  app: Application;
  modules: Module[];
  libs: SunmaoLib[];
  onClose: () => void;
};

export const PreviewModal: React.FC<Props> = ({ app, modules, libs, onClose }) => {
  const { App, registry } = initSunmaoUI();
  modules.forEach(m => registry.registerModule(createModule(m)));
  libs.forEach(lib => registry.installLib(lib));

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
