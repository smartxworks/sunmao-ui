import React from 'react';
import { HStack, Tag, Text, CloseButton } from '@sunmao-ui/editor-sdk';
import { ComponentSchema } from '@sunmao-ui/core';
import { css, cx } from '@emotion/css';

const ItemStyle = css`
  &:hover {
    background: var(--chakra-colors-blue-50);
  }
`;
const TextStyle = css`
  &.active {
    color: var(--chakra-colors-blue-600);
  }
`;

interface Props {
  dataSource: ComponentSchema;
  tag: string;
  name: string;
  active?: boolean;
  colorMap?: Record<string, string>;
  onItemClick: (dataSource: ComponentSchema) => void;
  onItemRemove: (dataSource: ComponentSchema) => void;
}

export const DataSourceItem: React.FC<Props> = props => {
  const {
    dataSource,
    active,
    colorMap = {},
    tag,
    name,
    onItemClick,
    onItemRemove,
  } = props;

  return (
    <HStack padding="2" display="flex" className={ItemStyle}>
      <HStack
        flex={1}
        onClick={() => onItemClick(dataSource)}
        cursor="pointer"
        className={cx(TextStyle, active ? 'active' : '')}
        overflow="hidden"
      >
        <Tag colorScheme={colorMap[tag]}>{tag}</Tag>
        <Text
          flex={1}
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          title={name}
        >
          {name}
        </Text>
      </HStack>
      <CloseButton size="sm" onClick={() => onItemRemove(dataSource)} />
    </HStack>
  );
};
