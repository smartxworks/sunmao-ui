import React from 'react';
import { HStack, Tag, Text, CloseButton, IconButton, Tooltip } from '@chakra-ui/react';
import { ComponentSchema } from '@sunmao-ui/core';
import { css, cx } from '@emotion/css';
import { CopyIcon } from '@chakra-ui/icons';
import { DataSourceType } from '../../constants/dataSource';

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
const duplicateButtonStyle = css`
  &&& {
    background: transparent;
    --close-button-size: 24px;
    width: var(--close-button-size);
    height: var(--close-button-size);
    min-width: var(--close-button-size);
    &:hover {
      background: var(--chakra-colors-blackAlpha-100);
    }
  }
`;
interface Props {
  dataSource: ComponentSchema;
  tag: string;
  name: string;
  active?: boolean;
  type?: DataSourceType;
  colorMap?: Record<string, string>;
  onItemClick: (dataSource: ComponentSchema) => void;
  onItemRemove: (dataSource: ComponentSchema) => void;
  onItemDuplicate?: (dataSource: ComponentSchema) => void;
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
    onItemDuplicate,
    type,
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
      {type === DataSourceType.API && (
        <Tooltip label="duplicate" bg="gray.600">
          <IconButton
            className={duplicateButtonStyle}
            aria-label="copy"
            icon={<CopyIcon />}
            size="sm"
            onClick={() => onItemDuplicate!(dataSource)}
          />
        </Tooltip>
      )}
      <Tooltip label="delete" bg="gray.600">
        <CloseButton size="sm" onClick={() => onItemRemove(dataSource)} />
      </Tooltip>
    </HStack>
  );
};
