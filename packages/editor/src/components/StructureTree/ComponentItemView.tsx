import { ChevronDownIcon, ChevronRightIcon, SmallCloseIcon, TriangleDownIcon } from '@chakra-ui/icons';
import { Box, HStack, IconButton, Spacer, Text } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';

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
  depth: number;
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
    depth,
  } = props;
  const [isHover, setIsHover] = useState(false);

  const expandIcon = (
    <IconButton
      margin="auto"
      ml="-5"
      flex="0 0 auto"
      aria-label="showChildren"
      size="xs"
      variant="unstyled"
      onClick={onToggleExpanded}
      _focus={{
        outline: '0',
      }}
      icon={isExpanded ? <TriangleDownIcon /> : <TriangleDownIcon transform='rotate(-90deg)' />}
    />
  );

  const _onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('moveComponent', id);
    onDragStart && onDragStart();
  };

  const _onDragEnd = () => {
    onDragEnd && onDragEnd();
  };

  const backgroundColor = useMemo(() => {
    if (isSelected) {
      return 'blue.100';
    }
    if (isHover) {
      return 'blue.50';
    }
    return undefined;
  }, [isHover, isSelected]);

  const highlightBackground = (
    <Box
      background={backgroundColor}
      position="absolute"
      top="0"
      bottom="0"
      left={`${-depth * 12}px`}
      right="0"
      zIndex="-1"
    />
  );

  return (
    <Box
      width="full"
      padding="1"
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onDragStart={_onDragStart}
      onDragEnd={_onDragEnd}
      draggable
      cursor="pointer"
      position="relative"
      onClick={onClick}
    >
      {highlightBackground}
      <HStack width="full" justify="space-between" spacing="0">
        {noChevron ? null : expandIcon}
        <Text
          cursor="pointer"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          fontSize="sm"
        >
          {title}
        </Text>
        <Spacer />
        {onClickRemove && isHover ? (
          <IconButton
            variant="ghost"
            colorScheme="red"
            height="20px"
            width="20px"
            aria-label="remove"
            icon={<SmallCloseIcon />}
            onClick={onClickRemove}
          />
        ) : null}
      </HStack>
    </Box>
  );
};
