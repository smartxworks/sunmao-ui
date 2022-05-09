import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { RegistryInterface } from '@sunmao-ui/runtime';
import { useMemo } from 'react';
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
          as={IconButton}
          aria-label="add event"
          size="sm"
          variant="ghost"
          colorScheme="blue"
          icon={<AddIcon />}
          rightIcon={<ChevronDownIcon />}
        />
        <MenuList zIndex={2}>{menuItems}</MenuList>
      </Menu>
    </Box>
  );
};
