import { css } from '@emotion/react';
import { ApplicationComponent } from '@sunmao-ui/core';
import React, { useRef } from 'react';
import { eventBus } from '../eventBus';
import { genOperation } from 'operations';
import { PasteManager } from 'operations/PasteManager';

type Props = {
  selectedComponentId: string;
  components: ApplicationComponent[];
};

export const KeyboardEventWrapper: React.FC<Props> = ({
  selectedComponentId,
  components,
  children,
}) => {
  const pasteManager = useRef(new PasteManager());
  const style = css`
    &:focus {
      outline: none;
    }

    width: 100%;
    height: 100%;
  `;

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.target instanceof Element && e.target.id !== 'keyboard-event-wrapper')
      return false;
    switch (e.key) {
      case 'Delete':
      case 'Backspace':
        eventBus.send(
          'operation',
          genOperation('removeComponent', {
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
          pasteManager.current.setPasteComponents(selectedComponentId, components);
        }
        break;
      case 'x':
        if (e.metaKey || e.ctrlKey) {
          pasteManager.current.setPasteComponents(selectedComponentId, components);
          eventBus.send(
            'operation',
            genOperation('removeComponent', {
              componentId: selectedComponentId,
            })
          );
        }
        break;
      case 'v':
        if (e.metaKey || e.ctrlKey) {
          eventBus.send(
            'operation',
            genOperation('pasteComponent', {
              parentId: selectedComponentId,
              slot: 'content',
              components: pasteManager.current.componentsCache,
              copyTimes: pasteManager.current.copyTimes,
            })
          );
          pasteManager.current.copyTimes++;
        }
        break;
    }
  };

  return (
    <div id="keyboard-event-wrapper" css={style} onKeyDown={onKeyDown} tabIndex={-1}>
      {children}
    </div>
  );
};
