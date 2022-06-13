import React from 'react';
import {
  ChevronDownIcon,
  CheckIcon,
  SmallCloseIcon,
  SearchIcon,
  CloseIcon,
} from '@chakra-ui/icons';
import { Spinner } from '@chakra-ui/react';

type RenderNode = React.ReactNode | ((props: any) => React.ReactNode);

export default function getIcons({
  suffixIcon,
  clearIcon,
  menuItemSelectedIcon,
  removeIcon,
  loading,
  multiple,
  prefixCls,
  showArrow,
}: {
  suffixIcon?: React.ReactNode;
  clearIcon?: RenderNode;
  menuItemSelectedIcon?: RenderNode;
  removeIcon?: RenderNode;
  loading?: boolean;
  multiple?: boolean;
  prefixCls: string;
  showArrow?: boolean;
}) {
  let mergedClearIcon = clearIcon;
  if (!clearIcon) {
    mergedClearIcon = <CloseIcon />;
  }

  let mergedSuffixIcon = null;
  if (suffixIcon !== undefined) {
    mergedSuffixIcon = !!showArrow && suffixIcon;
  } else if (loading) {
    mergedSuffixIcon = !!showArrow && <Spinner w="10px" h="10px" />;
  } else {
    const iconCls = `${prefixCls}-suffix`;
    mergedSuffixIcon = ({ open, showSearch }: { open: boolean; showSearch: boolean }) => {
      if (open && showSearch) {
        return !!showArrow && <SearchIcon className={iconCls} />;
      }
      return !!showArrow && <ChevronDownIcon className={iconCls} />;
    };
  }

  let mergedItemIcon = null;
  if (menuItemSelectedIcon !== undefined) {
    mergedItemIcon = menuItemSelectedIcon;
  } else if (multiple) {
    mergedItemIcon = <CheckIcon />;
  } else {
    mergedItemIcon = null;
  }

  let mergedRemoveIcon = null;
  if (removeIcon !== undefined) {
    mergedRemoveIcon = removeIcon;
  } else {
    mergedRemoveIcon = <SmallCloseIcon />;
  }

  return {
    clearIcon: mergedClearIcon,
    suffixIcon: mergedSuffixIcon,
    itemIcon: mergedItemIcon,
    removeIcon: mergedRemoveIcon,
  };
}
