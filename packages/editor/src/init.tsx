import { Editor as _Editor } from './components/Editor';
import { initSunmaoUI, SunmaoUIRuntimeProps } from '@sunmao-ui/runtime';
import { AppModelManager } from './operations/AppModelManager';
import React, { useState, useCallback, useEffect } from 'react';
import {
  widgets as internalWidgets,
  WidgetManager,
  ImplementedWidget,
} from '@sunmao-ui/editor-sdk';
import {
  ChakraProvider,
  extendTheme,
  withDefaultSize,
  withDefaultVariant,
  theme,
} from '@chakra-ui/react';
import { initEventBus } from './services/eventBus';
import { EditorStore } from './services/EditorStore';
import { StorageHandler } from './types';
import { AppStorage } from './services/AppStorage';
import { Application, Module } from '@sunmao-ui/core';
import './styles.css';

type SunmaoUIEditorProps = {
  widgets?: ImplementedWidget<any>[];
  runtimeProps?: SunmaoUIRuntimeProps;
  storageHandler?: StorageHandler;
  defaultApplication?: Application;
  defaultModules?: Module[];
};

const zIndices = {
  zIndices: {
    ...theme.zIndices,
    // smaller than the default value of zIndex for chakra modal (1400)
    editorMask: 1399,
    sideMenuIndex: 2,
  },
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
    }),
    zIndices
  );
  const didMount = () => {
    eventBus.send('HTMLElementsUpdated');
    if (props.runtimeProps?.hooks?.didMount) props.runtimeProps.hooks.didMount();
  };
  const didUpdate = () => {
    eventBus.send('HTMLElementsUpdated');
    if (props.runtimeProps?.hooks?.didUpdate) props.runtimeProps.hooks.didUpdate();
  };
  const didDomUpdate = () => {
    eventBus.send('HTMLElementsUpdated');
    if (props.runtimeProps?.hooks?.didDomUpdate) props.runtimeProps.hooks.didDomUpdate();
  };

  const ui = initSunmaoUI({
    ...props.runtimeProps,
    hooks: { didMount, didUpdate, didDomUpdate },
  });

  const App = ui.App;
  const registry = ui.registry;

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
  const widgetManager = new WidgetManager();
  const editorStore = new EditorStore(eventBus, registry, stateManager, appStorage);
  editorStore.eleMap = ui.eleMap;

  const services = {
    ...ui,
    appModelManager,
    widgetManager,
    eventBus,
    editorStore,
  };

  const Editor: React.FC = () => {
    const [store, setStore] = useState(stateManager.store);
    const onRefresh = useCallback(() => {
      // need to reregister all the traits to clear the trait states which like `HasInitializedMap`
      const traits = registry.getAllTraits();

      stateManager.clear();
      setStore(stateManager.store);
      registry.unregisterAllTraits();
      traits.forEach(trait => {
        registry.registerTrait(trait);
      });
    }, []);

    useEffect(() => {
      eventBus.on('stateRefresh', onRefresh);
      return () => {
        eventBus.off('stateRefresh');
      };
    }, [onRefresh]);
    return (
      <ChakraProvider theme={editorTheme}>
        <_Editor
          App={App}
          eleMap={ui.eleMap}
          registry={registry}
          stateStore={store}
          services={services}
          libs={props.runtimeProps?.libs || []}
          onRefresh={onRefresh}
          dependencies={props.runtimeProps?.dependencies || {}}
        />
      </ChakraProvider>
    );
  };

  internalWidgets.concat(props.widgets || []).forEach(widget => {
    widgetManager.registerWidget(widget);
  });

  return {
    Editor,
    registry,
    services,
  };
}
