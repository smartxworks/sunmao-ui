import React, { useMemo, useState } from 'react';
import {
  HStack,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spinner,
  Tag,
} from '@chakra-ui/react';
import { css } from '@emotion/css';

interface Props {
  data?: unknown;
  code?: number;
  codeText?: string;
  error?: string;
  loading?: boolean;
}

const CODE_MAP: Record<string, string> = {
  2: 'green',
  3: 'orange',
};
const stringify = (value: any): string => {
  if (!value) return '';

  return value instanceof Object ? JSON.stringify(value, null, 2) : String(value);
};

export const Response: React.FC<Props> = props => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const data = useMemo(() => {
    return stringify(props.data);
  }, [props.data]);
  const error = useMemo(() => {
    return stringify(props.error);
  }, [props.error]);
  return props.data || props.error || props.loading || props.codeText ? (
    <Accordion
      onChange={i => setIsOpen(i === 0)}
      allowToggle
      reduceMotion
      border="solid"
      borderColor="inherit"
    >
      <AccordionItem>
        <h2>
          <AccordionButton>
            <HStack flex="1" textAlign="left" spacing={2}>
              <span>Response</span>
              {props.data || props.error || props.codeText ? (
                <Tag colorScheme={CODE_MAP[String(props.code)[0]] || 'red'}>
                  {props.code} {(props.codeText || '').toLocaleUpperCase()}
                </Tag>
              ) : null}
            </HStack>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4} padding={0} height="250px">
          <Flex alignItems="center" justifyContent="center" height="100%" overflow="auto">
            {props.loading || !isOpen ? (
              <Spinner />
            ) : (
              <pre
                className={css`
                  height: 100%;
                  width: 100%;
                  overflow: auto;
                  padding: 0 20px;
                `}
              >
                <code>{error || data}</code>
              </pre>
            )}
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  ) : null;
};
