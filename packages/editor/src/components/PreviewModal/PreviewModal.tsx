import { Box } from '@chakra-ui/react';
import { Application, createModule, Module } from '@sunmao-ui/core';
import { sunmaoChakraUILib } from '@sunmao-ui/chakra-ui-lib';
import { initSunmaoUI } from '@sunmao-ui/runtime';
import React from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { GeneralModal } from '../GeneralModal';
import { ArcoDesignLib } from '@sunmao-ui/arco-lib';
import { EChartsLib } from '@sunmao-ui/echarts-lib';

type Props = {
  app: Application;
  modules: Module[];
  onClose: () => void;
};

export const PreviewModal: React.FC<Props> = ({ app, modules, onClose }) => {
  const { App, registry } = initSunmaoUI();
  modules.forEach(m => registry.registerModule(createModule(m)));
  registry.installLib(sunmaoChakraUILib);
  registry.installLib(ArcoDesignLib);
  registry.installLib(EChartsLib);

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
