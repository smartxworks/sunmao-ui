import { Editor as _Editor } from './components/Editor';
import { initSunmaoUI, SunmaoLib, SunmaoUIRuntimeProps } from '@sunmao-ui/runtime';
import { AppModelManager } from './operations/AppModelManager';
import React from 'react';
import {
  ChakraProvider,
  extendTheme,
  withDefaultSize,
  withDefaultVariant,
} from '@chakra-ui/react';
import { initEventBus } from './services/eventBus';
import { EditorStore } from './services/EditorStore';
import { StorageHandler } from './types';
import { AppStorage } from './services/AppStorage';
import { Application, Module } from '@sunmao-ui/core';
import './styles.css';

type SunmaoUIEditorProps = {
  libs?: SunmaoLib[];
  runtimeProps?: SunmaoUIRuntimeProps;
  storageHandler?: StorageHandler;
  defaultApplication?: Application;
  defaultModules?: Module[];
};

export function initSunmaoUIEditor(props: SunmaoUIEditorProps = {}) {
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

  const didMount = () => {
    editorStore.eleMap = ui.eleMap;
    eventBus.send('HTMLElementsUpdated');
  };
  const didUpdate = () => {
    eventBus.send('HTMLElementsUpdated');
  };
  const didDomUpdate = () => {
    eventBus.send('HTMLElementsUpdated');
  };

  const ui = initSunmaoUI({ ...props.runtimeProps, hooks: { didMount, didUpdate, didDomUpdate } });

  const App = ui.App;
  const registry = ui.registry;
  props.libs?.forEach(lib => {
    registry.installLib(lib);
  });

  const stateManager = ui.stateManager;
  const eventBus = initEventBus();
  const appStorage = new AppStorage(
    props.defaultApplication,
    props.defaultModules,
    props.storageHandler
  );
  const appModelManager = new AppModelManager(
    eventBus,
    registry,
    appStorage.app.spec.components
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
          eleMap={ui.eleMap}
          registry={registry}
          stateStore={stateManager.store}
          services={services}
          libs={props.libs || []}
        />
      </ChakraProvider>
    );
  };

  return {
    Editor,
    registry,
  };
}
