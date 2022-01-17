import { Editor as _Editor } from './components/Editor';
import { initSunmaoUI, SunmaoUIRuntimeProps } from '@sunmao-ui/runtime';
import { AppModelManager } from './operations/AppModelManager';
import React from 'react';
import {
  ChakraProvider,
  extendTheme,
  withDefaultSize,
  withDefaultVariant,
} from '@chakra-ui/react';
import { initEventBus } from './eventBus';
import { EditorStore } from './EditorStore';
import { StorageHandler } from './types';
import { AppStorage } from './AppStorage';
import { Application, Module } from '@sunmao-ui/core';

type SunmaoUIEditorProps = {
  runtimeProps?: SunmaoUIRuntimeProps;
  storageHanlder?: StorageHandler;
  defaultApplication?: Application;
  defaultModules?: Module[];
};

export function initSunmaoEditor(props: SunmaoUIEditorProps = {}) {
  const editorTheme = extendTheme(
    withDefaultSize({
      size: 'sm',
      components: [
        'Input',
        'NumberInput',
        'Checkbox',
        'Radio',
        'Textarea',
        'Select',
        'Switch',
      ],
    }),
    withDefaultVariant({
      variant: 'filled',
      components: ['Input', 'NumberInput', 'Textarea', 'Select'],
    })
  );

  const ui = initSunmaoUI(props.runtimeProps);

  const App = ui.App;
  const registry = ui.registry;
  const stateManager = ui.stateManager;
  const eventBus = initEventBus();
  const appModelManager = new AppModelManager(eventBus);
  const appStorage = new AppStorage(
    props.defaultApplication,
    props.defaultModules,
    props.storageHanlder
  );
  const editorStore = new EditorStore(eventBus, registry, stateManager, appStorage);
  const services = {
    App,
    registry: ui.registry,
    apiService: ui.apiService,
    stateManager,
    appModelManager,
    eventBus,
    editorStore,
  };

  const Editor: React.FC = () => {
    return (
      <ChakraProvider theme={editorTheme}>
        <_Editor
          App={App}
          registry={registry}
          stateStore={stateManager.store}
          services={services}
        />
      </ChakraProvider>
    );
  };

  return {
    Editor,
    registry,
    onChange: () => null,
    onSave: () => null,
  };
}
