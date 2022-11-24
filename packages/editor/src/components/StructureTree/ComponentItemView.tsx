import { TriangleDownIcon } from '@chakra-ui/icons';
import { Box, HStack, IconButton, Spacer, Text } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';

type Props = {
  id: string;
  title: string;
  isSelected: boolean;
  onClick: () => void;
  noChevron: boolean;
  isExpanded?: boolean;
  onClickExpand: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onMouseOver: () => void;
  onMouseLeave: () => void;
  paddingLeft: number;
  actionMenu?: React.ReactNode;
  prefix?: React.ReactNode;
};

const ChevronWidth = 24;

export const ComponentItemView: React.FC<Props> = props => {
  const {
    id,
    title,
    isSelected,
    noChevron,
    isExpanded,
    onClick,
    onClickExpand,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseLeave,
    paddingLeft,
    actionMenu,
    prefix,
  } = props;
  const [isHover, setIsHover] = useState(false);

  const expandIcon = useMemo(
    () => (
      <IconButton
        aria-label="showChildren"
        size="xs"
        variant="unstyled"
        onClick={e => {
          e.stopPropagation();
          onClickExpand();
        }}
        _focus={{
          outline: '0',
        }}
        icon={
          isExpanded ? (
            <TriangleDownIcon />
          ) : (
            <TriangleDownIcon transform="rotate(-90deg)" />
          )
        }
      />
    ),
    [isExpanded, onClickExpand]
  );

  const _onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('moveComponent', id);
    onDragStart && onDragStart();
  };

  const _onDragEnd = () => {
    onDragEnd && onDragEnd();
  };

  const _onMouseOver = () => {
    setIsHover(true);
    onMouseOver();
  };

  const _onMouseLeave = () => {
    setIsHover(false);
    onMouseLeave();
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

  return (
    <Box
      id={`tree-item-${id}`}
      width="full"
      height="32px"
      lineHeight="24px"
      paddingY="4px"
      onMouseOver={_onMouseOver}
      onMouseLeave={_onMouseLeave}
      onDragStart={_onDragStart}
      onDragEnd={_onDragEnd}
      draggable
      cursor="pointer"
      position="relative"
      onClick={onClick}
      backgroundColor={backgroundColor}
    >
      <HStack
        width="full"
        justify="space-between"
        spacing="0"
        margin="auto"
        paddingLeft={`${paddingLeft + (noChevron ? ChevronWidth : 0)}px`}
      >
        {noChevron ? null : expandIcon}
        {prefix}
        <Text
          cursor="pointer"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          fontSize="sm"
          title={title}
        >
          {title}
        </Text>
        <Spacer />
        {isHover ? actionMenu : undefined}
      </HStack>
    </Box>
  );
};
