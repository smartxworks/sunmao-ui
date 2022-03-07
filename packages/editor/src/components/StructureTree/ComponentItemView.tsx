import { ChevronDownIcon, ChevronRightIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, HStack, IconButton, Text } from '@chakra-ui/react';
import React from 'react';

type Props = {
  id: string;
  title: string;
  isSelected: boolean;
  onClick: () => void;
  onClickRemove?: () => void;
  noChevron: boolean;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
};

export const ComponentItemView: React.FC<Props> = props => {
  const {
    id,
    title,
    isSelected,
    noChevron,
    isExpanded,
    onClick,
    onToggleExpanded,
    onClickRemove,
    onDragStart,
    onDragEnd,
  } = props;

  const expandIcon = (
    <IconButton
      position="absolute"
      left="-5"
      aria-label="showChildren"
      size="xs"
      variant="unstyled"
      onClick={onToggleExpanded}
      _focus={{
        outline: '0',
      }}
      icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
    />
  );

  const _onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('moveComponent', id);
    onDragStart && onDragStart();
  };

  const _onDragEnd = () => {
    onDragEnd && onDragEnd();
  };

  return (
    <Box width="full" padding="1" onDragStart={_onDragStart} onDragEnd={_onDragEnd} draggable>
      {noChevron ? null : expandIcon}
      <HStack width="full" justify="space-between">
        <Text
          color={isSelected ? 'red.500' : 'black'}
          onClick={onClick}
          cursor="pointer"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
        >
          {title}
        </Text>
        {onClickRemove ? (
          <IconButton
            variant="ghost"
            size="smx"
            aria-label="remove"
            icon={<DeleteIcon />}
            onClick={onClickRemove}
          />
        ) : null}
      </HStack>
    </Box>
  );
};
