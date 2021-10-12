import { css } from '@emotion/react';
import React from 'react';
import { eventBus } from '../eventBus';
import { RemoveComponentOperation } from '../operations/Operations';

type Props = {
  selectedComponentId: string;
};

export const KeyboardEventWrapper: React.FC<Props> = props => {
  const style = css`
    &:focus {
      outline: none;
    }
  `;

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Delete':
      case 'Backspace':
        eventBus.send(
          'operation',
          new RemoveComponentOperation(props.selectedComponentId)
        );
        break;
      case 'z':
        if (e.metaKey) {
          eventBus.send('undo');
        }
    }
  };

  return (
    <div css={style} onKeyDown={onKeyDown} tabIndex={-1}>
      {props.children}
    </div>
  );
};
