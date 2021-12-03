import { css } from '@emotion/react';
import React from 'react';
import { eventBus } from '../eventBus';
import { genOperation } from '../operations';

type Props = {
  selectedComponentId: string;
};

export const KeyboardEventWrapper: React.FC<Props> = props => {
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
            componentId: props.selectedComponentId,
          })
        );
        break;
      case 'z':
        // FIXME: detect os version and set redo/undo logic
        if (e.metaKey || e.ctrlKey) {
          eventBus.send('undo');
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
          // eventBus.send('copy', { componentId: props.selectedComponentId });
        }
        break;
      case 'x':
        if (e.metaKey || e.ctrlKey) {
          eventBus.send('cutComponent', {
            componentId: props.selectedComponentId,
          });
          eventBus.send(
            'operation',
            genOperation('removeComponent', {
              componentId: props.selectedComponentId,
            })
          );
        }
        break;
      case 'v':
        if (e.metaKey || e.ctrlKey) {
          eventBus.send('paste', {
            componentId: props.selectedComponentId,
          });
        }
        break;
    }
  };

  return (
    <div id="keyboard-event-wrapper" css={style} onKeyDown={onKeyDown} tabIndex={-1}>
      {props.children}
    </div>
  );
};
