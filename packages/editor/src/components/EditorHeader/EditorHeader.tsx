import React, { useState } from 'react';
import { Flex, Button, Icon } from '@chakra-ui/react';
import { ExpressionWidget } from '@sunmao-ui/editor-sdk';
import { Type } from '@sinclair/typebox';
import { EditorServices } from '../../types';
const SideBarIcon: React.FC<{
  transform?: string;
  color?: string;
  onClick?: () => void;
}> = props => (
  <Icon cursor="pointer" {...props} viewBox="-5 -5 24 24" width="24px" height="24px">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 2.5H8v11h5a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5Zm-10 0h3.5v11H3a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5ZM3 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H3Zm1.5 11.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm1-4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-1-2.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      fill="currentColor"
    />
  </Icon>
);

const MockComp = {
  id: 'mock',
  type: 'core/v1/dummy',
  properties: {},
  traits: [],
};

export const EditorHeader: React.FC<{
  isDisplayLeftMenu: boolean;
  isDisplayRightMenu: boolean;
  setIsDisplayLeftMenu: (show: boolean) => void;
  setIsDisplayRightMenu: (show: boolean) => void;
  onPreview: () => void;
  onCodeMode: () => void;
  onRefresh: () => void;
  services: EditorServices;
}> = ({
  onPreview,
  onCodeMode,
  onRefresh,
  setIsDisplayLeftMenu,
  setIsDisplayRightMenu,
  isDisplayLeftMenu,
  isDisplayRightMenu,
  services,
}) => {
  const [exp, setExp] = useState('');
  return (
    <Flex p={2} borderBottomWidth="2px" borderColor="gray.200" align="center">
      <Flex flex="1">
        <ExpressionWidget
          key={services.editorStore.selectedComponentId}
          component={MockComp}
          spec={Type.Any()}
          services={services}
          path={[]}
          level={0}
          value={exp}
          onChange={v => setExp(v)}
        />
      </Flex>
      <Flex flex="1" align="center" justify="center">
        <SideBarIcon
          color={isDisplayLeftMenu ? '#000' : '#eee'}
          onClick={() => setIsDisplayLeftMenu(!isDisplayLeftMenu)}
        />
        <SideBarIcon
          transform="rotateY(180deg)"
          color={isDisplayRightMenu ? '#000' : '#eee'}
          onClick={() => setIsDisplayRightMenu(!isDisplayRightMenu)}
        />
      </Flex>
      <Flex flex="1" justify="end">
        <Button colorScheme="blue" mr={3} onClick={onCodeMode}>
          Code Mode
        </Button>
        <Button colorScheme="blue" mr={3} onClick={onRefresh}>
          Refresh
        </Button>
        <Button colorScheme="blue" onClick={onPreview}>
          Preview
        </Button>
      </Flex>
    </Flex>
  );
};
