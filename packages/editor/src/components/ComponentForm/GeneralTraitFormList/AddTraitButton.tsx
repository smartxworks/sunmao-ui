import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { Registry } from '@sunmao-ui/runtime/lib/services/registry';
import { useMemo } from 'react';

type Props = {
  registry: Registry;
  onAddTrait: (traitType: string) => void;
};

export const AddTraitButton: React.FC<Props> = props => {
  const { onAddTrait, registry } = props;

  const traitTypes = useMemo(() => {
    return registry.getAllTraitTypes();
  }, []);

  const menuItems = traitTypes.map(type => {
    return (
      <MenuItem key={type} onClick={() => onAddTrait(type)}>
        {type}
      </MenuItem>
    );
  });
  return (
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
      <MenuList>{menuItems}</MenuList>
    </Menu>
  );
};
