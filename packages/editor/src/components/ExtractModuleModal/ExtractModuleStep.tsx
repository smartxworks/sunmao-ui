import React from 'react';
import { List, ListItem, ListIcon } from '@chakra-ui/react';
import { CheckCircleIcon, SettingsIcon } from '@chakra-ui/icons';

type Props = {
  activeIndex: number;
};

export const ExtractModuleStep: React.FC<Props> = ({ activeIndex }) => {
  return (
    <List spacing={3} width="150px" flex="0 0 auto">
      <ListItem
        fontWeight={activeIndex === 0 ? 'bold' : 'normal'}
        color={activeIndex > 0 ? 'gray.500' : 'gray.900'}
      >
        <ListIcon as={activeIndex > 0 ? CheckCircleIcon : SettingsIcon} />
        Module Properties
      </ListItem>

      <ListItem
        fontWeight={activeIndex === 1 ? 'bold' : 'normal'}
        color={activeIndex > 1 ? 'gray.500' : 'gray.900'}
      >
        <ListIcon as={activeIndex > 1 ? CheckCircleIcon : SettingsIcon} />
        Module State
      </ListItem>

      <ListItem
        fontWeight={activeIndex === 2 ? 'bold' : 'normal'}
        color={activeIndex > 2 ? 'gray.500' : 'gray.900'}
      >
        <ListIcon as={activeIndex > 2 ? CheckCircleIcon : SettingsIcon} />
        Module Events
      </ListItem>

      <ListItem
        fontWeight={activeIndex === 3 ? 'bold' : 'normal'}
        color={activeIndex > 3 ? 'gray.500' : 'gray.900'}
      >
        <ListIcon as={activeIndex > 3 ? CheckCircleIcon : SettingsIcon} />
        Preview
      </ListItem>
    </List>
  );
};
