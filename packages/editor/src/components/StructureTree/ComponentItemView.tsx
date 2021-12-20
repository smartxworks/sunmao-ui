import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DeleteIcon,
} from '@chakra-ui/icons';
import { Box, HStack, IconButton, Text } from '@chakra-ui/react';
import { useState } from 'react';

type Props = {
  id: string;
  title: string;
  isSelected: boolean;
  onClick: () => void;
  onClickRemove?: () => void;
  noChevron: boolean;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  isDroppable?: boolean;
  isSortable?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
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
    isDroppable,
    isSortable = false,
    onMoveUp,
    onMoveDown,
  } = props;

  const [isDragOver, setIsDragOver] = useState(false);

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

  const onDragOver = () => {
    if (isDroppable) {
      setIsDragOver(true);
    }
  };

  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('moveComponent', id);
  }

  return (
    <Box
      width="full"
      onDragStart={onDragStart}
      // onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={() => setIsDragOver(false)}
      background={isDragOver ? 'gray.100' : undefined}
      draggable
    >
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
        <HStack spacing="1">
          {onClickRemove ? (
            <IconButton
              variant="ghost"
              size="smx"
              aria-label="remove"
              icon={<DeleteIcon />}
              onClick={onClickRemove}
            />
          ) : null}
          {isSortable ? (
            <>
              <IconButton
                variant="ghost"
                size="smx"
                aria-label="remove"
                icon={<ArrowUpIcon />}
                onClick={onMoveUp}
              />
              <IconButton
                variant="ghost"
                size="smx"
                aria-label="remove"
                icon={<ArrowDownIcon />}
                onClick={onMoveDown}
              />
            </>
          ) : null}
        </HStack>
      </HStack>
    </Box>
  );
};
