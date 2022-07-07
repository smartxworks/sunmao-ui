import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
} from '@chakra-ui/react';
import { RegistryInterface } from '@sunmao-ui/runtime';
import React, { useMemo } from 'react';
import { ignoreTraitsList } from '../../../constants';
import { ComponentSchema } from '@sunmao-ui/core';

type Props = {
  registry: RegistryInterface;
  onAddTrait: (traitType: string) => void;
  component: ComponentSchema;
};

export const AddTraitButton: React.FC<Props> = props => {
  const { onAddTrait, registry, component } = props;
  const componentTraitsMap = useMemo(
    () =>
      component.traits.reduce((result, trait) => {
        result[trait.type] = true;
        return result;
      }, {} as Record<string, boolean>),
    [component]
  );
  const traitTypes = useMemo(() => {
    return registry.getAllTraitTypes().filter(type => !ignoreTraitsList.includes(type));
  }, [registry]);

  const menuItems = traitTypes.map(type => {
    return (
      <MenuItem
        key={type}
        isDisabled={componentTraitsMap[type]}
        onClick={() => onAddTrait(type)}
      >
        {type}
      </MenuItem>
    );
  });
  return (
    <Box>
      <Menu>
        <MenuButton
          as={Button}
          aria-label="add event"
          size="sm"
          variant="ghost"
          colorScheme="blue"
          leftIcon={<AddIcon />}
        >
          Add Trait
        </MenuButton>
        <Portal>
          <MenuList>{menuItems}</MenuList>
        </Portal>
      </Menu>
    </Box>
  );
};
