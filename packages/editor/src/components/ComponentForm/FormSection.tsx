import React from 'react';
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  HStack,
  Text,
} from '@chakra-ui/react';
import { css } from '@emotion/css';

type Props = {
  title: string;
};

const FormSectionCSS = css`
  padding: 12px;
  padding-top: 8px;
  width: 100%;
  border-bottom: 1px solid var(--chakra-colors-gray-400);
`;

const SectionTitleCSS = css`
  position: sticky;
  padding: 4px 0;
  top: 0;
  z-index: 100;
  font-size: 18px;
  font-weight: 600;
  color: var(--chakra-colors-gray-600);
  justify-content: space-between;
  background: var(--chakra-colors-gray-50);
`;

export const FormSection: React.FC<Props> = props => {
  return (
    <AccordionItem className={FormSectionCSS} width="full">
      <HStack className={SectionTitleCSS}>
        <Text flex='1'>{props.title}</Text>
        <AccordionButton width='auto'>
          <AccordionIcon />
        </AccordionButton>
      </HStack>

      <AccordionPanel padding="0">{props.children}</AccordionPanel>
    </AccordionItem>
  );
};
