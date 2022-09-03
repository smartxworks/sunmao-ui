import React, { useMemo } from 'react';
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
import { CodeEditor } from '../../CodeEditor';
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
  const data = useMemo(() => {
    return stringify(props.data);
  }, [props.data]);
  const error = useMemo(() => {
    return stringify(props.error);
  }, [props.error]);

  return props.data || props.error || props.loading ? (
    <Accordion defaultIndex={0} allowToggle border="solid" borderColor="inherit">
      <AccordionItem>
        <h2>
          <AccordionButton>
            <HStack flex="1" textAlign="left" spacing={2}>
              <span>Response</span>
              {props.data || props.error ? (
                <Tag colorScheme={CODE_MAP[String(props.code)[0]] || 'red'}>
                  {props.code} {(props.codeText || '').toLocaleUpperCase()}
                </Tag>
              ) : null}
            </HStack>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4} padding={0} height="250px">
          <Flex alignItems="center" justifyContent="center" height="100%">
            {props.loading ? (
              <Spinner />
            ) : (
              <CodeEditor
                className={css`
                  width: 100%;
                  height: 100%;
                `}
                mode={{
                  name: 'javascript',
                  json: true,
                }}
                defaultCode={error || data}
              />
            )}
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  ) : null;
};
