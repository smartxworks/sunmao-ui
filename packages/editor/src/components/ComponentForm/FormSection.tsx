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
  style?: React.CSSProperties;
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
  z-index: 1;
  font-size: 18px;
  font-weight: 600;
  color: var(--chakra-colors-gray-600);
  justify-content: space-between;
  background: var(--chakra-colors-gray-50);
`;

const PanelCSS = css`
  position: relative;
  z-index: 0;
`;

export const FormSection: React.FC<Props> = props => {
  return (
    <AccordionItem style={props.style} className={FormSectionCSS} width="full">
      <HStack className={SectionTitleCSS}>
        <Text flex="1">{props.title}</Text>
        <AccordionButton width="auto">
          <AccordionIcon />
        </AccordionButton>
      </HStack>

      <AccordionPanel padding="0" className={PanelCSS}>
        {props.children}
      </AccordionPanel>
    </AccordionItem>
  );
};
