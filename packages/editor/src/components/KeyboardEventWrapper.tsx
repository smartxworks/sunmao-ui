import React, { useRef } from 'react';
import { Box } from '@chakra-ui/react';
import { css } from '@emotion/css';
import { ComponentSchema } from '@sunmao-ui/core';
import { genOperation } from '../operations';
import { PasteManager } from '../operations/PasteManager';
import { EditorServices } from '../types';
import { AppModel } from '../AppModel/AppModel';
import { ComponentId } from '../AppModel/IAppModel';
import { RootId } from '../constants';

type Props = {
  selectedComponentId: string;
  components: ComponentSchema[];
  services: EditorServices;
};

export const KeyboardEventWrapper: React.FC<Props> = ({
  selectedComponentId,
  components,
  services,
  children,
}) => {
  const { eventBus, registry } = services;
  const pasteManager = useRef(new PasteManager());
  const style = css`
    &:focus {
      outline: none;
    }
  `;

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Delete':
      case 'Backspace':
        // if `selectionStart` available,think it is textarea or text input
        if ((e.target as any).selectionStart !== undefined) {
          return;
        }
        eventBus.send(
          'operation',
          genOperation(registry, 'removeComponent', {
            componentId: selectedComponentId,
          })
        );
        break;
      case 'z':
        // FIXME: detect os version and set redo/undo logic
        if (e.metaKey || e.ctrlKey) {
          if (e.shiftKey) {
            eventBus.send('redo');
          } else {
            eventBus.send('undo');
          }
        }
        break;
      case 'y':
        if (e.metaKey || e.ctrlKey) {
          eventBus.send('redo');
        }
        break;
      case 'c':
        // FIXME: detect os version and set redo/undo logic
        if (e.metaKey || e.ctrlKey) {
          const appModel = new AppModel(components, registry);
          const copiedComponent = appModel.getComponentById(
            selectedComponentId as ComponentId
          );
          if (copiedComponent) {
            pasteManager.current.setPasteComponents(copiedComponent);
          }
        }
        break;
      case 'x':
        if (e.metaKey || e.ctrlKey) {
          const appModel = new AppModel(components, registry);
          const copiedComponent = appModel.getComponentById(
            selectedComponentId as ComponentId
          );
          if (copiedComponent) {
            pasteManager.current.setPasteComponents(copiedComponent);
          }
          eventBus.send(
            'operation',
            genOperation(registry, 'removeComponent', {
              componentId: selectedComponentId,
            })
          );
        }
        break;
      case 'v':
        if (e.metaKey || e.ctrlKey) {
          if (pasteManager.current.componentCache) {
            // Clone the component which is going to copy, otherwise the new component will have the same reference.
            const copiedComponentId = pasteManager.current.componentCache.id;
            const copiedComponentsSchema =
              pasteManager.current.componentCache.allComponents.map(c => c.toSchema());
            const clonedComponent = new AppModel(
              copiedComponentsSchema,
              registry
            ).getComponentById(copiedComponentId);
            eventBus.send(
              'operation',
              genOperation(registry, 'pasteComponent', {
                parentId: selectedComponentId || RootId,
                slot: 'content',
                component: clonedComponent!,
                copyTimes: pasteManager.current.copyTimes,
              })
            );
            pasteManager.current.copyTimes++;
          }
        }
        break;
    }
  };

  return (
    <Box
      id="keyboard-event-wrapper"
      className={style}
      width="100%"
      height="100%"
      onKeyDown={onKeyDown}
      tabIndex={-1}
    >
      {children}
    </Box>
  );
};
