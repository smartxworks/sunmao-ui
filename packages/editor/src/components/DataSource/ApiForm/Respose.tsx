import React, { useMemo } from 'react';
import {
  Box,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spinner,
} from '@chakra-ui/react';
import { Error as ErrorInfo } from './Error';
import { Result } from './Result';

interface Props {
  data?: unknown;
  error?: Error;
  loading: boolean;
}

export const Response: React.FC<Props> = props => {
  const data = useMemo(() => {
    return props.data instanceof Object
      ? JSON.stringify(props.data, null, 2)
      : String(props.data);
  }, [props.data]);

  return props.data || props.error || props.loading ? (
    <Accordion defaultIndex={0} allowToggle border="solid" borderColor="inherit">
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Response
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4} padding={0} height="250px">
          <Flex alignItems="center" justifyContent="center" height="100%">
            {props.loading ? (
              <Spinner />
            ) : props.error ? (
              <ErrorInfo error={props.error} />
            ) : (
              <Result defaultCode={data} />
            )}
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  ) : null;
};
