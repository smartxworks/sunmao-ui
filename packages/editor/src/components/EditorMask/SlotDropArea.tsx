import React, { useState } from 'react';
import { css, cx } from '@emotion/css';
import { Text } from '@chakra-ui/react';

const SlotDropAreaStyle = css`
  flex: 1 1 0;
  position: relative;

  .outline {
    top: 4px;
    bottom: 4px;
    left: 4px;
    right: 4px;
    position: absolute;
    border: 1px solid black;
    /* create a bfc */
    transform: translate3d(0, 0, 0);
    z-index: 10;
    opacity: 0.5;
  }

  .text {
    position: absolute;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 13;
  }

  &.over {
    .outline {
      background-color: orange;
      box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.6);
      transform: scale(1.1);
      z-index: 12;
    }
    .text {
    }
  }
`;

export const SlotDropArea: React.FC<{
  componentId: string;
  slotId: string;
  isOver: boolean;
}> = ({ componentId, slotId, isOver }) => {
  return (
    <div
      data-slot={slotId}
      className={cx([SlotDropAreaStyle, isOver ? 'over' : undefined])}
    >
      <Text className={cx('text')}>
        {componentId}-{slotId}
      </Text>
      <div className={cx('outline')} />
    </div>
  );
};
