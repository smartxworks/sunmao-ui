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
  dependencies: Record<string, any>;
  onClose: () => void;
};

export const PreviewModal: React.FC<Props> = ({
  app,
  modules,
  libs,
  dependencies,
  onClose,
}) => {
  const { App, registry } = initSunmaoUI({ libs, dependencies });
  modules.forEach(m => registry.registerModule(createModule(m)));

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
